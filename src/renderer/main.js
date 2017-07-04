import Vue from 'vue';
import fileType from 'file-type';
import readChunk from 'read-chunk';

import App from './App';
import router from './router';
import store from './store';

import '../../semantic/dist/semantic.css';
// import '../../semantic/dist/semantic.js';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');

/* eslint-disable */
Vue.filter('prettyBytes', (num) => {
  // jacked from: https://github.com/sindresorhus/pretty-bytes
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number');
  }

  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
  const unit = units[exponent];
  const neg = num < 0;

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B';
  }

  num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;

  return (neg ? '-' : '') + num + ' ' + unit;
});
/* eslint-enable */

// Custom Libraries
Object.defineProperty(Vue.prototype, '$fileType', { value: fileType });
Object.defineProperty(Vue.prototype, '$readChunk', { value: readChunk });
