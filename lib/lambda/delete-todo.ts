import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.TABLE_NAME;

export const handler = async (event: any) => {
  try {
    const todoId = event.pathParameters.id;

    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: {
        todoId: todoId
      },
    });

    await ddbDocClient.send(deleteCommand);
    
    return {
      statusCode: 204,
      body: JSON.stringify({ message: "Tarea eliminada correctamente" }),
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};