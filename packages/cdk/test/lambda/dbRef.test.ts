import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockAPIGatewayProxyEvent } from './lambda_testutil';
import { handler } from '../../lambda/dbRef';
import { expect, describe, it } from '@jest/globals';
import { DBRefRequest, DBRefResponse } from 'generative-ai-use-cases-jp';

describe('Unit test for app handler', function () {

  it('test dbRef response', async () => {
    const reqBody: DBRefRequest = [
      {
        table: "TABLE_A",
        cols: [
          {
            name: "column_1",
            value: "1"
          },
          {
            name: "column_2",
            value: "100"
          }
        ]
      }
    ];
    process.env.SECRETS_ID = 'dev/dbRef/AuroraMySQL';
    const event = mockAPIGatewayProxyEvent({
      body: JSON.stringify(reqBody),
      httpMethod: 'POST',
      path: '/dbRef',
    });
    const result: APIGatewayProxyResult = await handler(event);
    expect(result.statusCode).toEqual(200);
    console.log(result.body);
  });
});