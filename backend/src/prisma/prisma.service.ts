import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): void {
    this.$on('beforeExit' as never, () => {
      void app.close();
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase should only be used in test environment!');
    }

    const modelNames = Object.getOwnPropertyNames(this)
      .filter((key) => key[0] !== '_' && key[0] !== '$')
      .filter(
        (key) =>
          typeof (this as Record<string, unknown>)[key] === 'object' &&
          (this as Record<string, unknown>)[key] !== null,
      );

    for (const modelName of modelNames) {
      try {
        const modelUnknown = (this as Record<string, unknown>)[modelName];
        const deleteMany = (
          modelUnknown as { deleteMany?: (args: unknown) => Promise<unknown> }
        ).deleteMany;
        if (typeof deleteMany === 'function') {
          await deleteMany({});
        }
      } catch {
        continue;
      }
    }
  }
}
