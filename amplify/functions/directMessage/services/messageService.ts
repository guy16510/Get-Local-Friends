import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const MESSAGE_TABLE = process.env.MESSAGE_TABLE || "Message";

export const createMessage = async ({ conversationId, senderId, recipientId, content }: any) => {
  const messageId = `${conversationId}-${Date.now()}`;
  const params = {
    TableName: MESSAGE_TABLE,
    Item: {
      id: messageId,
      conversationId,
      senderId,
      recipientId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  await dynamoDb.put(params).promise();
  return params.Item;
};

export const getMessages = async (conversationId: string) => {
  const params = {
    TableName: MESSAGE_TABLE,
    IndexName: "conversationId-createdAt-index", // Assuming you have this index
    KeyConditionExpression: "conversationId = :conversationId",
    ExpressionAttributeValues: {
      ":conversationId": conversationId,
    },
    ScanIndexForward: true, // Ascending order by createdAt
  };
  const result = await dynamoDb.query(params).promise();
  return result.Items || [];
};