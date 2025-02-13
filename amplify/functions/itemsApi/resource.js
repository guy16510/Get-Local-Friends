import { defineFunction } from '@aws-amplify/backend';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const itemsApi = defineFunction({
  entry: 'index.js',
  environment: (stack) => ({
    // Get the table name from the data stack
    STORAGE_DYNAMODB_NAME: stack.data.itemsTable.tableName
  }),
  plugins: [{
    name: 'api-gateway',
    version: '1.0.0',
    configure: (stack, fn) => {
      const api = new RestApi(stack, 'ItemsApi', {
        restApiName: 'Items Service',
        description: 'This is the Items API'
      });

      // Update permissions to use the actual table ARN
      fn.addToRolePolicy(new PolicyStatement({
        actions: [
          'dynamodb:PutItem',
          'dynamodb:GetItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:Scan'
        ],
        resources: [stack.data.itemsTable.tableArn]
      }));

      const items = api.root.addResource('items');
      const item = items.addResource('{id}');
      const integration = new LambdaIntegration(fn);

      items.addMethod('GET', integration);
      items.addMethod('POST', integration);
      item.addMethod('GET', integration);
      item.addMethod('PUT', integration);
      item.addMethod('DELETE', integration);

      return api;
    }
  }]
});
