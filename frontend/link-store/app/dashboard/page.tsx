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

export default function Dashboard() {
  const { id } = useParams();
  const { user } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    userData.confirmed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {userData.confirmed ? "Confirmed" : "Not Confirmed"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Profile Views: {userData.profileViews}
              </p>
              <p className="text-sm text-blue-600 break-words">
                Shareable Link:{" "}
                <a
                  href={`${API_URL}/user/${userData._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {API_URL}/user/{userData._id}
                </a>
              </p>
            </div>

            <div className="space-y-4">
              {userData.socialLinks.map((link: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 border rounded-lg shadow-sm bg-gray-50"
                >
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`}
                    alt={link.title}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{link.title}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      {link.url}
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
