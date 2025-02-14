import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  GeoItem: a.model({
    hashKey: a.string(),
    rangeKey: a.string(),
    lat: a.float(),
    lng: a.float(),
    userId: a.string(),
  })
  .authorization(allow => [allow.authenticated()]),  // Changed from private() to owner()

  Contact: a.model({
    email: a.string(),
    name: a.string(),
    summary: a.string(),
  })
  .authorization(allow => [allow.guest()]),  // This is correct

  Chat: a.model({
    senderId: a.string(),
    receiverId: a.string(),
    message: a.string(),
    timestamp: a.datetime(),
  })
  .authorization(allow => [allow.authenticated()]),  // Changed from private() to owner()
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
