// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

export const schema = a.schema({
  Contact: a
  .model({
    name: a.string(),
    email: a.string().required(),
    message: a.string().required(),
    timestamp: a.datetime().required(),
  })
  .authorization((auth) => [auth.publicApiKey()]),

  GeoUserProfile: a
    .model({
      hashKey: a.float(),   // or make it optional if you let dynamodb-geo populate it
      rangeKey: a.string(),
      userId: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      lookingFor: a.string().required(),
      kids: a.boolean().required(),
      drinking: a.boolean().required(),
      lat: a.float().required(),
      lng: a.float().required(),
      hobbies: a.string().array().required(),
      availability: a.string().array().required(),
      married: a.boolean().required(),
      ageRange: a.string().required(),
      friendAgeRange: a.string().required(),
      pets: a.boolean().required(),
      employed: a.boolean(),
      work: a.string(),
      political: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    // For easy direct lookups by userId, define a GSI:
    .secondaryIndexes((index) => [
      index("userId"),    // So we can query by userId
    ])
    .authorization((auth) => [
      auth.publicApiKey(),
      auth.authenticated().to(['read'])
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});