import { LogPrismaRepository } from "../../../infra/db/prisma/log/log-prisma-repository";
import { IController } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";

export const makeLogControllerDecorator = (
  controller: IController
): IController => {
  const logPrismaRepository = new LogPrismaRepository();
  return new LogControllerDecorator(controller, logPrismaRepository);
};
