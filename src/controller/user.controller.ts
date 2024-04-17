import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../service/user.service";
import { sendEmail } from "../utils/mailer";
import log from "../utils/logger";
import { nanoid } from "nanoid";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `verification code ${user.verificationCode},id:${user._id}`,
    });

    return res.send("user successfully  created");
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send("already exists");
    }

    return res.status(500).send(error);
  }
};

export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response
) => {
  const id = req.params.id;

  const verificationCode = req.params.verificationCode;

  // find the user by id
  const user = await findUserById(id);

  if (!user) {
    return res.status(404).send("could not verify");
  }

  if (user.verified) {
    return res.send("user already verified");
  }

  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send("user verified");
  }

  return res.send("could not verified user");
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  const message = "if a user exist, you will receive password";

  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`${email} don't exists`);

    return res.send(message);
  }

  if (!user.verified) {
    return res.send("user isn't verified");
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    from: "test@example.com",
    to: user.email,
    subject: "Reset your password",
    text: `verification code ${passwordResetCode}, id:${user._id}`,
  });

  log.debug("password sent to user");

  return res.send(message);
};

export const resetPasswordHandler = async (
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) => {
  const { id, passwordResetCode } = req.params;

  const { password, passwordConfirmation } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("could not reset password");
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send("password reset done");
};

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  return res.send(res.locals.user);
};
