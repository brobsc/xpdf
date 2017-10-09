<template lang='pug'>
  .x-container
    .gutter
    .gutter
    .gutter
    .x-button.control
      button.is-outlined.is-small.is-primary.button(:class="{ 'is-loading': isGenerating }" @click='generatePreview') Preview
    .x-button.control
      button.is-small.button(@click='clearFiles') Clear
    .x-button.control
      button.is-small.button(@click='unbundle') Unbundle
    .gutter
    .gutter
    .gutter
</template>

<script>
  import tools from '../../lib/PDFTools.js';

  export default {
    data() {
      return {
        name: 'bundler-buttons',
        isGenerating: false,
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

      unbundle() {
        this.isGenerating = true;
        const files = this.$store.state.files;

        files.forEach((file) => {
          const ext = tools.getFileExtension(file.realPath);

          if (ext === 'pdf') {
            const list = tools.extractPDF(file);

            list.forEach((image) => {
              this.$store.commit('addFile', image);
            });

            this.$store.commit('removeFile', file);

            console.log(list); // eslint-disable-line
          }
        });

        this.isGenerating = false;
      },

      // TODO: It's a mess of awaits and promises
      async generatePreview() {
        this.isGenerating = true;
        const files = this.$store.state.files;
        let images = [];

        images = await Promise.all(files.map(async (file) => {
          const f = await tools.optimize(file, { quality: this.quality });
          return f;
        }));

        tools.convertToPDF(await images, { quality: 100, contrast: this.contrast });

        this.isGenerating = false;
      },
    },
  };
</script>

<style lang='scss' scoped>
  .x-container {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: 1fr;
    padding-top: 10px;
    justify-items: center;
  }
  /* Necessary for corrent loading background-color */
  button.is-outlined.is-loading:focus {
    background-color: transparent !important;
  }
</style>
