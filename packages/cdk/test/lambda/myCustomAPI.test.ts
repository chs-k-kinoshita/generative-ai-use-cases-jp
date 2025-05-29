import { mockAPIGatewayProxyEvent } from './lambda_testutil';
import mycustomApi from '../../lambda/utils/mycustomApi';
import { expect, describe, it } from '@jest/globals';

import {
  Model,
  UnrecordedMessage,
  StreamingChunk
} from 'generative-ai-use-cases-jp';

describe('Unit test for app handler', function () {
  it('test simpleEcho response', async () => {
    const modelId = "simpleEcho";
    const model: Model = {
      modelId: "simpleEcho",
      type: "mycustom",
    }
    const stream = await mycustomApi.invokeStream(model, messages, "/chat");
    let answer = "";
    for await (const message of stream) {
      const chunk = JSON.parse(message) as StreamingChunk;
      console.log(chunk.text);
      answer += chunk.text;
    }
    console.log("★:", answer);
  });
});

const messages: UnrecordedMessage[] = [
  {
    role: "system",
    content: "",
    extraData: []
  },
  {
    role: "user",
    content: "てすとです。",
    extraData: []
  }
];