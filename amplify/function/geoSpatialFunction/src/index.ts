import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as geohash from "ngeohash";

const ddb = new DocumentClient();
const TABLE_NAME = process.env.GEO_TABLE_NAME || "GeoLocations";

interface GeoItem {
  userId: string;
  lat: number;
  lng: number;
  geoHash: string;
  updatedAt: string;
}

const EARTH_RADIUS_KM = 6371;

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLng = degreesToRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const method = event.httpMethod;
  const pathParams = event.pathParameters;
  const queryParams = event.queryStringParameters;

  try {
    if (method === "POST") {
      // Create or update geo location
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing request body" }),
        };
      }
      const data = JSON.parse(event.body);
      const { userId, lat, lng } = data;
      if (!userId || lat === undefined || lng === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required fields: userId, lat, lng" }),
        };
      }
      // Compute geohash with precision 9
      const geoHash = geohash.encode(lat, lng, 9);
      const item: GeoItem = {
        userId,
        lat,
        lng,
        geoHash,
        updatedAt: new Date().toISOString(),
      };
      const params: DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: item,
      };
      await ddb.put(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Geo location saved", item }),
      };
    } else if (method === "GET") {
      if (pathParams && pathParams.userId) {
        // Lookup by userId
        const params: DocumentClient.GetItemInput = {
          TableName: TABLE_NAME,
          Key: { userId: pathParams.userId },
        };
        const result = await ddb.get(params).promise();
        if (!result.Item) {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: "Item not found" }),
          };
        }
        return {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
      } else if (queryParams && queryParams.lat && queryParams.lng && queryParams.radius) {
        // Radius lookup: get all items in a bounding box then filter by distance.
        const lat = parseFloat(queryParams.lat);
        const lng = parseFloat(queryParams.lng);
        const radius = parseFloat(queryParams.radius); // radius in kilometers

        // Approximate conversion: 1° latitude ~111km; adjust longitude by latitude
        const latDiff = radius / 111;
        const lngDiff = radius / (111 * Math.cos(degreesToRadians(lat)));
        const minLat = lat - latDiff;
        const maxLat = lat + latDiff;
        const minLng = lng - lngDiff;
        const maxLng = lng + lngDiff;

        const params: DocumentClient.ScanInput = {
          TableName: TABLE_NAME,
          FilterExpression: "#lat BETWEEN :minLat AND :maxLat AND #lng BETWEEN :minLng AND :maxLng",
          ExpressionAttributeNames: {
            "#lat": "lat",
            "#lng": "lng",
          },
          ExpressionAttributeValues: {
            ":minLat": minLat,
            ":maxLat": maxLat,
            ":minLng": minLng,
            ":maxLng": maxLng,
          },
        };

        const scanResult = await ddb.scan(params).promise();
        // Further filter results using the Haversine distance
        const items = (scanResult.Items || []).filter((item) => {
          const distance = calculateDistance(lat, lng, item.lat, item.lng);
          return distance <= radius;
        });
        return {
          statusCode: 200,
          body: JSON.stringify({ items }),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error:
              "Invalid GET request. Provide either a userId in the path or lat, lng, and radius as query parameters.",
          }),
        };
      }
    } else if (method === "DELETE") {
      if (pathParams && pathParams.userId) {
        const params: DocumentClient.DeleteItemInput = {
          TableName: TABLE_NAME,
          Key: { userId: pathParams.userId },
        };
        await ddb.delete(params).promise();
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Geo location deleted" }),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing userId in path parameters for DELETE" }),
        };
      }
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  } catch (error) {
    console.error("Error in geo spatial handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};