import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../service/user.service";
import { sendEmail } from "../utils/mailer";

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
