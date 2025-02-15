// backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";

import { geoApiFunction } from "./functions/geo-api/resource";
import { contactApiFunction } from "./functions/contact-api/resource";
import { chatApiFunction } from "./functions/chat-api/resource";
import { addPremiumGroupFunction } from "./functions/addPremiumGroup-api/resource";

import { auth } from "./auth/resource";
import { data } from "./data/resource";

import { addEndpoint } from "./utils/apiUtils";

// Define the backend including auth, data, and our Lambda functions.
const backend = defineBackend({
  auth,
  data,
  geoApiFunction,
  contactApiFunction,
  chatApiFunction,
  addPremiumGroupFunction,
});

// Create an API stack.
const apiStack = backend.createStack("api-stack");

// Create a new REST API with CORS and stage settings.
const myRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "myRestApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Allow all origins (adjust as needed for production)
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

// Create Lambda integrations for each endpoint.
const geoLambdaIntegration = new LambdaIntegration(
  backend.geoApiFunction.resources.lambda
);
const contactLambdaIntegration = new LambdaIntegration(
  backend.contactApiFunction.resources.lambda
);
const chatLambdaIntegration = new LambdaIntegration(
  backend.chatApiFunction.resources.lambda
);
const premiumLambdaIntegration = new LambdaIntegration(
  backend.addPremiumGroupFunction.resources.lambda
);

// Define your routes using your custom addEndpoint helper.
// Here, we set authorizationType to NONE to make all endpoints public.
addEndpoint(myRestApi, "geo", geoLambdaIntegration, ["GET", "POST", "PUT", "DELETE"], {
  authorizationType: AuthorizationType.NONE,
});
addEndpoint(myRestApi, "contact", contactLambdaIntegration, ["GET", "POST"], {
  authorizationType: AuthorizationType.NONE,
});
addEndpoint(myRestApi, "chat", chatLambdaIntegration, ["GET", "POST"], {
  authorizationType: AuthorizationType.NONE,
});
addEndpoint(myRestApi, "premium", premiumLambdaIntegration, ["POST"], {
  authorizationType: AuthorizationType.NONE,
});

// Export API details via outputs.
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },
  },
});

export default backend;