import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockAPIGatewayProxyEvent } from './lambda_testutil';
import { handler } from '../../lambda/predict';
import { expect, describe, it } from '@jest/globals';

describe('Unit test for app handler', function () {
  it('verifies successful response', async () => {
    const event = mockAPIGatewayProxyEvent({
      body: JSON.stringify(body),
      httpMethod: 'POST',
      path: '/chat',
    });
    const result: APIGatewayProxyResult = await handler(event);
    console.log(result.body);
    expect(result.body).toEqual(JSON.stringify("てすとです。"));
  });
});

const body = {
  "id": "/chat",
  "model": {
    "modelId": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "type": "bedrock",
  },
  "messages": [
    {
      "role": "system",
      "content": `あなたはテストを支援するAIアシスタントです。
ここではテストのため、ユーザー入力内容をそのまま返してください。
説明文は不要です。一字一句変更せずにそのまま返してください。
`,
      "extraData": []
    },
    {
      "role": "user",
      "content": "てすとです。",
      "extraData": []
    }
  ],
}