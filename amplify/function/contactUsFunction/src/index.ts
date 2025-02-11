import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const ddb = new DocumentClient();
const TABLE_NAME = process.env.CHAT_TABLE_NAME || "ChatMessages";

// Helper to generate a simple unique ID; for production consider a robust UUID library.
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Compute a conversation ID from two user IDs (order‑independent)
function getConversationId(user1: string, user2: string): string {
  return [user1, user2].sort().join("#");
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const method = event.httpMethod;
  const pathParams = event.pathParameters || {};
  const queryParams = event.queryStringParameters || {};

  try {
    if (method === "POST") {
      // Sending a new chat message
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing request body" }),
        };
      }
      const data = JSON.parse(event.body);
      const { sender, receiver, message } = data;
      if (!sender || !receiver || !message) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Missing required fields: sender, receiver, message",
          }),
        };
      }
      const conversationId = getConversationId(sender, receiver);
      const timestamp = new Date().toISOString();
      const messageId = generateId();

      const item = {
        conversationId, // Partition key
        messageId,      // Sort key
        sender,
        receiver,
        message,
        timestamp,
      };

      const params: DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: item,
      };

      await ddb.put(params).promise();
      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Message sent", item }),
      };
    } else if (method === "GET") {
      // Get conversation between two users; expect query parameters user1 and user2
      if (queryParams && queryParams.user1 && queryParams.user2) {
        const conversationId = getConversationId(queryParams.user1, queryParams.user2);
        const params: DocumentClient.QueryInput = {
          TableName: TABLE_NAME,
          KeyConditionExpression: "conversationId = :conversationId",
          ExpressionAttributeValues: {
            ":conversationId": conversationId,
          },
          // Messages will be returned sorted by messageId (which in our simple example roughly follows creation time)
          ScanIndexForward: true,
        };
        const result = await ddb.query(params).promise();
        return {
          statusCode: 200,
          body: JSON.stringify({ messages: result.Items }),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Missing query parameters: user1 and user2 are required",
          }),
        };
      }
    } else if (method === "DELETE") {
      // Delete a specific message. Expect conversationId and messageId in the path.
      if (pathParams && pathParams.conversationId && pathParams.messageId) {
        const params: DocumentClient.DeleteItemInput = {
          TableName: TABLE_NAME,
          Key: {
            conversationId: pathParams.conversationId,
            messageId: pathParams.messageId,
          },
        };
        await ddb.delete(params).promise();
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Message deleted" }),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Missing path parameters: conversationId and messageId required for DELETE",
          }),
        };
      }
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};