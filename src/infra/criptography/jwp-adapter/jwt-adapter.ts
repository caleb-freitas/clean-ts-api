import jwt from "jsonwebtoken";

import { IEncrypter } from "../../../data/protocols/cryptography/encrypter";

export class JwtAdapter implements IEncrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret);
    return accessToken;
  }
}
