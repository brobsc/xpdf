<template lang='pug'>
  div
    h1 xPDF
    p Number of files: {{ files.length }}
    div
      ul.ui.list
        .item(v-for='file in files')
          i.file.icon
          .content
            .header {{ file.name }}
            .description {{ file.path}}
    div
      button.ui.primary.button Bundle
      button.ui.button(@click='clearFiles') Clear
</template>

<script>
  export default {
    computed: {
      files() {
        return this.$store.state.files;
      },
    },
    methods: {
      clearFiles() {
        this.$store.commit('clearFiles');
      },
      bundle() {

      },
    },
  };
</script>

<style>
</style>
