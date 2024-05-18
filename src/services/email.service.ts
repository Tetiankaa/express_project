import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import SendGrid from "@sendgrid/mail";

import { config } from "../configs/config";
import { emailTemplateConstants } from "../constants/email-template.constants";
import { EEmailType } from "../enums/email-type.enum";
import { EmailPayloadType } from "../types/email-payload.type";

class EmailService {
  constructor() {
    SendGrid.setApiKey(config.SENDGRID_API_KEY);
  }

  public async sendByEmailType<T extends EEmailType>(
    emailType: T,
    dynamicTemplateData: EmailPayloadType[T],
  ): Promise<void> {
    try {
      const templateId = emailTemplateConstants[emailType].templateId;

      await this.send({
        from: config.SENDGRID_FROM_EMAIL,
        to: config.ADMIN_EMAIL_FOR_CAR_SUGGESTION,
        templateId,
        dynamicTemplateData,
      });
    } catch (e) {
      console.error(e);
    }
  }
  private async send(email: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(email);
    } catch (e) {
      console.error(e);
    }
  }
}

export const emailService = new EmailService();
