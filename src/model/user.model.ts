import { nanoid } from "nanoid";
import {
  getModelForClass,
  prop,
  modelOptions,
  Severity,
  pre,
  DocumentType,
  index,
} from "@typegoose/typegoose";
import argon2 from "argon2";

import log from "../utils/logger";

export const privateFields = [
  "password",
  "_v",
  "verificationCode",
  "passwordResetCode",
  "verified",
];

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;
})
@index({
  email: 1,
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({
    lowercase: true,
    required: true,
    unique: true,
  })
  email: string;

  @prop({
    required: true,
  })
  firstName: string;

  @prop({
    required: true,
  })
  lastName: string;

  @prop({
    required: true,
  })
  password: string;

  @prop({
    required: true,
    default: () => nanoid(),
  })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({
    default: false,
  })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      log.error(error, "could't validate password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
