import AWS from "aws-sdk";
import { faker } from "@faker-js/faker";

// Configure AWS region
AWS.config.update({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

// Use environment variable GEO_TABLE or default "GeoItem"
const TABLE_NAME = process.env.GEO_TABLE || "GeoItem";

interface GeoItem {
  hashKey: string;
  rangeKey: string;
  lat: number;
  lng: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

function generateGeoItem(): GeoItem {
  const lat = faker.number.float({ min: 40.5, max: 40.9, fractionDigits: 4 });
  const lng = faker.number.float({ min: -74.25, max: -73.7, fractionDigits: 4 });
  const userId = faker.string.uuid();
  const hashKey = faker.string.alphanumeric(10);
  const rangeKey = faker.string.alphanumeric(10);
  const now = new Date().toISOString();
  return { hashKey, rangeKey, lat, lng, userId, createdAt: now, updatedAt: now };
}

async function seedGeoItems() {
  const items: GeoItem[] = [];
  const numItems = 20;
  for (let i = 0; i < numItems; i++) {
    items.push(generateGeoItem());
  }
  const putRequests = items.map(item => ({
    PutRequest: { Item: item },
  }));
  const params = {
    RequestItems: {
      [TABLE_NAME]: putRequests,
    },
  };

  try {
    await docClient.batchWrite(params).promise();
    console.log(`Successfully seeded ${numItems} geo items into table ${TABLE_NAME}`);
  } catch (error) {
    console.error("Error seeding geo items:", error);
  }
}

seedGeoItems();