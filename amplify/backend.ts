import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { GeoUserProfileFunction } from './functions/geoUserProfile/resource';
import { contactFunction } from './functions/contact/resource';

const functionsFactory = {
  getInstance() {
    return {
      resources: {
        GeoUserProfile: GeoUserProfileFunction,
        contact: contactFunction
      },
    };
  },
};

defineBackend({
  data,
  functions: functionsFactory,
  auth,
});