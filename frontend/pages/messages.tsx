import Layout from "@components/common/layout";
import XmtpContext from "@contexts/xmtp";
import { Menu, Transition } from "@headlessui/react";
import { BanIcon, InboxIcon, PencilAltIcon } from "@heroicons/react/outline";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotsVerticalIcon,
  XIcon,
} from "@heroicons/react/solid";
import useABC from "@lib/common/abc";
import { XmtpMessage } from "@model/model";
import { DateTime } from "luxon";
import {
  Fragment,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { NextPageWithLayout } from "./_app";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const sidebarNavigation = [
  { name: "Open", href: "#", icon: InboxIcon, current: true },
  { name: "Spam", href: "#", icon: BanIcon, current: false },
  { name: "Drafts", href: "#", icon: PencilAltIcon, current: false },
];

const Messages: NextPageWithLayout = () => {
  const { signer, call, login } = useABC();
  const { client, initClient } = useContext(XmtpContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<XmtpMessage>>([]);
  const [selectedMessage, setSelectedMessage] = useState<XmtpMessage>();
  const handleConnect = useCallback(async () => {
    await login();
    initClient(signer);
  }, [initClient, login, signer]);

  useEffect(() => {
    if (!signer) {
      return;
    }
    if (!client) {
      handleConnect();
    }
  }, [client, handleConnect, signer]);

  useEffect(() => {
    if (!client) {
      return;
    }
    const f = async () => {
      const newMessages = new Array<XmtpMessage>();
      const convos = await client.conversations.list();
      for (const convo of convos) {
        for (const message of await convo.messages()) {
          const xmtpMessage = JSON.parse(message.content) as XmtpMessage;
          xmtpMessage.id = message.id;
          xmtpMessage.from = convo.peerAddress;
          xmtpMessage.timestamp = DateTime.fromMillis(
            message.header.timestamp.toNumber()
          );
          newMessages.push(xmtpMessage);
        }
      }
      newMessages.sort((a: XmtpMessage, b: XmtpMessage) => {
        if (a > b) {
          return 1;
        }
        return -1;
      });
      setMessages(newMessages);
    };
    f();
  }, [client]);

  return (
    <div className="relative h-full flex flex-1 flex-col">
      {/* Bottom section */}
      <div className="min-h-0 flex-1 flex overflow-hidden">
        {/* Narrow sidebar*/}
        <nav
          aria-label="Sidebar"
          className="hidden lg:block lg:flex-shrink-0 lg:bg-gray-800 lg:overflow-y-auto"
        >
          <div className="relative w-20 flex flex-col p-3 space-y-3 min-h-max">
            {sidebarNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-700",
                  "flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg"
                )}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </nav>

        {/* Main area */}
        <main className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
          {open ? (
            <section
              aria-labelledby="message-heading"
              className="min-w-0 flex-1 h-full flex flex-col overflow-hidden xl:order-last"
            >
              {/* Top section */}
              <div className="flex-shrink-0 bg-white border-b border-gray-200">
                {/* Toolbar*/}
                <div className="h-16 flex flex-col justify-center">
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="py-3 flex justify-between">
                      {/* Right buttons */}
                      <nav aria-label="Pagination" className="w-full">
                        <div className="w-full flex justify-between">
                          <span className="relative z-0 inline-flex shadow-sm rounded-md">
                            <a
                              href="#"
                              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                            >
                              <span className="sr-only">Next</span>
                              <ChevronUpIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </a>
                            <a
                              href="#"
                              className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                            >
                              <span className="sr-only">Previous</span>
                              <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </a>
                          </span>
                          <span className="relative z-0 inline-flex shadow-sm rounded-md">
                            <a
                              className="-ml-px relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close</span>
                              <XIcon className="h-5 w-5" aria-hidden="true" />
                            </a>
                          </span>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
                {/* Message header */}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="bg-white pt-5 pb-6 shadow">
                  <div className="px-4 sm:flex sm:justify-between sm:items-baseline sm:px-6 lg:px-8">
                    <div className="sm:w-0 sm:flex-1">
                      <h1
                        id="message-heading"
                        className="text-lg font-medium text-gray-900"
                      >
                        {selectedMessage.title}
                      </h1>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {selectedMessage.from}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
                      <Menu
                        as="div"
                        className="ml-3 relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="-my-2 p-2 rounded-full bg-white flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                            <span className="sr-only">Open options</span>
                            <DotsVerticalIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "w-full flex justify-between px-4 py-2 text-sm"
                                    )}
                                  >
                                    <span>Copy email address</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "flex justify-between px-4 py-2 text-sm"
                                    )}
                                  >
                                    <span>Previous conversations</span>
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "flex justify-between px-4 py-2 text-sm"
                                    )}
                                  >
                                    <span>View original</span>
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
                {/* Thread section*/}
                <ul
                  role="list"
                  className="py-4 space-y-2 sm:px-6 sm:space-y-4 lg:px-8"
                >
                  {selectedMessage.content}
                </ul>
              </div>
            </section>
          ) : (
            /* Message list*/
            <aside className="xl:block xl:flex-shrink-0 xl:order-first">
              <div className="w-full h-full relative flex flex-col border-r border-gray-200 bg-gray-100">
                <div className="flex-shrink-0">
                  <div className="h-16 bg-white px-6 flex flex-col justify-center">
                    <div className="flex items-baseline space-x-3">
                      <h2 className="text-lg font-medium text-gray-900">
                        Inbox
                      </h2>
                      <p className="text-sm font-medium text-gray-500">
                        {messages.length} messages
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500">
                    Sorted by date
                  </div>
                </div>
                <nav
                  aria-label="Message list"
                  className="min-h-0 flex-1 overflow-y-auto"
                >
                  <ul
                    role="list"
                    className="border-b border-gray-200 divide-y divide-gray-200"
                  >
                    {messages.map((message) => (
                      <li
                        key={message.id}
                        className="relative bg-white py-5 px-6 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600"
                      >
                        <div className="flex justify-between space-x-3">
                          <div className="min-w-0 flex-1">
                            <a
                              className="block focus:outline-none"
                              onClick={() => {
                                setSelectedMessage(message);
                                setOpen(true);
                              }}
                            >
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {message.from}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {message.title}
                              </p>
                            </a>
                          </div>
                          <time
                            dateTime={message.timestamp.toISO()}
                            className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                          >
                            {message.timestamp.toISO()}
                          </time>
                        </div>
                        <div className="mt-1">
                          <p className="line-clamp-2 text-sm text-gray-600">
                            {message.content}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
};

Messages.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Messages;
