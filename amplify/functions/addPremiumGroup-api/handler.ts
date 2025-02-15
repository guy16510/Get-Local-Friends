// functions/addPremiumGroup-api/handler.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognito = new CognitoIdentityServiceProvider();

// The user pool id is provided via environment variables.
const USER_POOL_ID = process.env.USER_POOL_ID || "";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // With a Cognito authorizer, API Gateway injects the user's claims
    const claims = event.requestContext.authorizer?.claims;
    if (!claims) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized: no claims found" }),
      };
    }

    const username = claims["cognito:username"];
    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Username not found in claims" }),
      };
    }

    // Call the Cognito admin API to add the user to the "premium" group.
    await cognito
      .adminAddUserToGroup({
        GroupName: "premium",
        UserPoolId: USER_POOL_ID,
        Username: username,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User added to premium group successfully" }),
    };
  } catch (error: any) {
    console.error("Error adding user to premium group:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};