import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { userProfileFunction } from "./functions/userProfile/resource";
import { handler as contactFunction } from './functions/contact/handler';



defineBackend({
  data,
  functions: {
    userProfile: userProfileFunction, // ✅ Ensure this is correctly imported
    contact: contactFunction
  },
  auth
});