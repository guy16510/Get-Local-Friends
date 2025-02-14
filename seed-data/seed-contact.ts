// const AWS = require("aws-sdk");
// const { faker } = require("@faker-js/faker");

// // Configure AWS region
// AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });
// const docClient = new AWS.DynamoDB.DocumentClient();

// // Use environment variable CONTACT_TABLE or default "Contact"
// const TABLE_NAME = process.env.CONTACT_TABLE || "Contact";

// function generateContact() {
//   const email = faker.internet.email();
//   const name = faker.person.fullName ? faker.person.fullName() : faker.name.findName();
//   const summary = faker.lorem.sentence();
//   return { email, name, summary };
// }

// async function seedContacts() {
//   const items = [];
//   const numItems = 10;
//   for (let i = 0; i < numItems; i++) {
//     items.push(generateContact());
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
//     console.log(`Successfully seeded ${numItems} contacts into table ${TABLE_NAME}`);
//   } catch (error) {
//     console.error("Error seeding contacts:", error);
//   }
// }

// seedContacts();