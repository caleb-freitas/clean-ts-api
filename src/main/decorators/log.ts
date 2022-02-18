import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "../../presentation/protocols";

export class LogControllerDecorator implements IController {
  private readonly controller: IController;

  constructor(controller: IController) {
    this.controller = controller;
  }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    // if (httpResponse.statusCode === 500) {
    //   console.log("");
    // }
    return httpResponse;
  }
}