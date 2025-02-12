import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import * as geohash from 'ngeohash';

// Ensure environment variables are defined
const TABLE_NAME = process.env.LOCATIONS_TABLE_NAME || 'GeoSpatial';
const AWS_REGION = process.env.AWS_REGION;

if (!TABLE_NAME || !AWS_REGION) {
  throw new Error('Required environment variables LOCATIONS_TABLE_NAME and AWS_REGION must be set');
}

// Now TypeScript knows these are definitely strings
const dynamoDB = new DynamoDB.DocumentClient({
  region: AWS_REGION
});

interface LocationData {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface NearbyUsersData {
  userId: string;
  latitude: number;
  longitude: number;
  radius: number;
}

async function updateLocation(data: LocationData): Promise<APIGatewayProxyResultV2> {
  const hash = geohash.encode(data.latitude, data.longitude);
  const ttl = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours from now

  await dynamoDB.put({
    TableName: TABLE_NAME, // TypeScript now knows this is defined
    Item: {
      userId: data.userId,
      geohash: hash,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: data.timestamp,
      ttl
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({
      message: "Location updated successfully",
      geohash: hash
    })
  };
}

async function findNearbyUsers(data: NearbyUsersData): Promise<APIGatewayProxyResultV2> {
  const centerHash = geohash.encode(data.latitude, data.longitude);
  const precision = 6; // Adjust this value based on desired area coverage
  const neighbors = geohash.neighbors(centerHash.substring(0, precision));
  neighbors.push(centerHash.substring(0, precision));

  const nearbyUsers: Array<{
    userId: string;
    distance: number;
    latitude: number;
    longitude: number;
  }> = [];
  
  for (const hash of neighbors) {
    const queryParams: any = {
      TableName: TABLE_NAME, // TypeScript now knows this is defined
      IndexName: 'byGeohash',
      KeyConditionExpression: 'geohash BEGINS_WITH :hashPrefix',
      FilterExpression: 'userId <> :userId',
      ExpressionAttributeValues: {
        ':hashPrefix': hash,
        ':userId': data.userId
      }
    };

    const result = await dynamoDB.query(queryParams).promise();
    
    if (result.Items) {
      for (const item of result.Items) {
        const distance = calculateDistance(
          data.latitude,
          data.longitude,
          item.latitude,
          item.longitude
        );

        if (distance <= data.radius) {
          nearbyUsers.push({
            userId: item.userId,
            distance: Math.round(distance * 100) / 100,
            latitude: item.latitude,
            longitude: item.longitude
          });
        }
      }
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    },
    body: JSON.stringify({
      users: nearbyUsers
    })
  };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

interface RequestBody {
  action: 'updateLocation' | 'findNearbyUsers';
  data: LocationData | NearbyUsersData;
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

    const { action, data } = JSON.parse(event.body) as RequestBody;

    switch (action) {
      case 'updateLocation':
        return await updateLocation(data as LocationData);
      case 'findNearbyUsers':
        return await findNearbyUsers(data as NearbyUsersData);
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
