<template lang='pug'>
  #app(@dragover.prevent='' @drop.stop.prevent='addFiles')
      router-view
</template>

<script src='./App.vue.js'>
</script>

<style>
#app {
  margin: 0px;
  padding: 48px;
  height: 100%;
  background: #7022b2;
  color: white;
}
</style>
