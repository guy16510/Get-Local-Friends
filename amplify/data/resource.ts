import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sayHello } from "../functions/say-hello/resource";
import { contact } from "../functions/contact/resource";

/*== SCHEMA DEFINITION =====================================================
This schema now includes:
  - A Todo model with a "content" field and a new "isDone" boolean.
  - A sayHello query.
  - A signup mutation that accepts a complete set of user registration fields.
  - A contact mutation that accepts name, email, and message.
  - A profile query that fetches a user profile by email.
All endpoints use API key authorization.
========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(sayHello))
    .authorization((allow) => [allow.publicApiKey()]),
  contact: a
    .mutation()
    .arguments({
      name: a.string(),
      email: a.string(),
      message: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(contact))
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
