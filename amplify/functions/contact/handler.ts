// /backend/src/contact/handler.ts
import type { Schema } from '../../data/resource';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, TableName } from './resource';

export const handler: Schema["contact"]["functionHandler"] = async (event) => {
  console.log("Received event:", JSON.stringify(event));
  
  const { name, email, message } = event.arguments;
  
  // Construct the DynamoDB item explicitly (avoid spreading to prevent duplicate keys)
  const item = {
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };
  
  const params = {
    TableName,
    Item: item
  };
  
  console.log("DynamoDB PutCommand params:", JSON.stringify(params));
  
  try {
    const result = await ddbDocClient.send(new PutCommand(params));
    console.log("DynamoDB result:", JSON.stringify(result));
    return "Contact message received";
  } catch (err) {
    console.error("DynamoDB error:", err);
    throw new Error("Internal Server Error");
  }
};
