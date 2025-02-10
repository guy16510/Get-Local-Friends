import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { GeoUserProfileFunction } from './functions/geoUserProfile/resource';
import { contactFunction } from './functions/contact/resource';
import { directMessageFunction } from './functions/directMessage/resource'; // Import the directMessage function


const functionsFactory = {
  getInstance() {
    return {
      resources: {
        GeoUserProfile: GeoUserProfileFunction,
        contact: contactFunction,
        directMessage: directMessageFunction, // Add the directMessage function
      },
    };
  },
};

defineBackend({
  data,
  functions: functionsFactory,
  auth,
});