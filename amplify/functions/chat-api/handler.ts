import type { APIGatewayProxyHandler } from "aws-lambda";
import { buildResponse } from "../../utils/apiUtils";
import { putItem, queryItems, updateItem } from "../../utils/dynamoDbService";

const CHAT_TABLE = process.env.CHAT_TABLE || "Chat";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Chat API Event:", event);
  const { httpMethod, body, queryStringParameters } = event;
  
  try {
    if (httpMethod === "POST" && body) {
      const data = JSON.parse(body);
      // Create a chat message. Expect senderId, receiverId, message, timestamp.
      const params = {
        TableName: CHAT_TABLE,
        Item: data,
      };
      await putItem(params);
      return buildResponse(200, { message: "Chat message sent", data });
    }
  
    if (httpMethod === "GET") {
      // Retrieve chat messages. Example: query messages by senderId and receiverId.
      if (queryStringParameters && queryStringParameters.senderId && queryStringParameters.receiverId) {
        const params = {
          TableName: CHAT_TABLE,
          IndexName: "ChatIndex", // Ensure you have an appropriate GSI
          KeyConditionExpression: "senderId = :sid and receiverId = :rid",
          ExpressionAttributeValues: {
            ":sid": queryStringParameters.senderId,
            ":rid": queryStringParameters.receiverId,
          },
        };
        const result = await queryItems(params);
        return buildResponse(200, { message: "Chat messages retrieved", data: result.Items });
      }
      return buildResponse(400, { message: "Missing senderId or receiverId" });
    }
  
    if (httpMethod === "PUT" && body) {
      // For chat, an update might mark messages as read, etc.
      const data = JSON.parse(body);
      // Here we assume senderId and timestamp form a composite key.
      const params = {
        TableName: CHAT_TABLE,
        Key: {
          senderId: data.senderId,
          timestamp: data.timestamp,
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": data.status,
        },
        ReturnValues: "UPDATED_NEW",
      };
      const result = await updateItem(params);
      return buildResponse(200, { message: "Chat message updated", data: result.Attributes });
    }
  
    return buildResponse(400, { message: "Unsupported method" });
  } catch (error) {
    console.error("Error handling Chat API request:", error);
    return buildResponse(500, { message: "Internal server error", error });
  }
};