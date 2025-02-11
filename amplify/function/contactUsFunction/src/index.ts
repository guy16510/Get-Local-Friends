import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// Create a DynamoDB DocumentClient instance
const ddb = new DocumentClient();
const TABLE_NAME = process.env.CONTACTS_TABLE_NAME || "Contacts";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Parse the JSON body
  let data;
  try {
    data = JSON.parse(event.body!);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { name, email, message } = data;
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields: name, email, message" }),
    };
  }

  // Generate a unique contact ID (for a production system consider using a proper UUID library)
  const contactId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: {
      contactId,
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await ddb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Contact saved", contactId }),
    };
  } catch (err) {
    console.error("Error saving contact:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not save contact" }),
    };
  }
};