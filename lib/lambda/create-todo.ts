import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";


const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const cloudwatchClient = new CloudWatchClient({});

const tableName = process.env.TABLE_NAME;

export const handler = async (event: any) => {
  try {
    const data = JSON.parse(event.body);
    const todoId = uuidv4();
    
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        todoId: todoId,
        task: data.task,
        status: 'pending'
      },
    });

    await ddbDocClient.send(putCommand);
    
    //log estructurado
    console.log(JSON.stringify({ 
      action: "createTodo",
      status: "success",
      todoId: todoId,
      message: "Tarea creada correctamente"
    }));

    // metrica con cloudwatch
    const metricCommand = new PutMetricDataCommand({
      MetricData: [{
        MetricName: "TodoCreatedCount",
        Dimensions: [{ Name: "Service", Value: "TodoApi" }],
        Unit: "Count",
        Value: 1.0,
      }],
      Namespace: "RetoTecnico/TodoApp",
    });
    await cloudwatchClient.send(metricCommand);

    return {
      statusCode: 201,
      body: JSON.stringify({ todoId, task: data.task, status: 'pending' }),
    };
  } catch (error: unknown) {
    //log estructurado de error
    console.error(JSON.stringify({ 
      action: "createTodo",
      status: "error",
      message: "Error al crear la tarea",
      error: error instanceof Error ? error.message : String(error)
    }));
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};