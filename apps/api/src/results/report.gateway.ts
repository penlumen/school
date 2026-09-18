import { Logger, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { DecodedUser } from '../common/types/auth.js';

interface PresenceEntry {
  socketId: string;
  uuid: string;
  name: string;
  avatar?: string | null;
}

/**
 * One room per result_uuid. Everyone viewing the same report card joins the
 * same room; field-level edits are rebroadcast to everyone else in that room
 * as they happen (live sync), and a presence list is kept per room so the UI
 * can show who else is currently on the page.
 */
@WebSocketGateway({
  namespace: 'reports',
  cors: { origin: '*' },
})
export class ReportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ReportGateway.name);
  // room -> socketId -> presence entry
  private presence = new Map<string, Map<string, PresenceEntry>>();

  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string);

      if (!token) throw new UnauthorizedException();

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret',
      ) as DecodedUser & { name?: string; avatar?: string };

      client.data.user = decoded;
    } catch {
      client.emit('unauthorized', { message: 'Unauthenticated' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [room, members] of this.presence.entries()) {
      if (members.delete(client.id)) {
        this.broadcastPresence(room);
        if (members.size === 0) this.presence.delete(room);
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { result_uuid: string; name: string; avatar?: string },
  ) {
    const room = this.roomName(body.result_uuid);
    client.join(room);

    if (!this.presence.has(room)) this.presence.set(room, new Map());
    this.presence.get(room)!.set(client.id, {
      socketId: client.id,
      uuid: client.data.user.uuid,
      name: body.name,
      avatar: body.avatar,
    });

    this.broadcastPresence(room);
  }

  @SubscribeMessage('leave')
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() body: { result_uuid: string }) {
    const room = this.roomName(body.result_uuid);
    client.leave(room);
    const members = this.presence.get(room);
    if (members?.delete(client.id)) {
      this.broadcastPresence(room);
      if (members.size === 0) this.presence.delete(room);
    }
  }

  /**
   * A field on the report changed (an assessment score, or a remark).
   * Rebroadcast to everyone else in the room so their view updates live,
   * instead of waiting for a save + refetch — this is what prevents two
   * people's concurrent edits from silently overwriting each other.
   */
  @SubscribeMessage('field-change')
  handleFieldChange(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      result_uuid: string;
      field: string; // e.g. "assessment:<uuid>:ca_one" or "teacher_remark"
      value: string | number;
    },
  ) {
    const room = this.roomName(body.result_uuid);
    const sender = this.presence.get(room)?.get(client.id);
    client.to(room).emit('field-changed', {
      field: body.field,
      value: body.value,
      by: sender ? { uuid: sender.uuid, name: sender.name } : null,
    });
  }

  /** Tells the room a save just happened, so everyone refetches the canonical state. */
  @SubscribeMessage('saved')
  handleSaved(@ConnectedSocket() client: Socket, @MessageBody() body: { result_uuid: string }) {
    const room = this.roomName(body.result_uuid);
    client.to(room).emit('report-saved');
  }

  private broadcastPresence(room: string) {
    const members = Array.from(this.presence.get(room)?.values() || []);
    this.server.to(room).emit('presence', members);
  }

  private roomName(resultUuid: string) {
    return `report:${resultUuid}`;
  }
}
