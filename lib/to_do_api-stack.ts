import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

//Importaciones necesarias
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

//este archivo construye
export class ToDoApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // base de datos de dynamodb
    const todosTable = new dynamodb.Table(this, 'TodosTable',{
      partitionKey: {name: 'todoId', type: dynamodb.AttributeType.STRING},
      tableName: 'Todos',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //Funciones lambda
    const createTodoFunction = new lambda.Function(this, 'CreateTodoFunction',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'create-todo.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {TABLE_NAME: todosTable.tableName}
    });
    const listTodosFunction = new lambda.Function(this,'ListTodosFunction',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'list-todos.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {TABLE_NAME: todosTable.tableName}
    });
    const getTodoFunction = new lambda.Function(this,'GetTodoFunction',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'get-todo.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {TABLE_NAME: todosTable.tableName},
    });
    const updateTodoFunction = new lambda.Function(this,'UpdateTodoFunction',{
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'update-todo.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {TABLE_NAME: todosTable.tableName}
    });
    const deleteTodoFunction = new lambda.Function(this,'DeleteTodoFunction',{
      runtime : lambda.Runtime.NODEJS_18_X,
      handler: 'delete-todo.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {TABLE_NAME: todosTable.tableName}
    });

    // permisos
    todosTable.grantWriteData(createTodoFunction);
    todosTable.grantReadData(listTodosFunction);
    todosTable.grantReadData(getTodoFunction);
    todosTable.grantReadWriteData(updateTodoFunction);
    todosTable.grantWriteData(deleteTodoFunction);

    //api gateway puerta de entrada
    const api = new apigateway.RestApi(this,'TodoApi');
    const todosResource = api.root.addResource('todos');
    const todoIdResource = todosResource.addResource('{id}');

    todosResource.addMethod('POST', new apigateway.LambdaIntegration(createTodoFunction));
    todosResource.addMethod('GET', new apigateway.LambdaIntegration(listTodosFunction));
    todoIdResource.addMethod('GET', new apigateway.LambdaIntegration(getTodoFunction));
    todoIdResource.addMethod('PUT', new apigateway.LambdaIntegration(updateTodoFunction));
    todoIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTodoFunction));

  }
}
