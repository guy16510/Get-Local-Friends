// amplify/functions/userProfile/handler.ts
import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GeoDataManager, GeoDataManagerConfiguration } from "dynamodb-geo";

const ddbClient = new DynamoDBClient({});  // configure region as needed
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = "GeoUserProfileTable";
// TODO is this deploying??

// Configure GeoDataManager for the geospatial table.
const geoConfig = new GeoDataManagerConfiguration(
  ddbDocClient,
  TABLE_NAME
);
// Adjust hashKeyLength if desired.
geoConfig.hashKeyLength = 3;
const geoDataManager = new GeoDataManager(geoConfig);

type UserProfile = {
  userId: string;
  firstName: string;
  lastNameInitial: string;
  email: string;
  lookingFor: string;
  kids: boolean;
  zipcode: string;
  drinking: boolean;
  // New geospatial fields:
  lat: number;
  lng: number;
  hobbies: string[];
  availability: string[];
  married: boolean;
  ageRange: string;
  friendAgeRange: string;
  pets: boolean;
  employed: boolean;
  work: string;
  political?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const handler = async (event: APIGatewayEvent, context: Context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    switch (event.httpMethod) {
      case "POST":
        return await createProfile(event);
      case "GET":
        return await getProfile(event);
      case "PUT":
        return await updateProfile(event);
      default:
        return errorResponse(400, "Unsupported HTTP method");
    }
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(500, "Internal server error");
  }
};

async function createProfile(event: APIGatewayEvent) {
  if (!event.body) return errorResponse(400, "Missing request body");

  const profile: UserProfile = JSON.parse(event.body);
  
  // Ensure required geospatial fields exist.
  if (profile.lat === undefined || profile.lng === undefined) {
    return errorResponse(400, "Missing latitude or longitude");
  }

  profile.createdAt = new Date().toISOString();
  profile.updatedAt = profile.createdAt;

  // Prepare input for the GeoDataManager.
  const putPointInput = {
    // The RangeKeyValue is used as the sort key. In this example, we use userId.
    RangeKeyValue: { S: profile.userId },
    // GeoDataManager needs the latitude and longitude.
    GeoPoint: {
      latitude: profile.lat,
      longitude: profile.lng,
    },
    PutItemInput: {
      TableName: TABLE_NAME,
      // Cast the profile as any so that it satisfies the PutItemInputAttributeMap type.
      Item: profile as any,
    },
  };

  await geoDataManager.putPoint(putPointInput);

  return successResponse(201, profile);
}

async function getProfile(event: APIGatewayEvent) {
  // Your existing implementation...
}

async function updateProfile(event: APIGatewayEvent) {
  // Your existing implementation...
}

function successResponse(statusCode: number, data: any) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

function errorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}