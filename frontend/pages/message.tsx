import Layout from "@components/common/layout";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotsVerticalIcon,
} from "@heroicons/react/solid";
import { BanIcon, InboxIcon, PencilAltIcon } from "@heroicons/react/outline";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const sidebarNavigation = [
  { name: "Open", href: "#", icon: InboxIcon, current: true },
  // { name: "Archive", href: "#", icon: ArchiveIconOutline, current: false },
  // { name: "Customers", href: "#", icon: UserCircleIcon, current: false },
  // { name: "Flagged", href: "#", icon: FlagIcon, current: false },
  { name: "Spam", href: "#", icon: BanIcon, current: false },
  { name: "Drafts", href: "#", icon: PencilAltIcon, current: false },
];

const messages = [
  {
    id: 1,
    subject: "Hi Bill! You just won the Q3 2022 Carbon Retirement Challenge",
    sender: "Toucan Protocol",
    href: "#",
    date: "2d ago",
    datetime: "2021-08-27T16:35",
    preview:
      "",
  },
  {
    id: 2,
    subject: "Exclusive Community Event Access",
    sender: "Toucan Protocol",
    href: "#",
    date: "1d ago",
    datetime: "2021-08-28T16:35",
    preview:
      "",
  },
  {
    id: 3,
    subject: "Join your VIP program",
    sender: "Klima",
    href: "#",
    date: "1d ago",
    datetime: "2021-08-28T16:35",
    preview:
      "",
  },
];
const messageDisplay = {
  subject: "Congrats! You just won the Q3 2022 Carbon Retirement Challenge",
  sender: "Toucan Protocol",
  status: "Open",
};



const Message: NextPageWithLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="h-full flex flex-col">
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
                      <nav aria-label="Pagination">
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
                        {messageDisplay.subject}
                      </h1>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {messageDisplay.sender}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                        {messageDisplay.status}
                      </span>
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
                 {`Details on next quest / community events`}
                </ul>
              </div>
            </section>

            {/* Message list*/}
            <aside className="hidden xl:block xl:flex-shrink-0 xl:order-first">
              <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-gray-100">
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
                              href={message.href}
                              className="block focus:outline-none"
                            >
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {message.sender}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {message.subject}
                              </p>
                            </a>
                          </div>
                          <time
                            dateTime={message.datetime}
                            className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                          >
                            {message.date}
                          </time>
                        </div>
                        <div className="mt-1">
                          <p className="line-clamp-2 text-sm text-gray-600">
                            {message.preview}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  );
};

Message.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Message;

