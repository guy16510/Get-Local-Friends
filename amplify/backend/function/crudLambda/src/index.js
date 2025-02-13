const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || 'MyCrudTable';

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  const method = event.httpMethod;
  let response;
  
  try {
    switch(method) {
      case 'GET':
        if (event.pathParameters && event.pathParameters.id) {
          // GET /items/{id} – Retrieve a single item.
          const params = {
            TableName: TABLE_NAME,
            Key: { id: event.pathParameters.id }
          };
          const result = await docClient.get(params).promise();
          if (result.Item) {
            response = { statusCode: 200, body: result.Item };
          } else {
            response = { statusCode: 404, body: { message: "Item not found" } };
          }
        } else {
          // GET /items – List all items.
          const params = { TableName: TABLE_NAME };
          const result = await docClient.scan(params).promise();
          response = { statusCode: 200, body: result.Items };
        }
        break;
        
      case 'POST':
        // POST /items – Create a new item.
        const newItem = JSON.parse(event.body);
        newItem.id = uuidv4();
        const putParams = {
          TableName: TABLE_NAME,
          Item: newItem
        };
        await docClient.put(putParams).promise();
        response = { statusCode: 201, body: newItem };
        break;
        
      case 'PUT':
        // PUT /items/{id} – Update an existing item.
        if (event.pathParameters && event.pathParameters.id) {
          const id = event.pathParameters.id;
          const updatedData = JSON.parse(event.body);
          // For simplicity, we replace the entire item.
          updatedData.id = id;
          const updateParams = {
            TableName: TABLE_NAME,
            Item: updatedData
          };
          await docClient.put(updateParams).promise();
          response = { statusCode: 200, body: updatedData };
        } else {
          response = { statusCode: 400, body: { message: "Missing id in path parameters" } };
        }
        break;
        
      case 'DELETE':
        // DELETE /items/{id} – Delete an item.
        if (event.pathParameters && event.pathParameters.id) {
          const id = event.pathParameters.id;
          const deleteParams = {
            TableName: TABLE_NAME,
            Key: { id: id },
            ReturnValues: "ALL_OLD"
          };
          const result = await docClient.delete(deleteParams).promise();
          if (result.Attributes) {
            response = { statusCode: 200, body: result.Attributes };
          } else {
            response = { statusCode: 404, body: { message: "Item not found" } };
          }
        } else {
          response = { statusCode: 400, body: { message: "Missing id in path parameters" } };
        }
        break;
        
      default:
        response = { statusCode: 405, body: { message: "Method Not Allowed" } };
    }
  } catch (error) {
    console.error("Error processing request:", error);
    response = { statusCode: 500, body: { message: "Internal Server Error" } };
  }
  
  return {
    statusCode: response.statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(response.body)
  };
};