<template lang='pug'>
  #app(@dragover.prevent='' @drop.stop.prevent='addFiles')
      router-view
</template>

<script src='./App.vue.js'>
</script>

<style lang='scss'>
@import '~bulma/sass/utilities/_all';

// Set custom here
//
//

@import '~bulma';
@import '~buefy/src/scss/buefy';
@import 'assets/font-awesome-4.7.0/css/font-awesome.min.css';
@import '~dragula/dist/dragula.min.css';

body {
  margin: 0px;
  height: 100%;
  width: 100%;
  padding: 0px;
  position: fixed;
  overflow: scroll;
};
#app {
  margin: 0px;
  padding: 48px;
  height: 100%;
}
</style>
