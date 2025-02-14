import { DynamoDB } from "aws-sdk";

const documentClient = new DynamoDB.DocumentClient();

export async function putItem(params: DynamoDB.DocumentClient.PutItemInput) {
  return documentClient.put(params).promise();
}

export async function getItem(params: DynamoDB.DocumentClient.GetItemInput) {
  return documentClient.get(params).promise();
}

export async function updateItem(params: DynamoDB.DocumentClient.UpdateItemInput) {
  return documentClient.update(params).promise();
}

export async function deleteItem(params: DynamoDB.DocumentClient.DeleteItemInput) {
  return documentClient.delete(params).promise();
}

export async function queryItems(params: DynamoDB.DocumentClient.QueryInput) {
  return documentClient.query(params).promise();
}