import type { APIGatewayProxyHandler } from "aws-lambda";
import { buildResponse } from "../../utils/apiUtils";
import { putItem, getItem, updateItem } from "../../utils/dynamoDbService";
const branchName = process.env.BRANCH_NAME || "default";
console.log("Current branch name:", branchName);
const CONTACT_TABLE = `Contact-${branchName}`;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Contact API Event:", event);
  const { httpMethod, body, queryStringParameters } = event;
  
  try {
    if (httpMethod === "POST" && body) {
      const data = JSON.parse(body);
      // Create contact entry.
      const params = {
        TableName: CONTACT_TABLE,
        Item: data,
      };
      await putItem(params);
      return buildResponse(200, { message: "Contact created", data });
    }
  
    if (httpMethod === "GET") {
      // Retrieve a contact based on a unique key (e.g., email).
      if (queryStringParameters && queryStringParameters.email) {
        const params = {
          TableName: CONTACT_TABLE,
          Key: { email: queryStringParameters.email },
        };
        const result = await getItem(params);
        return buildResponse(200, { message: "Contact retrieved", data: result.Item });
      }
      return buildResponse(400, { message: "Missing email parameter" });
    }
  
    if (httpMethod === "PUT" && body) {
      const data = JSON.parse(body);
      // Update contact info; assuming email is the primary key.
      const params = {
        TableName: CONTACT_TABLE,
        Key: { email: data.email },
        UpdateExpression: "set #name = :name, summary = :summary",
        ExpressionAttributeNames: {
          "#name": "name",
        },
        ExpressionAttributeValues: {
          ":name": data.name,
          ":summary": data.summary,
        },
        ReturnValues: "UPDATED_NEW",
      };
      const result = await updateItem(params);
      return buildResponse(200, { message: "Contact updated", data: result.Attributes });
    }
  
    return buildResponse(400, { message: "Unsupported method" });
  } catch (error) {
    console.error("Error handling Contact API request:", error);
    return buildResponse(500, { message: "Internal server error", error });
  }
};