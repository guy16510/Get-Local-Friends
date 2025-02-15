import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  GeoItem: a.model({
    hashKey: a.string(),
    rangeKey: a.string(),
    lat: a.float(),
    lng: a.float(),
    userId: a.string(),
  })
  .authorization(allow => [allow.groups(["authenticated", "premium"])]), // now only users in these groups can access

  Contact: a.model({
    email: a.string(),
    name: a.string(),
    summary: a.string(),
  })
  .authorization(allow => [allow.guest()]),  // still open

  Chat: a.model({
    senderId: a.string(),
    receiverId: a.string(),
    message: a.string(),
    timestamp: a.datetime(),
  })
  .authorization(allow => [allow.groups(["authenticated", "premium"])]), // only these groups allowed
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