<template lang='pug'>
  div
    div
      button.ui.primary.button(@click='generatePreview') Preview
      button.ui.button(@click='clearFiles') Clear
      button.ui.button(@click='bundle') Bundle
    canvas#pdfPreview
</template>

<script>
  import tools from '../../lib/PDFTools.js';

  export default {
    data() {
      return {
        name: 'bundler-buttons',
      };
    },

    methods: {
      showPDF: true,

      clearFiles() {
        this.$store.commit('clearFiles');
      },

      bundle() {
      },

      generatePreview() {
        const files = this.$store.state.files;
        const images = [];

        files.forEach(file => images.push(tools.optimize(file)));

        tools.convert(images, 90);
      },
    },
  };
</script>

<style lang='scss' scoped>
</style>
