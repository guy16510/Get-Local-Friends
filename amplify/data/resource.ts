import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Chat: a.model({
    id: a.id(),
    message: a.string().required(),
    senderId: a.string().required(),
    receiverId: a.string().required(),
    timestamp: a.datetime().required(),
    status: a.enum(['SENT', 'DELIVERED', 'READ']),
    metadata: a.json()
  }),

  Contact: a.model({
    id: a.id(),
    firstName: a.string().required(),
    lastName: a.string().required(),
    email: a.string().required(),
    phone: a.string(),
    address: a.string(),
    userId: a.string().required(),
    status: a.enum(['ACTIVE', 'BLOCKED', 'PENDING']),
    metadata: a.json()
  }),

  GeoLocation: a.model({
    id: a.id(),
    latitude: a.float().required(),
    longitude: a.float().required(),
    userId: a.string().required(),
    timestamp: a.datetime().required(),
    accuracy: a.float(),
    altitude: a.float(),
    speed: a.float(),
    heading: a.float(),
    metadata: a.json()
  })
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});