import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Table for the Geo API using geospatial features.
  GeoItem: a
    .model({
      hashKey: a.string(),
      rangeKey: a.string(),
      lat: a.float(),
      lng: a.float(),
      userId: a.string(),
      // Additional fields can be added here.
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Table for the Contact API.
  Contact: a
    .model({
      email: a.string(),
      name: a.string(),
      summary: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Table for the Chat API.
  Chat: a
    .model({
      senderId: a.string(),
      receiverId: a.string(),
      message: a.string(),
      timestamp: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key mode is used for rules like allow.public()
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});