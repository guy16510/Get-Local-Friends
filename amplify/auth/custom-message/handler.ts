import type { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const locale = event.request.userAttributes["locale"];
    if (locale === "en") {
      event.response.emailMessage = `Your new one-time code is ${event.request.codeParameter}`;
      event.response.emailSubject = "Reset my password";
    } else if (locale === "es") {
      event.response.emailMessage = `Tu nuevo código de un solo uso es ${event.request.codeParameter}`;
      event.response.emailSubject = "Restablecer mi contraseña";
    }
  }

  return event;
};