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
  min-width: 100%;
  min-height: 100%;
  height: 100%;
  padding: 0px;
  position: fixed;
  overflow: scroll;
};
#app {
  display: grid;
  height: 100%;
  overflow: hidden;
  padding: 48px 32px 32px 32px;
}
</style>
