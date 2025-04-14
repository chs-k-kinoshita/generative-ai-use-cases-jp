import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  RestApi,
  LambdaIntegration,
} from 'aws-cdk-lib/aws-apigateway';


export interface MyCustomBackendApiProps {
  api: RestApi;
  userPool: UserPool;
  idPool: IdentityPool;
}

export class ApiMyCustom extends Construct {
  readonly dbRefFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: MyCustomBackendApiProps) {
    super(scope, id);

    const {
      api,
      userPool,
      idPool,
    } = props;

    // Lambda
    const dbRefFunction = new NodejsFunction(this, 'DBRefFunction', {
      runtime: Runtime.NODEJS_LATEST,
      entry: './lambda/dbRef.ts',
      timeout: Duration.minutes(1),
      environment: {
        SECRETS_ID: 'dev/dbRef/AuroraMySQL',
      },
      bundling: {
        nodeModules: ['@aws-sdk/client-secrets-manager', 'mysql2'],
      },
    });
    dbRefFunction.grantInvoke(idPool.authenticatedRole);

    // add IAM policy
    const dbRefFunctionPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: ['*'], // TODO: specify the resource
      actions: ['secretsmanager:GetSecretValue'],
    });
    dbRefFunction.role?.addToPrincipalPolicy(dbRefFunctionPolicy);

    // Api Gateway
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [userPool],
    });
    const commonAuthorizerProps = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    };
    const dbRefResource = api.root.addResource('dbRef');
    dbRefResource.addMethod(
      'POST',
      new LambdaIntegration(dbRefFunction),
      commonAuthorizerProps
    );

    this.dbRefFunction = dbRefFunction;
  }
}
