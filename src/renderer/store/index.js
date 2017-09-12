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
    quality: 90,
    applyContrast: 'none',
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
    changeIndex(state, [oldIndex, newIndex, current, step]) {
      const from = oldIndex + ((current - 1) * step);
      const to = newIndex + ((current - 1) * step);
      state.files.splice(to, 0, state.files.splice(from, 1)[0]);
    },
    changeQuality(state, val) {
      state.quality = val;
    },
    changeContrast(state, val) {
      state.applyContrast = val;
    },
  },
});
