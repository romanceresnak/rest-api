import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DynamoDbConstructor } from './constructors/dynamodb';

export class RestApiStack extends cdk.Stack {

  private readonly applicationName: string;
  private productTable: Table;
  private productApiLambda: Function;
  private productAPI: RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DynamoDbConstructor(this, "DynamoDbStack", {
      tableName: 'Product'
    });
  }
}
