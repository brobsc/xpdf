const state = {
  quality: 100,
  imgMode: false,
};

const mutations = {
  CHANGE_QUALITY(state, num) {
    state.main = num;
  },
  TOGGLE_MODE(state) {
    state.imgMode = !state.imgMode;
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
