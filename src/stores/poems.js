import { defineStore } from 'pinia';
import data from '../data/poems.json';

export const usePoemsStore = defineStore('poems', {
  state: () => ({
    poems: data,
    favorites: [],
    likes: [],
    query: ''
  }),
  getters: {
    filteredPoems(state) {
      const q = state.query.trim().toLowerCase();
      if (!q) return state.poems;
      return state.poems.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.content && p.content.join(' ').toLowerCase().includes(q))
      );
    }
  },
  actions: {
    setQuery(q) { this.query = q; },
    toggleFavorite(id) {
      const i = this.favorites.indexOf(id);
      if (i >= 0) this.favorites.splice(i, 1);
      else this.favorites.push(id);
    },
    toggleLike(id) {
      const i = this.likes.indexOf(id);
      if (i >= 0) this.likes.splice(i, 1);
      else this.likes.push(id);
    }
  }
});