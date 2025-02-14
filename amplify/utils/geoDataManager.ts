import DynamoDB from "aws-sdk/clients/dynamodb";
import * as ddbGeo from "dynamodb-geo";

// Initialize the DynamoDB client (make sure your region is set appropriately)
const ddb = new DynamoDB({
  region: process.env.AWS_REGION || "us-east-1",
});

// Use the table name from environment variables or fallback to "GeoItem"
const tableName = process.env.GEO_TABLE || "GeoItem";

// Create the configuration for the GeoDataManager
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, tableName);

// Optionally adjust settings (hashKeyLength, etc.) if needed
config.hashKeyLength = 3;

export const geoDataManager = new ddbGeo.GeoDataManager(config);