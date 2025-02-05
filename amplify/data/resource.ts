import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== SCHEMA DEFINITION =====================================================
This schema now includes:
  - A Todo model with a "content" field and a new "isDone" boolean.
  - A sayHello query.
  - A signup mutation that accepts a complete set of user registration fields.
  - A contact mutation that accepts name, email, and message.
  - A profile query that fetches a user profile by email.
All endpoints use API key authorization.
========================================================================*/
export const schema = a.schema({
  Contact: a
    .model({
      name: a.string(),
      email: a.string().required(),
      message: a.string().required(),
      timestamp: a.datetime().required(),
    })
    .authorization([a.allow.publicApiKey()]),

  UserProfile: a
    .model({
      id: a.id(),
      userId: a.string().required(),
      firstName: a.string().required(),
      lastNameInitial: a.string().required(),
      email: a.string().required(),
      lookingFor: a.string().required(),
      kids: a.string().required(),
      zipcode: a.string().required(),
      drinking: a.string().required(),
      hobbies: a.array(a.string()).required(),
      availability: a.array(a.string()).required(),
      married: a.string().required(),
      ageRange: a.string().required(),
      friendAgeRange: a.string().required(),
      pets: a.string().required(),
      employed: a.string().required(),
      work: a.string().required(),
      political: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization([a.allow.publicApiKey()]),
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
