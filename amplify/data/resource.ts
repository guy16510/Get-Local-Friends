import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Table for the Geo API using geospatial features.
  GeoItem: a.model({
    hashKey: a.string(),
    rangeKey: a.string(),
    lat: a.float(),
    lng: a.float(),
    userId: a.string(),
  }),

  // Table for the Contact API.
  Contact: a.model({
    email: a.string(),
    name: a.string(),
    summary: a.string(),
  }).authorization(allow => [allow.guest()]),

  // Table for the Chat API.
  Chat: a.model({
    senderId: a.string(),
    receiverId: a.string(),
    message: a.string(),
    timestamp: a.datetime(),
  }),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Default mode is IAM for models that don’t specify an alternative
    defaultAuthorizationMode: "iam",
    // Optionally, if you still want API key support for other endpoints, you can specify:
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});