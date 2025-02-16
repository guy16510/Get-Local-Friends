import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { auth } from './auth/resource';
import { chatApiFunction } from './functions/chat-api/resource';
import { contactApiFunction } from './functions/contact-api/resource';
import { geoApiFunction } from './functions/geo-api/resource';

export const backend = defineBackend({
  data,
  auth,
  chatApiFunction,
  contactApiFunction,
  geoApiFunction
});
