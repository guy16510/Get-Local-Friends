import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// First define the Item model
const itemSchema = a.model({
  id: a.id(),
  name: a.string().required(),
  description: a.string(),
  createdAt: a.datetime(),
  updatedAt: a.datetime(),
}).authorization((allow) => [allow.publicApiKey()]);

// Then define the complete schema using the item model
const schema = a.schema({
  Item: itemSchema,

  // Queries
  listItems: a
    .query()
    .returns([itemSchema])
    .authorization((allow) => [allow.publicApiKey()]),

  getItem: a
    .query()
    .arguments({ id: a.string() })
    .returns(itemSchema)
    .authorization((allow) => [allow.publicApiKey()]),

  // Mutations
  createItem: a
    .mutation()
    .arguments({ 
      name: a.string(), 
      description: a.string() 
    })
    .returns(itemSchema)
    .authorization((allow) => [allow.publicApiKey()]),

  updateItem: a
    .mutation()
    .arguments({
      id: a.string(),
      name: a.string(),
      description: a.string(),
    })
    .returns(itemSchema)
    .authorization((allow) => [allow.publicApiKey()]),

  deleteItem: a
    .mutation()
    .arguments({ id: a.string() })
    .returns(itemSchema)
    .authorization((allow) => [allow.publicApiKey()]),
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
