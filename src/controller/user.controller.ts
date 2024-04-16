import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const body = req.body;

  try {
   await createUser(body);

    return res.send("user successfully  created");
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send("already exists");
    }

    return res.status(500).send(error);
  }
};
