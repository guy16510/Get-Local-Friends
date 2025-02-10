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
      hashKey: a.float(),
      rangeKey: a.string(),
      userId: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      lookingFor: a.string().array().required(),
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
    .secondaryIndexes((index) => [index("userId")])
    .authorization((auth) => [
      auth.publicApiKey(),
      auth.authenticated().to(["read"]),
    ]),

  // Conversation Model
  Conversation: a
    .model({
      user1Id: a.string().required(),
      user2Id: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [index("user1Id"), index("user2Id")])
    .authorization((auth) => [
      auth.authenticated().to(["create", "read", "update", "delete"]),
    ]),

  // Message Model
  Message: a
    .model({
      conversationId: a.string().required(),
      senderId: a.string().required(),
      recipientId: a.string().required(),
      content: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((auth) => [
      auth.authenticated().to(["create", "read", "update", "delete"]),
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

// // Export models directly for permission management
// export const ConversationModel = schema.types.Conversation;
// export const MessageModel = schema.types.Message;