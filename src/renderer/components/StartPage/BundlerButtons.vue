<template lang='pug'>
  div
    .field.is-grouped
      p.control
        button.is-outlined.is-small.is-primary.button(@click='generatePreview') Preview
      p.control
        button.is-small.button(@click='clearFiles') Clear
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

    computed: {
      quality() {
        return this.$store.state.quality;
      },
      contrast() {
        return this.$store.state.applyContrast;
      },
    },

    methods: {
      clearFiles() {
        this.$store.commit('clearFiles');
      },

      bundle() {
      },

      generatePreview() {
        const files = this.$store.state.files;
        const images = [];

        files.forEach(file => images.push(tools.optimize(file)));

        tools.convert(images, this.quality, this.contrast);
      },
    },
  };
</script>

<style lang='scss' scoped>
</style>
