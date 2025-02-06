import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { userProfileFunction } from './functions/userProfile/resource';
import { contactFunction } from './functions/contact/resource';
import { searchUserProfileFunction } from './functions/searchUserProfile/resource';

const functionsFactory = {
  getInstance() {
    return {
      resources: {
        userProfile: userProfileFunction,
        contact: contactFunction,
        search: searchUserProfileFunction,
      },
    };
  },
};

defineBackend({
  data,
  functions: functionsFactory,
  auth,
});