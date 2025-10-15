import { defineStore } from 'pinia';
import { supabase } from '../lib/supabaseClient';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    profile: null,
    ready: false
  }),
  getters: {
    uid: (s) => s.user?.id ?? null
  },
  actions: {
    async init() {
      // 获取现有会话
      const { data: { session } } = await supabase.auth.getSession();
      this.isLoggedIn = !!session;
      this.user = session?.user ?? null;
      if (this.uid) await this.fetchProfile();

      // 监听会话变化
      supabase.auth.onAuthStateChange(async (_event, session) => {
        this.isLoggedIn = !!session;
        this.user = session?.user ?? null;
        if (this.uid) {
          await this.fetchProfile();
        } else {
          this.profile = null;
        }
      });

      this.ready = true;
    },

    async loginWithPassword({ email, password }) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.isLoggedIn = !!data.session;
      this.user = data.session?.user ?? null;
      if (this.uid) await this.fetchProfile();
    },

    async signUp({ email, password, nickname }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: nickname }
        }
      });
      if (error) throw error;
      // 可能需要邮箱确认后才有 session
      if (data.session) {
        this.isLoggedIn = true;
        this.user = data.session.user;
        await this.fetchProfile();
      }
      return data;
    },

    async signOut() {
      await supabase.auth.signOut();
      this.isLoggedIn = false;
      this.user = null;
      this.profile = null;
    },

    async fetchProfile() {
      if (!this.uid) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, website, avatar_url, updated_at')
        .eq('id', this.uid)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // no rows returned
      this.profile = data ?? null;
      return this.profile;
    },

    async updateProfile(payload) {
      if (!this.uid) throw new Error('Not logged in');
      const row = {
        id: this.uid,
        ...payload,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('profiles').upsert(row);
      if (error) throw error;
      await this.fetchProfile();
    },

    async uploadAvatar(file) {
      if (!this.uid) throw new Error('Not logged in');
      const ext = file.name.split('.').pop();
      const filePath = `${this.uid}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (error) throw error;
      await this.updateProfile({ avatar_url: filePath });
      return filePath;
    },

    getPublicAvatarUrl(path) {
      if (!path) return '';
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      return data.publicUrl;
    }
  }
});