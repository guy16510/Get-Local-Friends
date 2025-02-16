// // data/resource.ts
// import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// const schema = a.schema({
//   GeoItem: a.model({
//     hashKey: a.string(),
//     rangeKey: a.string(),
//     lat: a.float(),
//     lng: a.float(),
//     userId: a.string(),
//   })
//   // Changed from groups(["authenticated", "premium"]) to guest()
//   .authorization(allow => [allow.guest()]),

//   Contact: a.model({
//     email: a.string(),
//     name: a.string(),
//     summary: a.string(),
//   })
//   .authorization(allow => [allow.guest()]),

//   Chat: a.model({
//     senderId: a.string(),
//     receiverId: a.string(),
//     message: a.string(),
//     timestamp: a.datetime(),
//   })
//   // Changed from groups(["authenticated", "premium"]) to guest()
//   .authorization(allow => [allow.guest()]),
// });

// export type Schema = ClientSchema<typeof schema>;

// export const data = defineData({
//   schema,
//   // You can keep your defaultAuthorizationMode as "iam" or adjust it
//   // if you want to leverage API Key auth mode for public endpoints.
//   authorizationModes: {
//     defaultAuthorizationMode: "iam",
//     apiKeyAuthorizationMode: {
//       expiresInDays: 30,
//     },
//   },
// });

import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
      content: a.string(),
      isDone: a.boolean()
    })
    .authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});