export const userStats = {
  1: {
    categories: ["Crypto News", "Business", "Technology", "NFT"],
    stats: {
      totalArticles: 0, // Akan dihitung otomatis dari kategori
      totalViews: 5600,
      totalEarnings: 13.462,
      barData: {
        dailyLabels: ["2024-06-01", "2024-06-02", "2024-06-03"],
        weeklyLabels: ["Week 1", "Week 2", "Week 3"],
        monthlyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

        datasets: [
          {
            label: "Crypto News",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30), // 30 hari
            weeklyData: Array(4).fill(2500 / 4), // 4 minggu
            monthlyData: [500, 400, 450, 350, 400, 400], // Data untuk setiap bulan
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Business",
            total: 3000,
            dailyData: Array(30).fill(3000 / 30),
            weeklyData: Array(4).fill(3000 / 4),
            monthlyData: [600, 500, 550, 500, 450, 400], // Data untuk setiap bulan
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Technology",
            total: 2000,
            dailyData: Array(30).fill(2000 / 30),
            weeklyData: Array(4).fill(2000 / 4),
            monthlyData: [400, 350, 300, 300, 350, 300], // Data untuk setiap bulan
            backgroundColor: "rgba(255, 206, 86, 0.7)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "NFT",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30),
            weeklyData: Array(4).fill(2500 / 4),
            monthlyData: [500, 400, 450, 450, 350, 350], // Data untuk setiap bulan
            backgroundColor: "rgba(153, 102, 255, 0.7)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },

      doughnutData: {
        labels: ["Crypto News", "Business", "Technology", "NFT"],
        datasets: [
          {
            label: "Total Views by Category",
            dailyData: [150, 30, 70, 40],
            weeklyData: [350, 210, 490, 280],
            monthlyData: [1500, 1200, 1800, 1100], // Total per bulan
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },

      lineData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Earnings",
            data: [1200, 1500, 1700, 2000, 2500, 3000],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
        ],
      },
    },
  },
  2: {
    categories: ["Crypto News", "Business", "Technology", "NFT"],
    stats: {
      totalArticles: 0, // Akan dihitung otomatis dari kategori
      totalViews: 5600,
      totalEarnings: 13.462,
      barData: {
        dailyLabels: ["2024-06-01", "2024-06-02", "2024-06-03"],
        weeklyLabels: ["Week 1", "Week 2", "Week 3"],
        monthlyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

        datasets: [
          {
            label: "Crypto News",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30), // 30 hari
            weeklyData: Array(4).fill(2500 / 4), // 4 minggu
            monthlyData: [700, 300, 250, 350, 400, 100], // Data untuk setiap bulan
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Business",
            total: 3000,
            dailyData: Array(30).fill(3000 / 30),
            weeklyData: Array(4).fill(3000 / 4),
            monthlyData: [700, 200, 350, 400, 150, 100], // Data untuk setiap bulan
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Technology",
            total: 2000,
            dailyData: Array(30).fill(2000 / 30),
            weeklyData: Array(4).fill(2000 / 4),
            monthlyData: [400, 350, 300, 300, 350, 300], // Data untuk setiap bulan
            backgroundColor: "rgba(255, 206, 86, 0.7)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "NFT",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30),
            weeklyData: Array(4).fill(2500 / 4),
            monthlyData: [500, 400, 450, 450, 350, 350], // Data untuk setiap bulan
            backgroundColor: "rgba(153, 102, 255, 0.7)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },

      doughnutData: {
        labels: ["Crypto News", "Business", "Technology", "NFT"],
        datasets: [
          {
            label: "Total Views by Category",
            dailyData: [150, 30, 70, 40],
            weeklyData: [350, 210, 490, 280],
            monthlyData: [1500, 1200, 1800, 1100], // Total per bulan
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },

      lineData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Earnings",
            data: [1200, 1500, 1700, 2000, 2500, 3000],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
        ],
      },
    },
  },
  3: {
    categories: ["Crypto News", "Business", "Technology", "NFT"],
    stats: {
      totalArticles: 0, // Akan dihitung otomatis dari kategori
      totalViews: 5600,
      totalEarnings: 12345,
      barData: {
        dailyLabels: ["2024-06-01", "2024-06-02", "2024-06-03"],
        weeklyLabels: ["Week 1", "Week 2", "Week 3"],
        monthlyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

        datasets: [
          {
            label: "Crypto News",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30), // 30 hari
            weeklyData: Array(4).fill(2500 / 4), // 4 minggu
            monthlyData: [700, 300, 250, 350, 400, 100], // Data untuk setiap bulan
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Business",
            total: 3000,
            dailyData: Array(30).fill(3000 / 30),
            weeklyData: Array(4).fill(3000 / 4),
            monthlyData: [700, 200, 350, 400, 150, 100], // Data untuk setiap bulan
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Technology",
            total: 2000,
            dailyData: Array(30).fill(2000 / 30),
            weeklyData: Array(4).fill(2000 / 4),
            monthlyData: [400, 350, 300, 300, 350, 300], // Data untuk setiap bulan
            backgroundColor: "rgba(255, 206, 86, 0.7)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "NFT",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30),
            weeklyData: Array(4).fill(2500 / 4),
            monthlyData: [500, 400, 450, 450, 350, 350], // Data untuk setiap bulan
            backgroundColor: "rgba(153, 102, 255, 0.7)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },

      doughnutData: {
        labels: ["Crypto News", "Business", "Technology", "NFT"],
        datasets: [
          {
            label: "Total Views by Category",
            dailyData: [150, 30, 70, 40],
            weeklyData: [350, 210, 490, 280],
            monthlyData: [1500, 1200, 1800, 1100], // Total per bulan
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },

      lineData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Earnings",
            data: [1200, 1500, 1700, 2000, 2500, 3000],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
        ],
      },
    },
  },
  4: {
    categories: ["Crypto News", "Business", "Technology", "NFT"],
    stats: {
      totalArticles: 0, // Akan dihitung otomatis dari kategori
      totalViews: 5600,
      totalEarnings: 12345,
      barData: {
        dailyLabels: ["2024-06-01", "2024-06-02", "2024-06-03"],
        weeklyLabels: ["Week 1", "Week 2", "Week 3"],
        monthlyLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

        datasets: [
          {
            label: "Crypto News",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30), // 30 hari
            weeklyData: Array(4).fill(2500 / 4), // 4 minggu
            monthlyData: [700, 300, 250, 350, 400, 100], // Data untuk setiap bulan
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Business",
            total: 3000,
            dailyData: Array(30).fill(3000 / 30),
            weeklyData: Array(4).fill(3000 / 4),
            monthlyData: [700, 200, 350, 400, 150, 100], // Data untuk setiap bulan
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Technology",
            total: 2000,
            dailyData: Array(30).fill(2000 / 30),
            weeklyData: Array(4).fill(2000 / 4),
            monthlyData: [400, 350, 300, 300, 350, 300], // Data untuk setiap bulan
            backgroundColor: "rgba(255, 206, 86, 0.7)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "NFT",
            total: 2500,
            dailyData: Array(30).fill(2500 / 30),
            weeklyData: Array(4).fill(2500 / 4),
            monthlyData: [500, 400, 450, 450, 350, 350], // Data untuk setiap bulan
            backgroundColor: "rgba(153, 102, 255, 0.7)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },

      doughnutData: {
        labels: ["Crypto News", "Business", "Technology", "NFT"],
        datasets: [
          {
            label: "Total Views by Category",
            dailyData: [150, 30, 70, 40],
            weeklyData: [350, 210, 490, 280],
            monthlyData: [1500, 1200, 1800, 1100], // Total per bulan
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },

      lineData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Earnings",
            data: [1200, 1500, 1700, 2000, 2500, 3000],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
        ],
      },
    },
  },
};
