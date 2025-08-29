import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

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
    
    return {
      statusCode: 201,
      body: JSON.stringify({ todoId, task: data.task, status: 'pending' }),
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};