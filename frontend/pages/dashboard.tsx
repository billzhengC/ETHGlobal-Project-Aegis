import Layout from "@components/common/layout";
import { Dialog, Transition } from "@headlessui/react";
import { BellIcon, CogIcon } from "@heroicons/react/outline";
import useABC from "@lib/common/abc";
import {
  Fragment,
  ReactElement,
  useEffect, useRef,
  useState
} from "react";
import { NotificationSendResp } from "./api/notification/send";
import { GetAllUsersResp, userItem } from "./api/quest/get_all_users";
import { NextPageWithLayout } from "./_app";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const subNavigation = [
  // { name: "Basic", href: "#", icon: UserCircleIcon, current: false },
  { name: "Create quest", href: "#", icon: CogIcon, current: false },
  { name: "Messaging", href: "#", icon: BellIcon, current: true },
];

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  {
    name: "22 Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  {
    name: "33 Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  {
    name: "44 Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];
const Dashboard: NextPageWithLayout = () => {
  const { call } = useABC();

  const questID = 1;

  const [userList, setUserList] = useState<userItem[]>();

  useEffect(() => {
    const getAllUsers = async () => {
      const resp = await call<GetAllUsersResp>({
        method: "post",
        path: "/quest/get_all_users",
        params: {
          quest: questID.toString(),
        },
      });

      setUserList(resp.userList);

      //   console.log(resp);
    };
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkbox = useRef({} as any);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedList, setSelectedList] = useState<userItem[]>([]);

  useEffect(() => {
    const isIndeterminate =
      selectedList.length > 0 && selectedList.length < people.length;
    setChecked(selectedList.length === userList?.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedList, userList]);

  function toggleAll() {
    setSelectedList(checked || indeterminate ? [] : userList);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendMessageToSelect = async () => {
    setOpen(true);
  };

  const submitMessage = async () => {
    const addressL = [];
    selectedList.forEach((element) => {
      addressL.push(element.address.toLowerCase());
    });
    const resp = await call<NotificationSendResp>({
      method: "post",
      path: "/notification/send",
      data: {
        address_list: addressL,
        title: title,
        content: message,
      },
    });
    alert("Send Status: " + resp.msg);
    setOpen(false);
  };

  return (
    <div className="relative h-full flex flex-1 flex-col">
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
        <div className="text-2xl pl-2 font-bold text-gray-900">
          Manage your quests and participants
        </div>
        <div className="mt-4 lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {subNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-50 text-orange-600 hover:bg-white"
                      : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                    "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-orange-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* table details */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    This is a list of all users who have completed your quest.
                    You can send them messages (via XMTP).
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    onClick={sendMessageToSelect}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Message
                  </button>
                </div>
              </div>
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      {selectedList?.length > 0 && (
                        <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                          {/* <button
                            type="button"
                            className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Message select
                          </button> */}
                          {/* <button
                            type="button"
                            className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Delete all
                          </button> */}
                        </div>
                      )}
                      <table className="min-w-full table-fixed divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="relative w-12 px-6 sm:w-16 sm:px-8"
                            >
                              <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 sm:left-6"
                                ref={checkbox}
                                checked={checked}
                                onChange={toggleAll}
                              />
                            </th>
                            <th
                              scope="col"
                              className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                            >
                              User
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              ENS
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Time completed
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Rabbithole?
                            </th>
                            {/* <th
                              scope="col"
                              className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                            >
                              <span className="sr-only">Edit</span>
                            </th> */}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {userList?.map((item) => (
                            <tr
                              key={item.address}
                              className={
                                selectedList.includes(item)
                                  ? "bg-gray-50"
                                  : undefined
                              }
                            >
                              <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                {selectedList.includes(item) && (
                                  <div className="absolute inset-y-0 left-0 w-0.5 bg-amber-600" />
                                )}
                                <input
                                  type="checkbox"
                                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 sm:left-6"
                                  value={item.userID}
                                  checked={selectedList.includes(item)}
                                  onChange={(e) =>
                                    setSelectedList(
                                      e.target.checked
                                        ? [...selectedList, item]
                                        : selectedList.filter((p) => p !== item)
                                    )
                                  }
                                />
                              </td>
                              <td
                                className={classNames(
                                  "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                                  selectedList.includes(item)
                                    ? "text-amber-600"
                                    : "text-gray-900"
                                )}
                              >
                                {item.address}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.ens}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.timeCompleted}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.isOwnRabbithole.toString()}
                              </td>
                              {/* <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <a
                                  href="#"
                                  className="text-amber-600 hover:text-amber-900"
                                >
                                  Edit
                                  <span className="sr-only">
                                    , {item.name}
                                  </span>
                                </a>
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="fixed z-10 inset-0 overflow-y-auto w-full "
              onClose={setOpen}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                    <div>
                      {" "}
                      <form action="#" className="relative w-full">
                        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                          <label htmlFor="title" className="sr-only">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            className="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          <label htmlFor="description" className="sr-only">
                            Description
                          </label>
                          <textarea
                            rows={6}
                            name="description"
                            id="description"
                            className="block w-full border-0 py-0 resize-none placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Write a description..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>

                        <div className="absolute bottom-0 inset-x-px">
                          <div className="flex justify-end items-center flex-shrink-0 sm:px-3 pb-2">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                              onClick={submitMessage}
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </main>
    </div>
  );
};

Dashboard.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Dashboard;
