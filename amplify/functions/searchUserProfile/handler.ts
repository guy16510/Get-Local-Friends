// amplify/functions/searchUserProfile/handler.ts
import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.USER_PROFILE_TABLE_NAME || "UserProfileTable";

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const params = event.queryStringParameters || {};
  const filterExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  // Example: filter by zipcode and boolean fields (assumed to be stored as "yes"/"no")
  if (params.zipcode) {
    filterExpressions.push("#zipcode = :zipcode");
    expressionAttributeNames["#zipcode"] = "zipcode";
    expressionAttributeValues[":zipcode"] = params.zipcode;
  }
  if (params.kids) {
    filterExpressions.push("#kids = :kids");
    expressionAttributeNames["#kids"] = "kids";
    expressionAttributeValues[":kids"] = params.kids;
  }
  if (params.drinking) {
    filterExpressions.push("#drinking = :drinking");
    expressionAttributeNames["#drinking"] = "drinking";
    expressionAttributeValues[":drinking"] = params.drinking;
  }
  if (params.married) {
    filterExpressions.push("#married = :married");
    expressionAttributeNames["#married"] = "married";
    expressionAttributeValues[":married"] = params.married;
  }
  if (params.pets) {
    filterExpressions.push("#pets = :pets");
    expressionAttributeNames["#pets"] = "pets";
    expressionAttributeValues[":pets"] = params.pets;
  }
  if (params.employed) {
    filterExpressions.push("#employed = :employed");
    expressionAttributeNames["#employed"] = "employed";
    expressionAttributeValues[":employed"] = params.employed;
  }

  const scanParams: any = {
    TableName: TABLE_NAME,
    Limit: Number(params.pageSize) || 10,
  };

  if (filterExpressions.length > 0) {
    scanParams.FilterExpression = filterExpressions.join(" AND ");
    scanParams.ExpressionAttributeNames = expressionAttributeNames;
    scanParams.ExpressionAttributeValues = expressionAttributeValues;
  }

  // Note: For simplicity, we are not implementing full pagination with LastEvaluatedKey.
  const result = await ddbDocClient.send(new ScanCommand(scanParams));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: result.Items,
      totalPages: 1, // Replace with real pagination logic as needed
    }),
  };
};