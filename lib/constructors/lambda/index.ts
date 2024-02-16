import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as path from 'path';

export interface LambdaProps {
  appName: string;
  table: dynamodb.Table;
}

export class LambdaConstructor extends cdk.Stack {
  public readonly lambdaFunction: Function;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    // Create the Lambda function
    this.lambdaFunction = new Function(this, `${props.appName}-Customer-Lambda`, {
      code: Code.fromAsset(path.join(__dirname, '../lambda')),
      handler: 'customer.handler',
      runtime: Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    // Define a policy statement that specifies the allowed actions on the DynamoDB table
    const policy = new PolicyStatement({
      actions: [
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
      ],
      resources: [props.table.tableArn],
    });

    // Attach the policy to the Lambda function's execution role
    this.lambdaFunction.role?.attachInlinePolicy(new Policy(this, `${props.appName}-CustomerTablePermissions`, {
      statements: [policy],
    }));
  }
}
