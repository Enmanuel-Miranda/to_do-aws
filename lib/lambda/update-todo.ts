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

    console.log(JSON.stringify({
      action: "updateTodo",
      status: "not_found",
      todoId: todoId,
      message: "Tarea no encontrada para actualizar"
    }));

    if (!Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Tarea no encontrada para actualizar" }),
      };
    }

    console.log(JSON.stringify({
      action: "updateTodo",
      status: "success",
      todoId: todoId,
      message: "Tarea actualizada correctamente"
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(Attributes),
    };
  } catch (error: unknown) {

    console.error(JSON.stringify({
      action: "updateTodo",
      status: "error",
      message: "Error al actualizar la tarea",
      error: error instanceof Error ? error.message : String(error)
    }));

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};