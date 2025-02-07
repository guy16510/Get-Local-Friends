import { GeoDataManager, GeoDataManagerConfiguration } from 'dynamodb-geo';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const geoConfig = new GeoDataManagerConfiguration(ddbClient, 'GeoUserProfileTable');
geoConfig.hashKeyLength = 3;

const geoDataManager = new GeoDataManager(geoConfig);

export const searchProfiles = async (lat: number, lng: number, radius: number) => {
  return geoDataManager.queryRadius({
    RadiusInMeter: radius,
    CenterPoint: { latitude: lat, longitude: lng },
  });
};