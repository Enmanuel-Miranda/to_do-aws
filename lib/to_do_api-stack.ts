import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ToDoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // base de datos
    const tableTask = new dynamodb.Table(this,'TableTask', {
      partitionKey:{ name:'taskId', type: dynamodb.AttributeType.STRING},
      tableName: 'Task',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // funciones lambda
    const createTaskFunction = new lambda.Function(this,'CreateTaskFunction',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'create-task.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {TABLE_NAME: tableTask.tableName},
    });
    const getTaskFunction =new lambda.Function(this,'GetTaskFunction',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'get-task.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {TABLE_NAME: tableTask.tableName},
    });

    // permisos
    tableTask.grantWriteData(createTaskFunction);
    tableTask.grantReadData(getTaskFunction);

    //La puerta de entrada de la api gateway
    const api = new apigateway.RestApi(this, 'TaskApi');
    const taskResource = api.root.addResource('task');
    const taskIdResource = taskResource.addResource('{id}');

    taskResource.addMethod('POST', new apigateway.LambdaIntegration(createTaskFunction));
    taskResource.addMethod('GET', new apigateway.LambdaIntegration(getTaskFunction));
    


  }
}
