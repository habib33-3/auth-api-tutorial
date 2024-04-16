import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "first name is required",
    }),
    lastName: string({
      required_error: "last name is required",
    }),
    password: string({
      required_error: "password is required",
    }).min(6, "password is too short"),
    passwordConfirmation: string({
      required_error: "password is required",
    }),
    email: string({
      required_error: "password is required",
    }).email("not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "password do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
