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
      // NEW geospatial fields:
      lat: a.float().required(),
      lng: a.float().required(),
      hobbies: a.string().array().required(),
      availability: a.string().array().required(),
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
    .secondaryIndexes((index) => [index("zipcode")])
    .authorization((auth) => [auth.publicApiKey()]),
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