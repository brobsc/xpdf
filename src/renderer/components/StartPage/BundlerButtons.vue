<template lang='pug'>
  div
    .field.is-grouped
      p.control
        button.is-outlined.is-small.is-primary.button(@click='generatePreview') Preview
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
      },

      // TODO: It's a mess of awaits and promises
      async generatePreview() {
        const files = this.$store.state.files;
        let images = [];

        images = await Promise.all(files.map(async (file) => {
          const f = await tools.optimize(file, { quality: this.quality });
          return f;
        }));

        tools.convert(await images, { quality: 100, contrast: this.contrast });
      },
    },
  };
</script>

<style lang='scss' scoped>
</style>
