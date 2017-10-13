<template lang='pug'>
  .x-card.card
    .card-image
      img(v-if='thumbReady' :src='thumbSrc')
      img(v-else src='http://via.placeholder.com/106x150')
      .dim-overlay
        a.button.is-small.is-primary(:class="{'is-loading': unbundling}" v-if='isPDF(file)' @click='pdfAction(file)')
          span.icon.is-small
            i.fa(:class="'fa-' + pdfActionIcon")
        a.button.is-small.is-primary(:class="{'is-loading': rotating}" v-if='!isPDF(file)' @click='imgAction(file)')
          span.icon.is-small
            i.fa(:class="'fa-' + imgActionIcon")
    .x-card-content
      p.tooltip-text(v-if='showTooltip') {{ file.realPath }}
      .x-card-title
        .title {{ file.name }}
      .x-card-ext
        p {{ getExtension(file) }}
      .x-card-size
        p {{ file.size | prettyBytes }}
      .x-card-button
        a.card-button(@click='cardAction(file)' :style='{ color: cardActionColor }') Remove
</template>

<script>
  import tools from '../lib/PDFTools.js';

  export default {
    name: 'base-card',

    props: {
      file: {
        type: File,
        required: true,
      },

      pdfAction: {
        type: Function,
        required: true,
      },

      imgAction: {
        type: Function,
        default: () => {
        },
      },

      cardAction: {
        type: Function,
        required: true,
      },

      pdfActionIcon: {
        type: String,
        default: 'close',
      },

      imgActionIcon: {
        type: String,
        default: 'close',
      },

      showTooltip: {
        type: Boolean,
        default: true,
      },

      cardActionColor: {
        type: String,
        default: 'red',
      },
    },

    data() {
      return {
        unbundling: false,
        rotating: false,
        thumbReady: false,
        thumbSrc: '',
      };
    },

    computed: {
    },

    methods: {
      async generateThumb() {
        const thumb = await tools.createPDFThumbnail(this.file);

        this.thumbSrc = `file:///${thumb.realPath}`;
        this.thumbReady = true;
      },

      getExtension(file) {
        const ext = tools.getFileExtension(file.realPath);

        return ext.toUpperCase();
      },

      isPDF(file) {
        return tools.getFileExtension(file.realPath) === 'pdf';
      },
    },

    created() {
      this.generateThumb();
    },
  };
</script>

<style lang='scss' scoped>
  .x-card {
    display: grid;
    grid-template-rows: 150px 1fr;
  };

  .card-image {
    background-color: #cbcbcb;
  };

  /* dim-overlay found on: https://codepen.io/philcheng/pen/YWyYwG */
  .card-image .dim-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    transition: background 0.5s ease;
  }

  .card-image a.button {
    opacity: 0;
    transition: opacity .5s ease;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 35%;
  }

  .card-image:hover .dim-overlay {
    display: block;
    background: rgba(1000, 1000, 1000, .6);
  }

  .card-image:hover a.button {
    opacity: 1;
  }

  .x-card-title {
    overflow: overlay;
  }

  .x-card-content > .tooltip-text {
    opacity: 0;
    max-width: 100%;
    padding: 4px;
    overflow: visible;
    word-wrap: break-word;
    white-space: pre-wrap;
    transition: opacity .5s ease;
    font-size: 1em;
    font-weight: bold;
    color: white;
    background-color: #666;
    border-radius: 5%;
    position: absolute;
    bottom: 48px;
    right: 0;
    top: 9999px;
    left: 0;
  }

  .x-card-content:hover .tooltip-text {
    top: auto;
    opacity: 1;
  }

  img {
    max-height: 100%;
    width: 100%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  };

  .x-card-content {
    display: grid;
    margin: 0;
    padding: 2px;
    font-size: 6pt;
    max-height: 100%;
    overflow: hidden;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 33%);
    grid-template-areas:
      'title title'
      'ext size'
      'button button';
  }

  .x-card-ext {
    grid-area: ext;
  }

  .x-card-size {
    grid-area: size;
    justify-self: end;
  }

  .x-card-title {
    grid-area: title;
  }

  .x-card-button {
    display: grid;
    border-top: 1px outset;
    grid-area: button;
    justify-self: stretch;
  }

  .x-card-button > a {
    justify-self: center;
  }

  .x-card-title > .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.2em;
    font-weight: bold;
  }
</style>

