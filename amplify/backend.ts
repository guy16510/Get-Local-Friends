import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { handler as contactUsFunction } from './function/contactUsFunction/src/index';
import { handler as geoSpatialFunction } from './function/geoSpatialFunction/src/index';
// import { handler as chatFunction } from './function/chatFunction/src/index';

const functionsFactory = {
  getInstance() {
    return {
      resources: {
        contactUs: contactUsFunction,
        geoSpatial: geoSpatialFunction,
        // chat: chatFunction,
      },
    };
  },
};

export default defineBackend({
  auth,
  functions: functionsFactory,
});
