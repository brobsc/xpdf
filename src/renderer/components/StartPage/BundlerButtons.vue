<template lang='pug'>
  div
    .field.is-grouped
      p.control
        button.is-outlined.is-small.is-primary.button(:class="{ 'is-loading': isGenerating }" @click='generatePreview') Preview
      p.control
        button.is-small.button(@click='clearFiles') Clear
      p.control
        button.is-small.button(@click='unbundle') Unbundle
    canvas#pdfPreview
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
          const chunk = this.$readChunk.sync(file.realPath, 0, 4100);
          const ext = this.$fileType(chunk).ext;

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
  /* Necessary for corrent loading background-color */
  button.is-outlined.is-loading:focus {
    background-color: transparent !important;
  }
</style>
