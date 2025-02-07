// amplify/functions/GeoUserProfile/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const GeoUserProfileFunction = defineFunction({
  entry: "./handler.ts"
});