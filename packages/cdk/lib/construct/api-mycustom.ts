import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Vpc, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
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

    // ✅ 既存の VPC を ID 指定で参照
    const vpc = Vpc.fromVpcAttributes(this, 'ExistingVPC', {
      vpcId: 'vpc-0c213a2eb3f67db61',
      availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c'], // 利用したいAZ
      publicSubnetIds: ['subnet-0c0ee600939ce0fae', 'subnet-06aa08b93335a7ea5'], // Lambda を配置するサブネットのID
      // privateSubnetIds: ['subnet-11111111', 'subnet-22222222'], // Lambda を配置するサブネットのID
    });

    // ✅ 既存の Security Group を ID 指定で参照
    const sg = SecurityGroup.fromSecurityGroupId(
      this,
      'VpcLambdaSG',
      'sg-0b6452160c3ec0716',
      {
        mutable: false, // セキュリティグループを変更しない場合は false でOK
      }
    );
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
      vpc,
      securityGroups: [sg],
      vpcSubnets: {
        // subnets: vpc.selectSubnets({ subnetType: SubnetType.PRIVATE_WITH_EGRESS }).subnets,
        subnets: vpc.selectSubnets({ subnetType: SubnetType.PUBLIC }).subnets,
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
    dbRefFunction.role?.addManagedPolicy({
      managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole',
    });

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
