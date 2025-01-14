/**
 * Mengambil portal yang dipilih dari localStorage.
 * @returns {Object|null} - Data portal yang dipilih
 */
export const getSelectedPortal = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("selectedPortal"));
    }
    return null;
  };
  
  /**
   * Menyimpan portal yang dipilih ke localStorage.
   * @param {Object} portal - Data portal yang akan disimpan
   */
  export const setSelectedPortal = (portal) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPortal", JSON.stringify(portal));
    }
  };
  
  /**
   * Menghapus data portal yang disimpan di localStorage.
   */
  export const clearSelectedPortal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedPortal");
    }
  };
  