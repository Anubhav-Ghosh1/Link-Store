// "use client";
// import { useUser } from "@/context/UserContext";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import React, { useEffect } from "react";

// export default function User() {
//   const { id } = useParams();
//   const { user } = useUser();
//   const [userData, setUserData] = React.useState<any>(null);
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
//   const fetchUser = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Token", token);
//       const res = await fetch(`${API_URL}/user/user-details`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       console.log("Data", data.data.user);
//       setUserData(data.data.user);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   };
// //   const userDetails = localStorage.getItem("user")
// //     ? JSON.parse(localStorage.getItem("user") as string)
// //     : null;

//   useEffect(() => {
//     fetchUser();
//   }, []);
// //   console.log("User", user, "User Details", userDetails);
//   console.log("User ID", id);
//   return (
//     <div className="text-black">
//         a
//       {userData &&
//           <div key={userData._id}>
//             {/* <h1>{user.displayName}</h1>
//             <p>{user.email}</p> */}
//             <p>{userData.username}</p>
//             <p>{userData.confirmed ? "Confirmed" : "Not Confirmed"}</p>
//             <p>Profile Views: {userData.profileViews}</p>
//             {
//                 userData.socialLinks.map((link: any, index: number) => (
//                     <div>
//                         <Image src={link.url} alt={link.title} width={50} height={50} />
//                         <p key={index}>{link.title}</p>
//                         <a href={link.url}>Link</a>
//                         </div>
//                 ))
//             }
//             <p>Social Links: {userData.socialLinks.join(", ")}</p>
//           </div>
//     }
//     </div>
//   );
// }

"use client";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoCellular } from "react-icons/io5";
import { IoLogoGithub } from "react-icons/io";
import ActiveButton from "../components/ActiveButton";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Dashboard() {
  const { id } = useParams();
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    type: string;
    index: number | null;
    link: { title: string; url: string };
  }>({
    type: "",
    index: null,
    link: { title: "", url: "" },
  });
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user/user-details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserData(data.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleAddLink = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user/add-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLink),
      });

      const data = await res.json();
      setUserData(data.data.user); // Update UI
      setNewLink({ title: "", url: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };
  console.log("User", userData);
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-10">
      {/* Main Dashboard Section */}
      <div className="lg:w-2/3 mr-72">
        <p className="text-2xl font-bold text-center mb-4 text-gray-800">
          Link Store Dashboard
        </p>
        <div className="mx-auto bg-white border p-6 rounded-2xl shadow-md">
          {userData && (
            <>
              <div className="text-center space-y-2 mb-6">
                <p className="text-lg font-semibold">
                  Welcome, {userData.username}
                </p>
                <div className="flex items-center text-xs justify-center gap-2">
                  <ActiveButton status={userData.confirmed} />
                </div>
                <p className="text-sm text-gray-600">
                  Profile Views:{" "}
                  <span className="font-bold">{userData.profileViews}</span>
                </p>
                <p className="text-sm font-semibold text-black break-words">
                  Your Unique Link:{" "}
                  <a
                    href={`${FRONTEND_URL}/user/${userData._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-normal text-blue-600"
                  >
                    {FRONTEND_URL}/user/{userData._id}
                  </a>
                </p>
              </div>

              {/* Manage Links and View Stats Section */}
              <div className="mt-6 text-center flex justify-center gap-4">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  {showForm ? "Close Manage Links" : "Manage Links"}
                </button>
              </div>

              {/* Add New Link Form */}
              {showForm && (
                <div className="mt-4 space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddLink();
                    }}
                    className="space-y-4"
                  >
                    <p className="text-lg font-semibold mb-4">Add link</p>
                    <input
                      type="text"
                      placeholder="Title (e.g. LinkedIn)"
                      value={newLink.title}
                      onChange={(e) =>
                        setNewLink({ ...newLink, title: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g. https://linkedin.com/in/username)"
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-green-600 cursor-pointer font-semibold text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                    >
                      Save Link
                    </button>
                  </form>

                  {/* Existing Links */}
                  <div className="mt-6">
                    <p className="text-lg font-semibold mb-4">Manage Links</p>
                    {userData.socialLinks.map((link: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg mb-2 bg-gray-50"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 cursor-pointer">
                            <p className="font-semibold">{link.title}</p>
                            <p className="text-sm text-gray-600">{link.url}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setModalData({
                                  type: "update",
                                  index,
                                  link,
                                });
                                setShowModal(true);
                              }}
                              className="bg-blue-500 cursor-pointer font-semibold text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setModalData({
                                  type: "delete",
                                  index,
                                  link: { title: "", url: "" },
                                });
                                setShowModal(true);
                              }}
                              className="bg-red-600 cursor-pointer font-semibold text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Graph Section */}
            </>
          )}
        </div>
      </div>

      {/* Mobile Preview Section */}
      <div className="fixed w-fit right-10 top-28 justify-center hidden lg:flex">
        <div className="w-[300px] h-[600px] bg-white rounded-3xl shadow-xl border-4 relative overflow-hidden">
          <div className="bg-gray-100 flex justify-end gap-x-2 h-8 w-full px-2 py-2">
            <IoCellular />
            <IoLogoGithub />
          </div>
          <div className="p-4">
            {userData && (
              <>
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold">{userData.username}</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  {userData.socialLinks.map((link: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => window.open(link.url, "_blank")}
                      className="flex items-center relative w-full cursor-pointer hover:scale-[0.99] hover:shadow-md active:scale-[0.99] active:shadow-md transition-all ease-in duration-200 max-w-[250px] p-3 border rounded-full shadow-sm bg-gray-50"
                    >
                      <Image
                        src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`}
                        alt={link.title}
                        width={24}
                        height={24}
                        className="rounded-full absolute"
                      />
                      <div className="w-full flex justify-center">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm"
                        >
                          <p>{link.title}</p>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200/40 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2">
            {modalData.type === "update" && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Update Link
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const updatedLinks = userData.socialLinks.map(
                      (l: any, i: number) =>
                        i === modalData.index
                          ? {
                              ...l,
                              title: modalData.link.title,
                              url: modalData.link.url,
                            }
                          : l
                    );
                    setUserData({ ...userData, socialLinks: updatedLinks });
                    setShowModal(false);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={modalData.link.title}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        link: { ...modalData.link, title: e.target.value },
                      })
                    }
                    className="w-full p-2 border-2 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={modalData.link.url}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        link: { ...modalData.link, url: e.target.value },
                      })
                    }
                    className="w-full p-2 border-2 rounded-lg"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
            {modalData.type === "delete" && (
              <>
                <h3 className="text-lg font-semibold mb-4">Delete Link</h3>
                <p>Are you sure you want to delete this link?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedLinks = userData.socialLinks.filter(
                        (_: any, i: number) => i !== modalData.index
                      );
                      setUserData({ ...userData, socialLinks: updatedLinks });
                      setShowModal(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
