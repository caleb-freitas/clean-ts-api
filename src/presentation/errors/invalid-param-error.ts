export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`missing param: ${paramName}`);
    this.name = "InvalidParamError";
  }
}
