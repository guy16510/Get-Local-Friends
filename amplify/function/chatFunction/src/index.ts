import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.CHAT_TABLE_NAME || 'Chat';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          message: "Missing request body"
        })
      };
    }

    const { action, data } = JSON.parse(event.body);

    switch (action) {
      case 'sendMessage':
        return await sendMessage(data);
      case 'getMessages':
        return await getMessages(data);
      default:
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
          },
          body: JSON.stringify({
            message: "Invalid action"
          })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: "Internal server error"
      })
    };
  }
};

async function sendMessage(data: { 
  senderId: string; 
  receiverId: string; 
  content: string; 
}): Promise<APIGatewayProxyResultV2> {
  const timestamp = new Date().toISOString();
  const messageId = `${data.senderId}_${data.receiverId}_${timestamp}`;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      messageId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
      timestamp
    }
  };

  await dynamoDB.put(params).promise();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({
      message: "Message sent successfully",
      messageId
    })
  };
}

async function getMessages(data: {
  userId1: string;
  userId2: string;
}): Promise<APIGatewayProxyResultV2> {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "(senderId = :uid1 AND receiverId = :uid2) OR (senderId = :uid2 AND receiverId = :uid1)",
    ExpressionAttributeValues: {
      ":uid1": data.userId1,
      ":uid2": data.userId2
    }
  };

  const result = await dynamoDB.scan(params).promise();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({
      messages: result.Items
    })
  };
}
