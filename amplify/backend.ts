import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { userProfileFunction } from './functions/userProfile/resource';
import { contactFunction } from './functions/contact/resource';

const functionsFactory = {
  getInstance() {
    return {
      resources: {
        userProfile: userProfileFunction,
        contact: contactFunction,
      },
    };
  },
};

defineBackend({
  data,
  functions: functionsFactory,
  auth,
});