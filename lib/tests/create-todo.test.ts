import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../../lib/lambda/create-todo";


//configurando los mocks
const ddbMock = mockClient(DynamoDBDocumentClient);
const cwMock = mockClient(CloudWatchClient);


describe('create-todo', () => {

//limpiar
beforeEach(() => {
    ddbMock.reset();
    cwMock.reset();
});


//test de exito
 it('creando una tarea', async () => {
    //simular el comportamiento de bd
    ddbMock.on(PutCommand).resolves({});

    //evento
    const event = {
      body: JSON.stringify({ task: "Prueba de tarea" })
    };

    const result = await handler(event);
    const body = JSON.parse(result.body);

    //aserciones
    expect(result.statusCode).toBe(201);
    expect(body).toHaveProperty('todoId');
    expect(body.task).toBe("Prueba de tarea");
    expect(body.status).toBe("pending");
    
    //verificar llamada a  putcommand
    expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
    //verificar la metrica
    expect(cwMock.commandCalls(PutMetricDataCommand).length).toBe(1);

  });
});