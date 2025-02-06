// amplify/functions/searchUserProfile/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const searchUserProfileFunction = defineFunction({
  entry: "./handler.ts",
  environment: {
    USER_PROFILE_TABLE_NAME: "UserProfileTable",
  },
});