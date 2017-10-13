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
      button.is-small.button(@click='openPreview') Unbundle
    .gutter
    .gutter
    .gutter
</template>

<script>
  import tools from '../../lib/PDFTools.js';
  const { BrowserWindow } = require('electron').remote; // eslint-disable-line

  export default {
    name: 'bundler-buttons',

    data() {
      return {
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

      openPreview() {
        const top = require('electron').remote.getCurrentWindow().id; // eslint-disable-line
        const winProperties = {
          parent: top,
          modal: true,
          show: true,
          titleBarStyle: 'hidden-inset',
          minHeight: 494,
          maxHeight: 494,
          height: 494,
          minWidth: 700,
          maxWidth: 700,
          width: 700,
          webPreferences: {
            webSecurity: false,
          },
        };
        const child = new BrowserWindow(winProperties);
        let winURL = process.env.NODE_ENV === 'development' // eslint-disable-line
          ? 'http://localhost:9080'
          : `file://${__dirname}/index.html`;

        child.loadURL(winURL);
        child.webContents.executeJavaScript('location.href += "preview"');
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

        const pdfs = tools.convertToPDF(await images, { quality: 100, contrast: this.contrast });

        this.$store.commit('addPDF', pdfs[0]);
        this.$store.commit('addPDF', pdfs[1]);
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
