import { defineFunction } from "@aws-amplify/backend";

export const userProfileFunction = defineFunction({
  entry: "./handler.ts",
  environment: {
    USER_PROFILE_TABLE_NAME: "UserProfileTable", // ✅ Use plain string
  },
});