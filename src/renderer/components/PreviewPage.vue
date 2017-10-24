<template lang='pug'>
  .x-preview-page
    a.button.is-primary(@click='goBack') Back
    h1.title Results
    .x-pdf-cards
      base-card(v-for='pdf in pdfs' :key='pdf.name'
      :file='pdf'
      :pdf-action='openPDF' pdf-action-icon='expand'
      :card-action='goBack'
      :card-height='300'
      :card-font-size='12'
      :showTooltip='false')
    .controls
</template>

<script>
  import PDFWindow from 'electron-pdf-window';
  import BaseCard from './BaseCard.vue';

  export default {
    name: 'preview-page',

    components: {
      BaseCard,
    },

    data() {
      return {
      };
    },

    computed: {
      pdfs() {
        return this.$store.state.pdfs;
      },
    },

    methods: {
      goBack() {
        this.$router.push('/');
      },

      openPDF(file) {
        const { BrowserWindow } = require('electron').remote; // eslint-disable-line

        const path = `file:///${file.realPath}`;

        const win = new BrowserWindow({
          width: 960,
          height: 540,
          webPreferences: {
            devTools: false,
          },
        });

        PDFWindow.addSupport(win);

        win.loadURL(path);
      },
    },

    created() {
      if (this.pdfs.length === 0) {
        this.$router.push('/');
      }
    },
  };
</script>

<style lang='scss' scoped>
  .x-preview-page {
    display: grid;
    grid-template-rows: 1fr 4fr 1fr;
    grid-template-columns: 1fr 9fr;
    grid-template-areas:
      'back-button title'
      'pdf pdf'
      'controls control';
    grid-gap: 16px;
  };

  .title {
    grid-area: title;
  }

  .x-pdf-cards {
    display: grid;
    grid-area: pdf;
    grid-template-columns: 1fr 1fr;
    grid-gap: 32px;
  }
</style>
