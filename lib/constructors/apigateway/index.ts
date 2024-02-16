import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Function } from 'aws-cdk-lib/aws-lambda'; // Correctly import the Function

export interface APIGatewayProps {
    appName: string;
    lambdaFunction: Function; // Ensure this matches the imported Function
}

export class ApiGatewayConstructor extends cdk.Stack {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props: APIGatewayProps) {
    super(scope, id);

    // Correct the instantiation of the RestApi
    this.api = new RestApi(this, `${props.appName}-Customers-API`, {
      description: 'Customers API',
      deployOptions: { stageName: 'dev' },
      defaultCorsPreflightOptions: {
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });

    // Correct the way resources and methods are added to the API
    const customers = this.api.root.addResource('customers');
    const customer = customers.addResource('{id}');
    customers.addMethod('GET', new LambdaIntegration(props.lambdaFunction));
    customers.addMethod('PUT', new LambdaIntegration(props.lambdaFunction));
    customer.addMethod('GET', new LambdaIntegration(props.lambdaFunction));
    customer.addMethod('DELETE', new LambdaIntegration(props.lambdaFunction));
  }
}
