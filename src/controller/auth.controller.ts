import { Request, Response } from "express";
import { createSessionType } from "../schema/auth.schema";
import { findUserByEmail } from "../service/user.service";
import { signAccessToken, signRefreshToken } from "../service/auth.service";

export const createSessionHandler = async (
  req: Request<{}, {}, createSessionType>,
  res: Response
) => {
  const message = "invalid email or password";

  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  const accessToken = signAccessToken(user);

  const refreshToken = await signRefreshToken({
    userId: user._id,
  });

  return res.send({
    accessToken,
    refreshToken,
  });
};
