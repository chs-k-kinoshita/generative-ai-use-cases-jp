import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import InputChatContent from '../components/InputChatContent';
import useChat from '../hooks/useChat';
import ChatMessage from '../components/ChatMessage';
import ScrollTopBottom from '../components/ScrollTopBottom';
import useFollow from '../hooks/useFollow';
import { create } from 'zustand';
import { PiCactusBold } from 'react-icons/pi';

type StateType = {
  content: string;
  setContent: (c: string) => void;
};

const useChatPageState = create<StateType>((set) => {
  return {
    content: '',
    setContent: (s: string) => {
      set(() => ({
        content: s,
      }));
    },
  };
});

const SimpleEchoChatPage: React.FC = () => {
  const {
    content,
    setContent,
  } = useChatPageState();

  const { pathname } = useLocation();

  const {
    loading,
    loadingMessages,
    isEmpty,
    messages,
    clear,
    postChat,
    setModelId,
  } = useChat(pathname);
  const { scrollableContainer, setFollowing } = useFollow();

  const title = 'SimpleEchoチャット';

  useEffect(() => {
    setModelId('simpleEcho');
  }, []);

  const onSend = useCallback(() => {
    setFollowing(true);
    postChat(
      content,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );
    setContent('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, setFollowing]);

  const onReset = useCallback(() => {
    clear();
    setContent('');
  }, [clear, setContent]);

  const showingMessages = useMemo(() => {
    return messages;
  }, [messages]);

  return (
    <>
      <div
        className={`${!isEmpty ? 'screen:pb-36' : ''} relative`}>
        <div className="invisible my-0 flex h-0 items-center justify-center text-xl font-semibold lg:visible lg:my-5 lg:h-min print:visible print:my-5 print:h-min">
          {title}
        </div>

        {((isEmpty && !loadingMessages) || loadingMessages) && (
          <div className="relative flex h-[calc(100vh-13rem)] flex-col items-center justify-center">
            <PiCactusBold className="text-8xl text-gray-400" />
          </div>
        )}

        <div ref={scrollableContainer}>
          {!isEmpty &&
            showingMessages.map((chat, idx) => (
              <div key={idx + 1}>
                {idx === 0 && (
                  <div className="w-full border-b border-gray-300"></div>
                )}
                <ChatMessage
                  chatContent={chat}
                  loading={loading && idx === showingMessages.length - 1}
                />
                <div className="w-full border-b border-gray-300"></div>
              </div>
            ))}
        </div>

        <div className="fixed right-4 top-[calc(50vh-2rem)] z-0 lg:right-8">
          <ScrollTopBottom />
        </div>

        <div className="fixed bottom-0 z-0 flex w-full flex-col items-center justify-center lg:pr-64 print:hidden">
          <InputChatContent
            content={content}
            disabled={loading}
            onChangeContent={setContent}
            onSend={() => {
              onSend();
            }}
            onReset={onReset}
          />
        </div>
      </div>
    </>
  );
};

export default SimpleEchoChatPage;
