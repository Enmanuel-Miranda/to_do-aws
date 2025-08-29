import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../../lib/lambda/list-todos";

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('list-todos', () => {

  beforeEach(() => { ddbMock.reset(); });

  it('listar todas las tareas de la tabla', async () => {
    const mockItems = [
      { todoId: '1', task: 'Tarea 1', status: 'pending' },
      { todoId: '2', task: 'Tarea 2', status: 'completed' }
    ];

    ddbMock.on(ScanCommand).resolves({ Items: mockItems });

    const result = await handler({});
    const body = JSON.parse(result.body);

    //verificar el exito
    expect(result.statusCode).toBe(200);
    expect(body.length).toBe(2);
    expect(body).toEqual(mockItems);
  });
  
  it('devolver un array vacío si no hay tareas', async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [] });

    const result = await handler({});
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.length).toBe(0);
    expect(body).toEqual([]);
  });
});