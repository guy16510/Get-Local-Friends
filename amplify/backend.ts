import { defineBackend } from '@aws-amplify/backend';
import { userProfileFunction } from './functions/user-profile/resource';
import userProfileSchema from './data/user-profile/schema';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
import { contact } from './functions/contact/resource';


defineBackend({
  data: userProfileSchema,
  functions: {
    userProfile: userProfileFunction
  },
  auth,
  data,
  sayHello,
  contact
});
