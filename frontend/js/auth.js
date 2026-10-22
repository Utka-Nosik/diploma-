/**
 * ArtEX Auth Utilities
 */
const Auth = {
  getCurrentUser() {
    try {
      const raw = localStorage.getItem('artex_user');
      return raw ? JSON.parse(raw) : { id: 'u_mikudasu', username: 'Mikudasu', role: 'artist' };
    } catch (e) {
      return { id: 'u_mikudasu', username: 'Mikudasu', role: 'artist' };
    }
  },

  setCurrentUser(user, token) {
    localStorage.setItem('artex_user', JSON.stringify(user));
    if (token) localStorage.setItem('artex_token', token);
  },

  logout() {
    localStorage.removeItem('artex_user');
    localStorage.removeItem('artex_token');
    window.location.href = '/index.html';
  }
};

window.ArtEX_Auth = Auth;
