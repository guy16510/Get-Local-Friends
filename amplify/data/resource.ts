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
      id: a.id(),
      userId: a.string().required(),
      firstName: a.string().required(),
      lastNameInitial: a.string().required(),
      email: a.string().required(),
      lookingFor: a.string().required(),
      kids: a.boolean().required(),
      zipcode: a.string().required(),
      drinking: a.boolean().required(),
      geohash: a.string().required(),
      rangeKey: a.string().required(),
      lat: a.float().required(),
      lng: a.float().required(),
      hobbies: a.string().array().required(),
      availability: a.string().array().required(),
      married: a.boolean().required(),
      ageRange: a.string().required(),
      friendAgeRange: a.string().required(),
      pets: a.boolean().required(),
    })
    .authorization((auth) => [
      auth.publicApiKey(),
      auth.authenticated().to(['read']) // Grant read access to authenticated users
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