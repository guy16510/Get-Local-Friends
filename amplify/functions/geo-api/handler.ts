import type { APIGatewayProxyHandler } from "aws-lambda";
import { marshall } from "@aws-sdk/util-dynamodb";
import { buildResponse } from "../../utils/apiUtils";
import { geoDataManager } from "../../utils/geoDataManager";
import { DynamoDB } from "aws-sdk";

const ddb = new DynamoDB.DocumentClient();
const branchName = process.env.BRANCH_NAME || "default";
console.log("Current branch name:", branchName);
const GEO_TABLE = `GeoItem-${branchName}`;


export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Geo API Event:", event);
  const { httpMethod, body, queryStringParameters } = event;

  try {
    // ---------------------------
    // CREATE: Add a new geo profile
    // ---------------------------
    if (httpMethod === "POST" && body) {
      const profile = JSON.parse(body);
      const now = new Date().toISOString();
      profile.createdAt = now;
      profile.updatedAt = now;
      // Use geoDataManager.putPoint to insert the item.
      await geoDataManager.putPoint({
        RangeKeyValue: { S: profile.userId },
        GeoPoint: { latitude: profile.lat, longitude: profile.lng },
        PutItemInput: { Item: marshall(profile) },
      });
      return buildResponse(200, { message: "Geo item created", data: profile });
    }

    // UPDATE: Modify an existing geo profile
    // UPDATE: Modify an existing geo profile
    if (httpMethod === "PUT" && body) {
      const updatedProfile = JSON.parse(body);
      // Require that the client provides the original (old) coordinates for deletion,
      // because if the location is updated, the old geo hash must be computed from the original coordinates.
      const { userId, oldLat, oldLng } = updatedProfile;
      if (!userId || oldLat === undefined || oldLng === undefined) {
        return buildResponse(400, { message: "Missing userId or old coordinates (oldLat, oldLng) for update" });
      }
      // Delete the existing geo point using the original location.
      await geoDataManager.deletePoint({
        RangeKeyValue: { S: userId },
        GeoPoint: { latitude: parseFloat(oldLat), longitude: parseFloat(oldLng) },
      });
      // Update the updatedAt timestamp.
      updatedProfile.updatedAt = new Date().toISOString();
      // Reinsert the updated profile using the new location (lat/lng) provided.
      await geoDataManager.putPoint({
        RangeKeyValue: { S: userId },
        GeoPoint: { latitude: updatedProfile.lat, longitude: updatedProfile.lng },
        PutItemInput: { Item: marshall(updatedProfile) },
      });
      return buildResponse(200, { message: "Geo item updated", data: updatedProfile });
    }

    // DELETE: Remove an existing geo profile
    if (httpMethod === "DELETE") {
      // Require that the deletion query includes userId as well as lat and lng (the original location)
      if (
        queryStringParameters &&
        queryStringParameters.userId &&
        queryStringParameters.lat &&
        queryStringParameters.lng
      ) {
        const { userId, lat, lng } = queryStringParameters;
        await geoDataManager.deletePoint({
          RangeKeyValue: { S: userId },
          GeoPoint: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        });
        return buildResponse(200, { message: "Geo item deleted" });
      }
      return buildResponse(400, { message: "Missing userId and original coordinates (lat, lng) for deletion" });
    }

    // ---------------------------
    // GET: Retrieve geo profiles
    // ---------------------------
    if (httpMethod === "GET") {
      // 1. Proximity Query: if lat, lng, and distance are provided.
      if (
        queryStringParameters &&
        queryStringParameters.lat &&
        queryStringParameters.lng &&
        queryStringParameters.distance
      ) {
        const {
          lat,
          lng,
          distance = "5",
          unit = "km",
          limit = "10",
          lastKey,
        } = queryStringParameters;
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const distanceValue = parseFloat(distance);
        // Convert the distance to meters.
        const distanceInMeters = unit.toLowerCase().startsWith("mi")
          ? distanceValue * 1609.34
          : distanceValue * 1000;
        const queryParams: any = {
          RadiusInMeter: distanceInMeters,
          CenterPoint: { latitude, longitude },
          Limit: parseInt(limit, 10),
        };
        if (lastKey) {
          // Expect lastKey to be a JSON-stringified ExclusiveStartKey.
          queryParams.ExclusiveStartKey = JSON.parse(lastKey);
        }
        const result = await geoDataManager.queryRadius(queryParams);
        return buildResponse(200, {
          message: "Geo proximity query results",
          data: result,
        });
      }
      // 2. GET by userId: if userId is provided (and proximity params are not).
      if (queryStringParameters && queryStringParameters.userId) {
        const { userId } = queryStringParameters;
        // Assume a GSI (UserIdIndex) exists on the table for querying by userId.
        const params = {
          TableName: GEO_TABLE,
          IndexName: "UserIdIndex", // Ensure this index is created in your table
          KeyConditionExpression: "userId = :uid",
          ExpressionAttributeValues: {
            ":uid": userId,
          },
        };
        const result = await ddb.query(params).promise();
        return buildResponse(200, { message: "Geo items fetched by userId", data: result.Items });
      }
      return buildResponse(400, { message: "Missing query parameters for GET" });
    }

    return buildResponse(400, { message: "Unsupported method" });
  } catch (error) {
    console.error("Error in geo API handler:", error);
    return buildResponse(500, { message: "Internal server error", error });
  }
};