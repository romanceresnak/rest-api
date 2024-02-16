import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDbConstructor } from './constructors/dynamodb';
import { LambdaConstructor } from './constructors/lambda';
import { ApiGatewayConstructor } from './constructors/apigateway';

export class RestApiStack extends cdk.Stack {
  appName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.appName = this.node.tryGetContext('appName') || 'DefaultAppName';

     // Define the tableName for the DynamoDB table
     const tableName = `${this.appName}-Table`;

    const dynamoDbTable = new DynamoDbConstructor(this, `${this.appName}-DynamoDB`,{
      tableName: tableName,
    });

    const lambdaFunction = new LambdaConstructor(this, `${this.appName}-Lambda`, { 
      appName: this.appName,
      table: dynamoDbTable.table,
    });

     new ApiGatewayConstructor(this, `${this.appName}-ApiGateway`, {
      appName: this.appName,
      lambdaFunction: lambdaFunction.lambdaFunction,
     });
  }
}
