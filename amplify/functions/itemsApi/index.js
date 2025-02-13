const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  DeleteCommand, 
  ScanCommand,
  UpdateCommand 
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.STORAGE_DYNAMODB_NAME || 'Items'

exports.handler = async (event) => {
  try {
    const { httpMethod, path, body } = event;
    const id = event.pathParameters?.id;
    
    // Common response headers
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    };

    // CREATE
    if (httpMethod === 'POST' && path === '/items') {
      const item = JSON.parse(body);
      const params = {
        TableName: tableName,
        Item: {
          id: Date.now().toString(),
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      await docClient.send(new PutCommand(params));
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(params.Item)
      };
    }

    // READ (Get All)
    if (httpMethod === 'GET' && path === '/items') {
      const params = {
        TableName: tableName
      };

      const { Items } = await docClient.send(new ScanCommand(params));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(Items)
      };
    }

    // READ (Get One)
    if (httpMethod === 'GET' && id) {
      const params = {
        TableName: tableName,
        Key: { id }
      };

      const { Item } = await docClient.send(new GetCommand(params));
      if (!Item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Item not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(Item)
      };
    }

    // UPDATE
    if (httpMethod === 'PUT' && id) {
      const item = JSON.parse(body);
      const updateExpression = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.keys(item).forEach(key => {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = item[key];
      });

      // Add updatedAt
      updateExpression.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const params = {
        TableName: tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const { Attributes } = await docClient.send(new UpdateCommand(params));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(Attributes)
      };
    }

    // DELETE
    if (httpMethod === 'DELETE' && id) {
      const params = {
        TableName: tableName,
        Key: { id }
      };

      await docClient.send(new DeleteCommand(params));
      return {
        statusCode: 204,
        headers
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Invalid request' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
