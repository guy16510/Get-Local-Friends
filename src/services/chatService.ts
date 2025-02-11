// @ts-nocheck
// import { generateClient } from 'aws-amplify/data';
// import type { Schema } from '../../amplify/data/resource';

// const client = generateClient<Schema>();

export const createConversation = async (user1Id: string, user2Id: string) => {
  // const response = await client.models.Conversation.create({
  //   user1Id, 
  //   user2Id,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // });
  // return { data: response }; 
  return true;
};

export const getConversations = async (userId: string) => {
  // const response = await client.models.Conversation.list({
  //   filter: {
  //     or: [{ user1Id: { eq: userId } }, { user2Id: { eq: userId } }],
  //   },
  // });
  // return { data: { items: response.data } };
  return true;
};

export const createMessage = async (
  conversationId: string,
  senderId: string,
  recipientId: string,
  content: string
) => {
  // const response = await client.models.Message.create({
  //   conversationId,
  //   senderId,
  //   recipientId,
  //   content,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // });
  // return { data: response };
  return true;
};

export const getMessages = async (conversationId: string) => {
  // const response = await client.models.Message.list({
  //   filter: { conversationId: { eq: conversationId } },
  // });

  // // Manually sort messages by createdAt in ascending order
  // const sortedMessages = response.data.sort((a, b) => {
  //   const dateA = new Date(a?.createdAt ?? 0).getTime(); // Fallback to 0 if null
  //   const dateB = new Date(b?.createdAt ?? 0).getTime(); // Fallback to 0 if null
  //   return dateA - dateB;
  // });

  // return { data: { items: sortedMessages } };
  return true;
};