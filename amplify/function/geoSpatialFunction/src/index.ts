import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import * as geohash from 'ngeohash';

const dynamoDB = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});
const TABLE_NAME = process.env.LOCATIONS_TABLE_NAME;

if (!TABLE_NAME) {
  throw new Error('LOCATIONS_TABLE_NAME environment variable must be set');
}

exports.handler = async (
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
      case 'updateLocation':
        return await updateLocation(data);
      case 'findNearbyUsers':
        return await findNearbyUsers(data);
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
