export class EmailInUseError extends Error {
  constructor() {
    super("the received email is already in use");
    this.name = "EmailInUseError";
  }
}
