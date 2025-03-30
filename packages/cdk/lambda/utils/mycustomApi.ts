
import {
  InvokeInterface,
  InvokeStreamInterface,
} from 'generative-ai-use-cases-jp';
import { streamingChunk } from './streamingChunk';

export type ApiInterface = {
  invoke: InvokeInterface;
  invokeStream: InvokeStreamInterface;
};

const mycustomApi: ApiInterface = {
  invoke: async (model, messages, id) => {
    console.log('mycustomApi invoke', model, messages, id);
    return `simple echo: ${messages[messages.length - 1].content}`;
  },
  invokeStream: async function* (model, messages, id) {
    console.log('mycustomApi invokeStream', model, messages, id);
    yield streamingChunk({ text: "streaming\n"});
    yield streamingChunk({ text: "simple echo\n"});
    yield streamingChunk({ text: messages[messages.length - 1].content});
  },
};

export default mycustomApi;
