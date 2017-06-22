const state = {
  files: [],
  pdfs: [],
  acceptableExts: [
    'pdf',
    'jpg',
    'png',
  ],
};

const mutations = {
  addFile(state, file) {
    state.files.push(file);
  },

};

const actions = {
  // someAsyncTask({ commit }) {
  //   // do something async
  //   commit('INCREMENT_MAIN_COUNTER');
  // },
};

export default {
  state,
  mutations,
  actions,
};
