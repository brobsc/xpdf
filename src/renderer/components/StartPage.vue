<template lang='pug'>
  div
    h1 Hello Semantic3
    p {{ files.length }}
    ul
      li(v-for='file in files')
        p {{ file.path }}
    p {{ files }}
</template>

<script>
  export default {
    computed: {
      files() {
        return this.$store.state.files;
      },
    },
    methods: {
    },
  };
</script>

<style>
</style>
