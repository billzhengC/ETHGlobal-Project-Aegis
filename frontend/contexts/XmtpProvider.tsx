import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Conversation, Message } from "@xmtp/xmtp-js";
import { Client } from "@xmtp/xmtp-js";
import { Signer } from "ethers";
import { XmtpContext, XmtpContextType } from "./xmtp";
import useABC from "@lib/common/abc";

export const XmtpProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>();
  const { signer } = useABC();
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false);
  const [convoMessages, setConvoMessages] = useState<Map<string, Message[]>>(
    new Map()
  );

  const [conversations, dispatchConversations] = useReducer(
    (
      state: Map<string, Conversation>,
      newConvos: Conversation[] | undefined
    ): any => {
      if (newConvos === undefined) {
        return new Map();
      }
      newConvos.forEach((convo) => {
        if (convo.peerAddress !== client?.address) {
          if (state && !state.has(convo.peerAddress)) {
            state.set(convo.peerAddress, convo);
          } else if (state === null) {
            state = new Map();
            state.set(convo.peerAddress, convo);
          }
        }
      });
      return state ?? new Map();
    },
    new Map()
  );

  const initClient = useCallback(
    async (wallet: Signer) => {
      if (wallet && !client) {
        try {
          const newClient = await Client.create(wallet, { env: "dev" });
          setClient(newClient);
        } catch (e) {
          console.error(e);
          setClient(null);
        }
      }
    },
    [client]
  );

  const disconnect = () => {
    setClient(undefined);
    dispatchConversations(undefined);
  };

  const [providerState, setProviderState] = useState<XmtpContextType>({
    client,
    conversations,
    loadingConversations,
    initClient,
    disconnect,
    convoMessages,
  });

  useEffect(() => {
    setProviderState({
      client,
      conversations,
      loadingConversations,
      initClient,
      disconnect,
      convoMessages,
    });
  }, [client, conversations, convoMessages, initClient, loadingConversations]);

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  );
};

export default XmtpProvider;
