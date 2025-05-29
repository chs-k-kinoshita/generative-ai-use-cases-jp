
import {
  InvokeInterface,
  InvokeStreamInterface,
} from 'generative-ai-use-cases-jp';
import { streamingChunk } from './streamingChunk';

export type ApiInterface = {
  invoke: InvokeInterface;
  invokeStream: InvokeStreamInterface;
};

const testMessages: string[] = [
  "streaming\n",
  "simple echo\n",
  "AB",
  "CD",
  "Z\n"
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mycustomApi: ApiInterface = {
  invoke: async (model, messages, id) => {
    console.log('mycustomApi invoke', model, messages, id);
    return `simple echo: ${messages[messages.length - 1].content}`;
  },
  invokeStream: async function* (model, messages, id) {
    console.log('mycustomApi invokeStream', model, messages, id);
    for (const message of testMessages) {
      yield streamingChunk({ text: message });
      await sleep(500);
    }
    yield streamingChunk({ text: messages[messages.length - 1].content });
  },
};

export default mycustomApi;
