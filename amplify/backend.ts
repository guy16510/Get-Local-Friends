import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Policy } from "aws-cdk-lib/aws-iam";

import { geoApiFunction } from "./functions/geo-api/resource";
import { contactApiFunction } from "./functions/contact-api/resource";
import { chatApiFunction } from "./functions/chat-api/resource";

import { auth } from "./auth/resource";
import { data } from "./data/resource";

import { addEndpoint } from "./utils/apiUtils";
import { createApiPolicy } from "./utils/apiPolicy";

// Define the backend, including auth, data, and our function resources.
const backend = defineBackend({
  auth,
  data,
  geoApiFunction,
  contactApiFunction,
  chatApiFunction,
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
    allowOrigins: Cors.ALL_ORIGINS, // Update to restrict in production
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

// Create Lambda integrations for our endpoints.
const geoLambdaIntegration = new LambdaIntegration(
  backend.geoApiFunction.resources.lambda
);
const contactLambdaIntegration = new LambdaIntegration(
  backend.contactApiFunction.resources.lambda
);
const chatLambdaIntegration = new LambdaIntegration(
  backend.chatApiFunction.resources.lambda
);

// Create a Cognito User Pools authorizer for secured endpoints.
const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

// Add endpoints for the geo-api, contact-api, and chat-api.
addEndpoint(myRestApi, "geo", geoLambdaIntegration, ["GET", "POST", "PUT", "DELETE"], {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});

addEndpoint(myRestApi, "contact", contactLambdaIntegration, ["GET", "POST"], {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});

addEndpoint(myRestApi, "chat", chatLambdaIntegration, ["GET", "POST"], {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});

// Create and attach an IAM policy to allow API Gateway invoke access.
const apiPolicy = createApiPolicy(apiStack, myRestApi, ["/geo", "/contact", "/chat"], "dev");
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy);

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