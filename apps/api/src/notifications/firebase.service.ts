import { Injectable, Logger } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private enabled = false;

  constructor() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Private keys in .env files typically have literal "\n" sequences instead
    // of real newlines - restore them before handing the key to Firebase.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase credentials not set (FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY) - push notifications are disabled, in-app notifications still work.',
      );
      return;
    }

    try {
      if (getApps().length === 0) {
        initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
        });
      }
      this.enabled = true;
    } catch (error: any) {
      this.logger.warn(`Failed to initialize Firebase: ${error.message}`);
    }
  }

  /** Sends the same push to a batch of device tokens; drops any tokens that have gone stale. */
  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
  ): Promise<string[]> {
    if (!this.enabled || tokens.length === 0) return [];

    // FCM caps a multicast at 500 tokens, so larger audiences go out in batches.
    const staleTokens: string[] = [];
    for (let start = 0; start < tokens.length; start += 500) {
      const batch = tokens.slice(start, start + 500);
      try {
        const response = await getMessaging().sendEachForMulticast({
          tokens: batch,
          notification: { title, body },
        });

        response.responses.forEach((result, i) => {
          if (!result.success && this.isTokenInvalid(result.error?.code)) {
            staleTokens.push(batch[i]);
          }
        });
      } catch (error: any) {
        this.logger.warn(`FCM send failed: ${error.message}`);
      }
    }
    return staleTokens;
  }

  private isTokenInvalid(code?: string) {
    return (
      code === 'messaging/invalid-registration-token' ||
      code === 'messaging/registration-token-not-registered'
    );
  }
}
