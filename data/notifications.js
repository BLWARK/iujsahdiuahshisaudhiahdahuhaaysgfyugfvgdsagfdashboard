// data/notifications.js
export const notificationsDummy = [
    {
      id: 1,
      message: "Artikel baru telah dikirimkan.",
      sender: "Rhonald Bastian",
      timestamp: new Date().setMinutes(new Date().getMinutes() - 10), // 10 menit lalu
      read: false,
      url: "/dashboard/user-management/all-artikel",
    },
    {
      id: 2,
      message: "Artikel baru telah dikirimkan.",
      sender: "Logan Wolfrine",
      timestamp: new Date().setHours(new Date().getHours() - 1), // 1 jam lalu
      read: false,
      url: "/dashboard/user-management/all-artikel",
    },
    {
      id: 3,
      message: "Artikel Anda membutuhkan revisi.",
      sender: "Fay Muhammad",
      timestamp: new Date().setDate(new Date().getDate() - 1), // Kemarin
      read: true,
    },
  ];
  