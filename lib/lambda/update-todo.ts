import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.TABLE_NAME;

export const handler = async (event: any) => {
  try {
    const todoId = event.pathParameters.id;
    const { task, status } = JSON.parse(event.body);
    
    const updateCommand = new UpdateCommand({
      TableName: tableName,
      Key: {
        todoId: todoId
      },
      UpdateExpression: "set task = :t, #s = :s",
      ExpressionAttributeNames: {
        "#s": "status"
      },
      ExpressionAttributeValues: {
        ":t": task,
        ":s": status
      },
      ReturnValues: "ALL_NEW"
    });

    const { Attributes } = await ddbDocClient.send(updateCommand);

    if (!Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Tarea no encontrada para actualizar" }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(Attributes),
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};