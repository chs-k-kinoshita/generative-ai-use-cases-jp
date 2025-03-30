import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockAPIGatewayProxyEvent } from './lambda_testutil';
import { handler } from '../../lambda/predict';
import { expect, describe, it } from '@jest/globals';

describe('Unit test for app handler', function () {
  it('test claude3.7 response', async () => {
    const modelId = "us.anthropic.claude-3-7-sonnet-20250219-v1:0";
    const systemContext = `あなたはテストを支援するAIアシスタントです。
    ここではテストのため、ユーザー入力内容をそのまま返してください。
    説明文は不要です。一字一句変更せずにそのまま返してください。
    `
    const userInput = "てすとです。";
    const event = mockAPIGatewayProxyEvent({
      body: JSON.stringify(createBody("/chat", modelId, "bedrock", systemContext, userInput)),
      httpMethod: 'POST',
      path: '/chat',
    });
    const result: APIGatewayProxyResult = await handler(event);
    console.log(result.body);
    expect(result.body).toEqual(JSON.stringify("てすとです。"));
  });

  it('test simpleEcho response', async () => {
    const modelId = "simpleEcho";
    const systemContext = "";
    const userInput = "てすとです。";
    const event = mockAPIGatewayProxyEvent({
      body: JSON.stringify(createBody("/chat", modelId, "mycustom", systemContext, userInput)),
      httpMethod: 'POST',
      path: `/${modelId}`,
    });
    const result: APIGatewayProxyResult = await handler(event);
    console.log(result.body);
    expect(result.body).toEqual(JSON.stringify("simple echo: てすとです。"));
  });
});

const createBody = (
  functionId: string,
  modelId: string,
  modelType: string,
  systemContext: string,
  userInput: string) => ({
    id: functionId,
    model: {
      modelId: modelId,
      type: modelType,
    },
    messages: [
      {
        role: "system",
        content: systemContext,
        extraData: []
      },
      {
        role: "user",
        content: userInput,
        extraData: []
      }
    ],
  });