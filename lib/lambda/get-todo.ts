import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.TABLE_NAME;

export const handler = async (event: any) => {
  try {
    const todoId = event.pathParameters.id;

    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        todoId: todoId,
      },
    });

    const { Item } = await ddbDocClient.send(getCommand);

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Tarea no encontrada" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(Item),
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};