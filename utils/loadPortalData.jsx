import { xyzArticles } from "@/data/xyzArticles";
import { lensaArticles } from "@/data/lensaArticles";
import { coinzoneArticles } from "@/data/coinzoneArticles";

/**
 * Fungsi untuk memuat artikel berdasarkan portal yang dipilih.
 * @param {string} portalId - ID portal (xyz, lensa, coinzone)
 * @returns {Array} - Data artikel sesuai portal
 */
export const loadArticlesByPortal = (portalId) => {
  switch (portalId) {
    case "xyz":
      return xyzArticles;
    case "lensa":
      return lensaArticles;
    case "coinzone":
      return coinzoneArticles;
    default:
      return [];
  }
};
