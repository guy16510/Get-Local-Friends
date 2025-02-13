import { defineBackend } from '@aws-amplify/backend';
import { itemsApi } from './functions/itemsApi/resource';
import { data } from './data/resource';
import { auth } from './auth/resource';

const backend = defineBackend({
  itemsApi, 
  data,
  auth
});

export default backend;
