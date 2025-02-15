// backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";

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
    allowOrigins: Cors.ALL_ORIGINS, // Adjust for production as needed
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



const rawBranchName = process.env.BRANCH_NAME || "default";
const branchName = `${rawBranchName}`;

const contactTableName = `Contact-${branchName}`;
const geoTableName = `GeoItemt-${branchName}`;
const chatTableName = `Chat-${branchName}`;

// Cast each function to a concrete lambda.Function to use addEnvironment.
const contactLambdaFn = backend.contactApiFunction.resources.lambda as lambda.Function;
contactLambdaFn.addEnvironment("CONTACT_TABLE", contactTableName);

const geoLambdaFn = backend.geoApiFunction.resources.lambda as lambda.Function;
geoLambdaFn.addEnvironment("GEO_TABLE", geoTableName);

const chatLambdaFn = backend.chatApiFunction.resources.lambda as lambda.Function;
chatLambdaFn.addEnvironment("CHAT_TABLE", chatTableName);

// ---
// Attach DynamoDB permissions for each API's Lambda function.
const region = Stack.of(myRestApi).region;
const account = Stack.of(myRestApi).account;

const contactLambdaRole = backend.contactApiFunction.resources.lambda.role;
if (contactLambdaRole) {
  contactLambdaRole.addToPrincipalPolicy(
    new PolicyStatement({
      actions: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem"],
      resources: [`arn:aws:dynamodb:${region}:${account}:table/${contactTableName}`],
    })
  );
}

const geoLambdaRole = backend.geoApiFunction.resources.lambda.role;
if (geoLambdaRole) {
  geoLambdaRole.addToPrincipalPolicy(
    new PolicyStatement({
      actions: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
      resources: [`arn:aws:dynamodb:${region}:${account}:table/${geoTableName}`],
    })
  );
}

const chatLambdaRole = backend.chatApiFunction.resources.lambda.role;
if (chatLambdaRole) {
  chatLambdaRole.addToPrincipalPolicy(
    new PolicyStatement({
      actions: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem"],
      resources: [`arn:aws:dynamodb:${region}:${account}:table/${chatTableName}`],
    })
  );
}

// ---
// Export API details via outputs.
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: region,
        apiName: myRestApi.restApiName,
      },
    },
  },
});

export default backend;