import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
import { contact } from './functions/contact/resource';


defineBackend({
  auth,
  data,
  sayHello,
  contact
});
