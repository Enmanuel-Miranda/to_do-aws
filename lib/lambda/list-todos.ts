import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient =new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler =async (event: any) => {
  try {
    const scanCommand = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    });
    
    const { Items } = await ddbDocClient.send(scanCommand);
    
    console.log(JSON.stringify({ 
      action: "listTodos",
      status: "success",
      count: Items?.length || 0,
      message: "Tareas listadas"
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
    
  } catch (error: unknown) {
    //log de error 
    console.error(JSON.stringify({ 
      action: "listTodos",
      status: "error",
      message: "Error al listar las tareas",
      error: error instanceof Error ? error.message : String(error)
    }));

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error al listar las tareas', 
        error: error instanceof Error ? error.message : String(error)
      }),
    };
    
  }
};