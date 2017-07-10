import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  state: {
    files: [],
    pdfs: [],
    count: 0,
    acceptableExts: [
      'pdf',
      'jpg',
      'png',
    ],
  },
  mutations: {
    addFile(state, file) {
      state.files.push(file);
    },
    clearFiles(state) {
      state.files = [];
    },
    removeFile(state, file) {
      const index = state.files.indexOf(file);
      state.files.splice(index, 1);
    },
  },
});
