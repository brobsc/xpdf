import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start-page',
      component: require('@/components/StartPage'),
    },
    {
      path: '/preview',
      name: 'preview-page',
      component: require('@/components/PreviewPage.vue'),
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
