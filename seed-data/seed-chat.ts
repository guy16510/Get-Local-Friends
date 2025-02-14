// const AWS = require("aws-sdk");
// const { faker } = require("@faker-js/faker");
// const { v4: uuidv4 } = require("uuid");

// // Configure AWS region
// AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });
// const docClient = new AWS.DynamoDB.DocumentClient();

// // Use environment variable CHAT_TABLE or default "Chat"
// const TABLE_NAME = process.env.CHAT_TABLE || "Chat";

// // Generate an array of sample user IDs using uuid
// const userIds = Array.from({ length: 5 }, () => uuidv4());

// function generateChatMessage() {
//   const senderId = faker.helpers.arrayElement(userIds);
//   let receiverId = faker.helpers.arrayElement(userIds);
//   // Ensure sender and receiver are different
//   while (receiverId === senderId) {
//     receiverId = faker.helpers.arrayElement(userIds);
//   }
//   const message = faker.lorem.sentence();
//   const timestamp = Date.now();
//   return { senderId, receiverId, message, timestamp };
// }

// async function seedChatMessages() {
//   const items = [];
//   const numItems = 15;
//   for (let i = 0; i < numItems; i++) {
//     items.push(generateChatMessage());
//   }
//   const putRequests = items.map((item) => ({
//     PutRequest: { Item: item },
//   }));
//   const params = {
//     RequestItems: {
//       [TABLE_NAME]: putRequests,
//     },
//   };

//   try {
//     await docClient.batchWrite(params).promise();
//     console.log(`Successfully seeded ${numItems} chat messages into table ${TABLE_NAME}`);
//   } catch (error) {
//     console.error("Error seeding chat messages:", error);
//   }
// }

// seedChatMessages();