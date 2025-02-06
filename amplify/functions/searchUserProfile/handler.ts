import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.USER_PROFILE_TABLE_NAME || "UserProfileTable";

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // Read the query parameters from the URL. (If you send a POST with a JSON body, adjust accordingly.)
    const params = event.queryStringParameters || {};

    // Build filter expressions.
    // We assume that your profiles store boolean fields as strings like "yes" or "no"
    // (or use some other representation). Adjust the comparisons if needed.
    const filterExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

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

    // Build the scan parameters.
    const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
    const scanParams: any = {
      TableName: TABLE_NAME,
      Limit: pageSize,
    };

    if (filterExpressions.length > 0) {
      scanParams.FilterExpression = filterExpressions.join(" AND ");
      scanParams.ExpressionAttributeNames = expressionAttributeNames;
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    // Execute the scan.
    const result = await ddbDocClient.send(new ScanCommand(scanParams));

    // For simplicity, we return all matching items as one page.
    // (A real implementation might use LastEvaluatedKey for pagination.)
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: result.Items,
        totalPages: 1,
      }),
    };
  } catch (error) {
    console.error("Error in search function:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};