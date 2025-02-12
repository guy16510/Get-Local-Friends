import { defineData } from '@aws-amplify/backend';

export const data = defineData({
  schema: {
    tables: {
      Chat: {
        primaryIndex: { partitionKey: 'messageId', sortKey: 'timestamp' },
        secondaryIndexes: {
          bySenderReceiver: { partitionKey: 'senderId', sortKey: 'receiverId' }
        }
      },
      Contact: {
        primaryIndex: { partitionKey: 'contactId', sortKey: 'createdAt' }
      },
      GeoSpatial: {
        primaryIndex: { partitionKey: 'userId', sortKey: 'geohash' },
        secondaryIndexes: {
          byGeohash: { partitionKey: 'geohash', sortKey: 'userId' }
        }
      }
    }
  }
});
