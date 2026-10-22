/**
 * ArtEX Profile Page Helpers
 */
const ProfileHelper = {
  formatRating(val) {
    return `⭐ ${(Number(val) || 5.0).toFixed(1)}`;
  },
  formatPrice(amount) {
    return `${Number(amount || 0).toLocaleString()} ₸`;
  }
};

window.ArtEX_Profile = ProfileHelper;
