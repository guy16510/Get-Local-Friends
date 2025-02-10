import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const CONVERSATION_TABLE = process.env.CONVERSATION_TABLE || "Conversation";

export const createConversation = async ({ user1Id, user2Id }: any) => {
  const conversationId = `${user1Id}-${user2Id}`;
  const params = {
    TableName: CONVERSATION_TABLE,
    Item: {
      id: conversationId,
      user1Id,
      user2Id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  await dynamoDb.put(params).promise();
  return params.Item;
};

export const getConversations = async (userId: string) => {
  const params = {
    TableName: CONVERSATION_TABLE,
    FilterExpression: "user1Id = :userId OR user2Id = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };
  const result = await dynamoDb.scan(params).promise();
  return result.Items || [];
};