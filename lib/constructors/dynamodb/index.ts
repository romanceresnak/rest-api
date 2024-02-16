import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as kms from 'aws-cdk-lib/aws-kms'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface ConstructorNameProps {
    tableName: string;
}

export class DynamoDbConstructor extends cdk.Stack {
  public readonly table: dynamodb.Table;  
  constructor(scope: Construct, id: string, props: ConstructorNameProps) {
    super(scope, id);

    //Create a KMS for Key for DynamoDB table encryption
    const tableKey = new kms.Key(this, 'TableKey', {
        description: 'KMS key for encrypting the ${props.tableName} table`',
        enableKeyRotation: true
    })

    // Define the DynamoDB table with a global secondary index
    const table = new dynamodb.Table(this, 'MyTable', {
        tableName: props.tableName,
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        readCapacity: 20,
        writeCapacity: 20,
        encryption: dynamodb.TableEncryption.CUSTOMER_MANAGED,
        encryptionKey: tableKey,
        pointInTimeRecovery: true,
        tableClass: dynamodb.TableClass.STANDARD_INFREQUENT_ACCESS
    })

    // Define a global secondary index
    table.addGlobalSecondaryIndex({
        indexName: 'GSI1',
        partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING}, 
        sortKey: { name: 'gsi1sk', type: dynamodb.AttributeType.STRING },
        projectionType: dynamodb.ProjectionType.ALL
    })

    // Add a Local Secondary Index
    table.addLocalSecondaryIndex({
        indexName: 'LSI1',
        sortKey: { name: 'lsi1sk', type: dynamodb.AttributeType.STRING },
        projectionType: dynamodb.ProjectionType.ALL,
      });
  }
}