import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { chatApiFunction } from "./functions/chat-api/resource";
import { geoApiFunction } from "./functions/geo-api/resource";
import { contactApiFunction } from "./functions/contact-api/resource";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
  chatApiFunction,
  geoApiFunction,
  contactApiFunction,
});

// Create a new API stack
const apiStack = backend.createStack("api-stack");

// Create a new REST API
const getLocalFriendsApi = new RestApi(apiStack, "RestApi", {
  restApiName: "getLocalFriendsApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

// Create Lambda integrations for each API function
const chatLambdaIntegration = new LambdaIntegration(
  backend.chatApiFunction.resources.lambda
);
const geoLambdaIntegration = new LambdaIntegration(
  backend.geoApiFunction.resources.lambda
);
const contactLambdaIntegration = new LambdaIntegration(
  backend.contactApiFunction.resources.lambda
);

// Create new resource paths for each API function with IAM authorization

// Chat API endpoint
const chatPath = getLocalFriendsApi.root.addResource("chat", {
  defaultMethodOptions: { authorizationType: AuthorizationType.IAM },
});
chatPath.addMethod("ANY", chatLambdaIntegration);
chatPath.addProxy({
  anyMethod: true,
  defaultIntegration: chatLambdaIntegration,
});

// Geo API endpoint
const geoPath = getLocalFriendsApi.root.addResource("geo", {
  defaultMethodOptions: { authorizationType: AuthorizationType.IAM },
});
geoPath.addMethod("ANY", geoLambdaIntegration);
geoPath.addProxy({
  anyMethod: true,
  defaultIntegration: geoLambdaIntegration,
});

// Contact API endpoint
const contactPath = getLocalFriendsApi.root.addResource("contact", {
  defaultMethodOptions: { authorizationType: AuthorizationType.IAM },
});
contactPath.addMethod("ANY", contactLambdaIntegration);
contactPath.addProxy({
  anyMethod: true,
  defaultIntegration: contactLambdaIntegration,
});

// Create a Cognito User Pools authorizer
const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

// Create a resource path with Cognito authorization.
// Here I’ve chosen to use the chat Lambda integration, assuming chat needs user auth.
// Adjust as necessary.
const cognitoAuthPath = getLocalFriendsApi.root.addResource("cognito-auth-path");
cognitoAuthPath.addMethod("GET", chatLambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});

// Create an IAM policy to allow Invoke access to the API
const apiRestPolicy = new Policy(apiStack, "RestApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        // Chat endpoint
        `${getLocalFriendsApi.arnForExecuteApi("*", "/chat", "dev")}`,
        `${getLocalFriendsApi.arnForExecuteApi("*", "/chat/*", "dev")}`,
        // Geo endpoint
        `${getLocalFriendsApi.arnForExecuteApi("*", "/geo", "dev")}`,
        `${getLocalFriendsApi.arnForExecuteApi("*", "/geo/*", "dev")}`,
        // Contact endpoint
        `${getLocalFriendsApi.arnForExecuteApi("*", "/contact", "dev")}`,
        `${getLocalFriendsApi.arnForExecuteApi("*", "/contact/*", "dev")}`,
        // Cognito-protected endpoint
        `${getLocalFriendsApi.arnForExecuteApi("*", "/cognito-auth-path", "dev")}`,
        `${getLocalFriendsApi.arnForExecuteApi("*", "/cognito-auth-path/*", "dev")}`,
      ],
    }),
  ],
});

// Attach the policy to both authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiRestPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiRestPolicy);

// Add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [getLocalFriendsApi.restApiName]: {
        endpoint: getLocalFriendsApi.url,
        region: Stack.of(getLocalFriendsApi).region,
        apiName: getLocalFriendsApi.restApiName,
      },
    },
  },
});