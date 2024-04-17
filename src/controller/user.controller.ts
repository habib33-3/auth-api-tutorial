import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
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
