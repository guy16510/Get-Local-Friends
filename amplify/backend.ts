import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { handler as contactUsFunction } from './function/contactUsFunction/dist/index';
import { handler as geoSpatialFunction } from './function/geoSpatialFunction/dist/index';
import { handler as chatFunction } from './function/chatFunction/dist/index';

const functionsFactory = {
  getInstance() {
    return {
      resources: {
        contactUs: contactUsFunction,
        geoSpatial: geoSpatialFunction,
        chat: chatFunction,
      },
    };
  },
};

export default defineBackend({
  auth,
  functions: functionsFactory,
});