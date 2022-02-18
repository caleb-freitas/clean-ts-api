import { ILogErrorRepository } from "../../../../data/protocols/log-error-repository";
import { prisma } from "../client/prisma-client";

export class LogPrismaRepository implements ILogErrorRepository {
  async logError(stack: string): Promise<void> {
    await prisma.errors.create({
      data: {
        stack,
      },
    });
  }
}
