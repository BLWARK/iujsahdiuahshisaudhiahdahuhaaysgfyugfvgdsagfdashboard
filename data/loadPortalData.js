const portalCategories = {
    xyz: [
      { id: "entertainment", name: "Entertainment" },
      { id: "technology", name: "Technology" },
      { id: "sport", name: "Sport" },
      { id: "c-level", name: "C-Level" },
    ],
    lensa: [
      { id: "hukrim", name: "Hukum & Kriminal" },
      { id: "politik", name: "Politik" },
      { id: "lalu-lintas", name: "Lalu Lintas" },
      { id: "khasanah", name: "Khasanah" },

    ],
    coinzone: [
      { id: "blockchain", name: "Blockchain" },
      { id: "nft", name: "NFT" },
    ],
  };
  
  export const loadCategoriesByPortal = (portalId) => {
    return portalCategories[portalId] || [];
  };
  