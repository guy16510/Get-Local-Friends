import { type ClientSchema, a } from "@aws-amplify/backend";

const schema = {
  UserProfile: a.model({
    id: a.id(),
    userId: a.string().required(),
    isSmoker: a.boolean().required(),
    isDrinker: a.boolean().required(),
    hasPets: a.boolean().required(),
    married: a.boolean().required(),
    hasChildren: a.boolean().required(),
    relationshipStatus: a.string().required(),
    isInterestedIn: a.string().required(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization([a.allow.owner()]),
} as const;

export type Schema = ClientSchema<typeof schema>;
export default schema;