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
import ActiveButton from "../components/ActiveButton";

export default function Dashboard() {
  const { id } = useParams();
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Linktree Dashboard
        </h2>

        {userData && (
          <>
            <div className="text-center space-y-2 mb-6">
              <p className="text-lg font-semibold">{userData.username}</p>
              <div className="flex items-center justify-center gap-2">
                <ActiveButton status={userData.confirmed} />
              </div>
              <p className="text-sm text-gray-600">
                Profile Views: {userData.profileViews}
              </p>
              <p className="text-sm text-blue-600 break-words">
                Shareable Link:{" "}
                <a
                  href={`${FRONTEND_URL}/user/${userData._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {FRONTEND_URL}/user/{userData._id}
                </a>
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 justify-center">
              {userData.socialLinks.map((link: any, index: number) => (
                <div
                  key={index}
                  onClick={() => window.open(link.url, "_blank")}
                  className="flex items-center relative w-full cursor-pointer hover:scale-[0.99] hover:shadow-md active:scale-[0.99] active:shadow-md transition-all ease-in duration-200 max-w-[400px] p-3 border rounded-full shadow-sm bg-gray-50"
                >
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`}
                    alt={link.title}
                    width={36}
                    height={36}
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

            {/* Add New Link Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                {showForm ? "Cancel" : "Add New Link"}
              </button>
            </div>

            {/* Add New Link Form */}
            {showForm && (
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Title (e.g. LinkedIn)"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="URL (e.g. https://linkedin.com/in/username)"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  onClick={handleAddLink}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Save Link
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
