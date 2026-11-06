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
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';

const STAFF_ROLES = ['ROOT', 'ADMIN', 'STAFF'];

interface OnlineStaff {
  uuid: string;
  name: string;
  avatar: string | null;
  role: string;
  position: string;
  away: boolean;
}

interface Member extends OnlineStaff {
  // One person can have the portal open in several tabs; they stay online
  // until the last one closes, and count as away only if every tab is away.
  sockets: Map<string, { away: boolean }>;
}

/**
 * Tracks which staff currently have the portal open, per branch. Each staff
 * tab joins its branch room; everyone in the room receives the full list
 * whenever someone arrives, leaves or goes away (tab hidden).
 *
 * State is in memory, so it reflects this API instance only. Running several
 * instances would need the socket.io Redis adapter and a shared store.
 */
@WebSocketGateway({
  namespace: 'presence',
  cors: { origin: '*' },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(PresenceGateway.name);
  // branch uuid -> user uuid -> member
  private branches = new Map<string, Map<string, Member>>();

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query?.token as string);
      if (!token) throw new UnauthorizedException();

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret',
      ) as DecodedUser;
      if (!STAFF_ROLES.includes(decoded.role))
        throw new UnauthorizedException();

      client.data.user = decoded;
    } catch {
      client.emit('unauthorized', { message: 'Unauthenticated' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.removeSocket(client);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { branch_uuid?: string; away?: boolean },
  ) {
    const decoded = client.data.user as DecodedUser | undefined;
    const branchUuid = body?.branch_uuid;
    if (!decoded || typeof branchUuid !== 'string' || !branchUuid) return;

    // Only join branches the user actually has access to, and take the name
    // and avatar from the database rather than trusting the client.
    const access = await this.prisma.branchAccess.findFirst({
      where: { user_uuid: decoded.uuid, branch_uuid: branchUuid },
      include: {
        user: {
          select: { name: true, avatar: true, role: true, position: true },
        },
      },
    });
    if (!access?.user || !client.connected) return;

    this.removeSocket(client);
    client.data.branchUuid = branchUuid;
    await client.join(this.room(branchUuid));

    const members = this.branches.get(branchUuid) ?? new Map<string, Member>();
    this.branches.set(branchUuid, members);
    const member: Member = members.get(decoded.uuid) ?? {
      uuid: decoded.uuid,
      name: access.user.name || 'Staff',
      avatar: access.user.avatar,
      role: access.user.role,
      position: access.user.position,
      away: false,
      sockets: new Map(),
    };
    member.sockets.set(client.id, { away: !!body.away });
    members.set(decoded.uuid, member);

    this.broadcast(branchUuid);
  }

  /** The tab was hidden or shown again. */
  @SubscribeMessage('status')
  handleStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { away?: boolean },
  ) {
    const branchUuid = client.data.branchUuid as string | undefined;
    const user = client.data.user as DecodedUser | undefined;
    const socket = branchUuid
      ? this.branches
          .get(branchUuid)
          ?.get(user?.uuid ?? '')
          ?.sockets.get(client.id)
      : undefined;
    if (!branchUuid || !socket) return;
    socket.away = !!body?.away;
    this.broadcast(branchUuid);
  }

  private removeSocket(client: Socket) {
    const branchUuid = client.data.branchUuid as string | undefined;
    const user = client.data.user as DecodedUser | undefined;
    if (!branchUuid || !user) return;

    client.leave(this.room(branchUuid));
    client.data.branchUuid = undefined;

    const members = this.branches.get(branchUuid);
    const member = members?.get(user.uuid);
    if (!members || !member) return;

    member.sockets.delete(client.id);
    if (member.sockets.size === 0) members.delete(user.uuid);
    if (members.size === 0) this.branches.delete(branchUuid);
    this.broadcast(branchUuid);
  }

  private broadcast(branchUuid: string) {
    const staff: OnlineStaff[] = Array.from(
      this.branches.get(branchUuid)?.values() ?? [],
    )
      .map(({ sockets, ...member }) => ({
        ...member,
        away: Array.from(sockets.values()).every((s) => s.away),
      }))
      .sort(
        (a, b) =>
          Number(a.away) - Number(b.away) || a.name.localeCompare(b.name),
      );
    this.server.to(this.room(branchUuid)).emit('presence', staff);
  }

  private room(branchUuid: string) {
    return `branch:${branchUuid}`;
  }
}
