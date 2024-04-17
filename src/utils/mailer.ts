import config from "config";
import {
  createTransport,
  getTestMessageUrl,
  SendMailOptions,
} from "nodemailer";
import log from "./logger";

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

const transporter = createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

export const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "error sending email");
    }

    log.info(`Preview URL:${getTestMessageUrl(info)}`);
  });
};
