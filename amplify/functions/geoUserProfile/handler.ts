// amplify/functions/geoUserProfile/handler.ts
import { APIGatewayEvent, Context } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { GeoDataManagerConfiguration, GeoDataManager } from "dynamodb-geo-v3";
import { marshall } from "@aws-sdk/util-dynamodb";

/**
 * Configuration
 */
const REGION = "us-east-1"; // Adjust if needed
const TABLE_NAME = "GeoUserProfileTable";
// If you have a GSI on userId, e.g. "userId-index" or "GeoUserProfile.userId.index", use that name here:
const USERID_GSI_NAME = "userId-index";

/**
 * The shape of our user profile data.
 * (DynamoDB-Geo will add numeric hashKey, numeric geohash automatically.)
 *
 * Updated: 'lookingFor?: string[];'
 */
interface GeoUserProfile {
  userId?: string;
  lat?: number;
  lng?: number;
  firstName?: string;
  lastName?: string;

  // CHANGED to an array
  lookingFor?: string[];

  kids?: boolean;
  drinking?: boolean;
  availability?: string[];
  married?: boolean;
  ageRange?: string;
  friendAgeRange?: string;
  pets?: boolean;
  employed?: boolean;
  work?: string;
  political?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ----------------------------
// 1) Create a v3 DynamoDB client
// ----------------------------
const rawClient = new DynamoDBClient({ region: REGION });

// ----------------------------
// 2) CAST the client to `any`
//    (Workaround for the library's older type definitions.)
// ----------------------------
const ddbClientAsAny = rawClient as any;

// ----------------------------
// 3) Create a DocumentClient if you need normal queries
// ----------------------------
const ddbDocClient = DynamoDBDocumentClient.from(rawClient);

// ----------------------------
// 4) Configure dynamodb-geo
// ----------------------------
const geoConfig = new GeoDataManagerConfiguration(ddbClientAsAny, TABLE_NAME);
geoConfig.hashKeyLength = 3; // adjust for bigger or smaller partitioning
const geoDataManager = new GeoDataManager(geoConfig);

/**
 * Lambda entry point
 */
export const handler = async (event: APIGatewayEvent, context: Context) => {
  try {
    switch (event.httpMethod) {
      case "POST":
        return await createProfile(event);
      case "GET":
        // If query params have lat/lng => geo radius search
        if (event.queryStringParameters?.lat && event.queryStringParameters?.lng) {
          return await getProfilesWithinRadius(event);
        }
        // else => get by userId
        return await getProfile(event);

      case "PUT":
        return await updateProfile(event);

      default:
        return errorResponse(400, `Unsupported method: ${event.httpMethod}`);
    }
  } catch (err) {
    console.error("Handler error:", err);
    return errorResponse(500, "Internal server error");
  }
};

async function createProfile(event: APIGatewayEvent) {
  if (!event.body) {
    return errorResponse(400, "Missing request body");
  }

  const profile: GeoUserProfile = JSON.parse(event.body);
  if (!profile.userId) {
    return errorResponse(400, "Missing userId");
  }
  if (profile.lat === undefined || profile.lng === undefined) {
    return errorResponse(400, "Missing lat/lng");
  }

  // Add timestamps
  const now = new Date().toISOString();
  profile.createdAt = now;
  profile.updatedAt = now;

  // Fallback for arrays
  profile.availability = profile.availability ?? [];
  profile.lookingFor = profile.lookingFor ?? [];

  // Insert with `putPoint`
  await geoDataManager.putPoint({
    RangeKeyValue: { S: profile.userId }, // This acts as the rangeKey
    GeoPoint: {
      latitude: profile.lat,
      longitude: profile.lng,
    },
    PutItemInput: {
      Item: marshall(profile),
    },
  });

  // Query the item to retrieve the generated hashKey
  const queryInput = {
    TableName: TABLE_NAME,
    IndexName: USERID_GSI_NAME,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": { S: profile.userId },
    },
    Limit: 1,
  };

  const result = await ddbDocClient.send(new QueryCommand(queryInput));

  if (!result.Items || result.Items.length === 0) {
    return errorResponse(500, "Failed to retrieve profile after creation.");
  }

  const item = result.Items[0];

  const enrichedProfile = {
    ...profile,
    hashKey: item.hashKey?.N || null, // ✅ Retrieve the generated hashKey
    rangeKey: profile.userId,         // ✅ Use userId as the rangeKey
  };

  return successResponse(201, { message: "Profile created", profile: enrichedProfile });
}
// /**
//  * Create a new user profile (POST)
//  * - Uses `putPoint` so dynamodb-geo calculates numeric geohash & hashKey
//  */
// async function createProfile(event: APIGatewayEvent) {
//   if (!event.body) {
//     return errorResponse(400, "Missing request body");
//   }

//   const profile: GeoUserProfile = JSON.parse(event.body);
//   if (!profile.userId) {
//     return errorResponse(400, "Missing userId");
//   }
//   if (profile.lat === undefined || profile.lng === undefined) {
//     return errorResponse(400, "Missing lat/lng");
//   }

//   // Add timestamps
//   const now = new Date().toISOString();
//   profile.createdAt = now;
//   profile.updatedAt = now;

//   // fallback for arrays
//   profile.availability = profile.availability ?? [];
//   // CHANGED: fallback for lookingFor
//   profile.lookingFor = profile.lookingFor ?? [];

//   // Insert with `putPoint`
//   await geoDataManager.putPoint({
//     RangeKeyValue: { S: profile.userId }, // sort key
//     GeoPoint: {
//       latitude: profile.lat,
//       longitude: profile.lng,
//     },
//     PutItemInput: {
//       Item: marshall(profile), // convert JS object to raw DynamoDB shape
//     },
//   });

//   return successResponse(201, { message: "Profile created", profile });
// }

/**
 * Get a single user by userId (GET?userId=xxx)
 * - Requires a GSI on userId
 */
async function getProfile(event: APIGatewayEvent) {
  if (!event.queryStringParameters?.userId) {
    return errorResponse(400, "Missing userId");
  }

  const userId = event.queryStringParameters.userId;

  // Query the GSI
  const queryInput = {
    TableName: TABLE_NAME,
    IndexName: USERID_GSI_NAME,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
    Limit: 1,
  };

  try {
    const result = await ddbDocClient.send(new QueryCommand(queryInput));
    if (!result.Items || result.Items.length === 0) {
      return errorResponse(404, `Profile not found for userId=${userId}`);
    }
    return successResponse(200, result.Items[0]);
  } catch (error) {
    console.error("Error in getProfile:", error);
    return errorResponse(500, "Error retrieving profile by userId");
  }
}

/**
 * Get profiles within a radius
 * - GET?lat=xxx&lng=yyy&distance=5&unit=km (or mi)
 */
async function getProfilesWithinRadius(event: APIGatewayEvent) {
  const { lat, lng, distance = "5", unit = "km" } = event.queryStringParameters || {};

  const latitude = parseFloat(lat || "0");
  const longitude = parseFloat(lng || "0");
  const distanceInMeters =
    unit === "mi"
      ? parseFloat(distance) * 1609.34
      : parseFloat(distance) * 1000;

  try {
    const result = await geoDataManager.queryRadius({
      RadiusInMeter: distanceInMeters,
      CenterPoint: { latitude, longitude },
    });

    return successResponse(200, result);
  } catch (error) {
    console.error("Error in getProfilesWithinRadius:", error);
    return errorResponse(500, "Error retrieving nearby profiles");
  }
}

/**
 * Update a user profile (PUT)
 * - If lat/lng changes, must use `updatePoint` so geohash/hashKey are recalculated
 * - `UpdateItemInput` must include `TableName` and a placeholder `Key`.
 */
async function updateProfile(event: APIGatewayEvent) {
  if (!event.body) {
    return errorResponse(400, "Missing request body");
  }
  const updates: GeoUserProfile = JSON.parse(event.body);

  if (!updates.userId) {
    return errorResponse(400, "Missing userId");
  }
  if (updates.lat === undefined || updates.lng === undefined) {
    return errorResponse(400, "Missing lat/lng");
  }

  // Example: Just updating lat/lng and a few other fields (like updatedAt).
  const now = new Date().toISOString();

  // Optionally handle fallback for lookingFor here too
  updates.lookingFor = updates.lookingFor ?? [];
  updates.availability = updates.availability ?? [];

  const updatePointParams = {
    RangeKeyValue: { S: updates.userId }, // The existing item’s sort key
    GeoPoint: {
      latitude: updates.lat,
      longitude: updates.lng,
    },
    UpdateItemInput: {
      // Must include TableName + placeholder Key for library's type signature
      TableName: TABLE_NAME,
      Key: {},
      UpdateExpression: "SET #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":updatedAt": { S: now },
      },
      ReturnValues: "ALL_NEW" as const,
    },
  };

  const result = await geoDataManager.updatePoint(updatePointParams);

  return successResponse(200, {
    message: "Profile updated",
    updatedRaw: result.Attributes,
  });
}

/**
 * Helpers
 */
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