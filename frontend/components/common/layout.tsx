import SimpleFooter from "./simpleFooter";
import SimpleHeader from "./simpleHeader";
import { hooks as metaMaskHooks, metaMask } from "@connectors/metaMask";
import { CommonContextProvider } from "@contexts/commonContextProvider";
import { LoadingProvider } from "@contexts/loadingProvider";
import { ModalProvider } from "@contexts/modalProvider";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import XmtpProvider from "@contexts/XmtpProvider";

const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, metaMaskHooks]];

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <CommonContextProvider>
      <Web3ReactProvider connectors={connectors}>
        <XmtpProvider>
          <LoadingProvider>
            <ModalProvider>
              <div className="w-full h-full mx-auto flex-1 flex flex-col">
                <SimpleHeader />
                <main className="relative w-full flex-1 flex flex-col">
                  {children}
                </main>
                <SimpleFooter />
              </div>
            </ModalProvider>
          </LoadingProvider>
        </XmtpProvider>
      </Web3ReactProvider>
    </CommonContextProvider>
  );
}
