import { defineData } from '@aws-amplify/backend';
import { Table, AttributeType, BillingMode, RemovalPolicy } from 'aws-cdk-lib/aws-dynamodb';

export const data = defineData({
  resources: (stack) => {
    const itemsTable = new Table(stack, 'Items', {
      tableName: `Items-${stack.stage}`,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: stack.stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY
    });

    // Export the table for use in other stacks
    stack.addOutputs({
      ItemsTableName: itemsTable.tableName
    });

    return {
      itemsTable
    };
  }
});
