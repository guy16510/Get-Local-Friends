import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// First define the Item model
const itemSchema = a.model({
  id: a.id(),
  name: a.string().required(),
  description: a.string(),
  createdAt: a.datetime(),
  updatedAt: a.datetime(),
}).authorization([a.allow.public()]);

// Then define the complete schema using the item model
const schema = a.schema({
  Item: itemSchema,

  // Queries
  listItems: a
    .query()
    .returns([itemSchema])
    .authorization([a.allow.public()]),

  getItem: a
    .query()
    .arguments({ id: a.string() })
    .returns(itemSchema)
    .authorization([a.allow.public()]),

  // Mutations
  createItem: a
    .mutation()
    .arguments({ 
      name: a.string(), 
      description: a.string() 
    })
    .returns(itemSchema)
    .authorization([a.allow.public()]),

  updateItem: a
    .mutation()
    .arguments({
      id: a.string(),
      name: a.string(),
      description: a.string(),
    })
    .returns(itemSchema)
    .authorization([a.allow.public()]),

  deleteItem: a
    .mutation()
    .arguments({ id: a.string() })
    .returns(itemSchema)
    .authorization([a.allow.public()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data: ReturnType<typeof defineData> = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
