<template lang='pug'>
  div(:class='{ "drop-area": isEmpty}')
    .x-drop-message(v-if='isEmpty')
      p You can also drop files here...
    .x-container
      .x-pagination
        b-pagination(:total='files.length' :current.sync='current' :per-page='perPage'
          :size='size' :order='order' :simple='true' :class='{ "is-invisible": !needsPagination }')
      .x-cards.dragula-container(v-dragula='currentFiles'
                                 drake='currentFiles')
        .x-card.card(v-for='file in currentFiles' :key='file.name')
          .card-image
            img(src='http://via.placeholder.com/106x150' :ref='file.name')
            .dim-overlay
              a.button.is-small.is-primary(:class="{'is-loading': unbundling}" v-if='isPDF(file)' @click='unbundlePDF(file)')
                span.icon.is-small
                  i.fa.fa-unlink
              a.button.is-small.is-primary(:class="{'is-loading': rotating}" v-if='!isPDF(file)' @click='rotateImage(file)')
                span.icon.is-small
                  i.fa.fa-undo
          .x-card-content
            p.tooltip-text {{ file.realPath }}
            .x-card-title
              .title {{ file.name }}
            .x-card-ext
              p {{ getExtension(file) }}
            .x-card-size
              p {{ file.size | prettyBytes }}
            .x-card-button
              a.card-button(@click='removeFile(file)') Remove
    b-loading(:active.sync='unbundling' :canCancel='false')
</template>

<script>
  import tools from '../../lib/PDFTools.js';

  export default {
    name: 'preview-cards',

    data() {
      return {
        current: 1,
        size: 'is-small',
        perPage: 8,
        order: 'is-centered',
        unbundling: false,
        rotating: false,
        oldFiles: [],
      };
    },

    watch: {
      current() {
        if (this.current <= 0) {
          this.current = 1;
        }
      },

      // TODO: Fix pagination thumbs
      async files(obs) {
        if (this.isEmpty) return;
        const refs = await this.$refs;

        // Create new array comparing to old one
        const newFiles = obs.filter(i => !this.oldFiles.includes(i));
        newFiles.forEach(async (file) => {
          let element;
          try {
            element = await refs[file.name][0];
          } catch (e) {
            return;
          }

          const thumb = await tools.createPDFThumbnail(file);

          element.src = `file:///${thumb.realPath}`;
        });

        this.oldFiles = obs.slice();
      },
    },

    computed: {
      files() {
        return this.$store.state.files;
      },

      isEmpty() {
        return this.files.length === 0;
      },

      needsPagination() {
        return this.files.length > 8;
      },

      currentFiles: {
        get() {
          if (this.files.length <= 0) return [];

          const current = this.current;
          const step = this.perPage;
          const start = (current - 1) * step;
          const end = start + step;

          if (end >= this.files.length) {
            return this.files.slice(start, this.files.length);
          }

          return this.files.slice(start, end);
        },
      },
    },

    methods: {
      getExtension(file) {
        const ext = tools.getFileExtension(file.realPath);

        return ext.toUpperCase();
      },

      isPDF(file) {
        return tools.getFileExtension(file.realPath) === 'pdf';
      },

      removeFile(file) {
        this.$store.commit('removeFile', file);
      },

      changeIndex(args) {
        const previous = args.dragIndex;
        const newValue = args.dropIndex;
        const current = this.current;
        const step = this.perPage;

        this.$store.commit('changeIndex', [previous, newValue, current, step]);
      },

      async unbundlePDF(file) {
        this.unbundling = true;
        const list = await tools.extractPDF(file);

        list.forEach((image) => {
          this.$store.commit('addFile', image);
        });

        this.$store.commit('removeFile', file);

        console.log(list); // eslint-disable-line
        this.unbundling = false;
      },

      async rotateImage(file) {
        this.rotating = true;
        const newFile = await tools.rotate(file);

        this.$store.commit('removeFile', file);
        this.$store.commit('addFile', newFile);
        this.rotating = false;
      },
    },

    created() {
      const $service = this.$dragula.$service;

      $service.options('currentFiles', {
        direction: 'horizontal',
        isContainer(el) {
          return el.classList.contains('dragular-container');
        },
      });

      $service.eventBus.$on('dropModel', (args) => { this.changeIndex(args) }); // eslint-disable-line
    },
  };
</script>

<style lang='scss' scoped>
  .drop-area {
    height: 100%;
    width: 100%;
    border: 2px dashed #cbcbcb;
  };

  .is-invisible {
    visibility: collapse;
  };

  .x-container {
    max-height: 435px;
    height: 100%;
    margin: 0;
    display: grid;
    grid-template-areas:
      'pagination'
      'cards';
    grid-template-rows: 10% 90%;
    grid-gap: 16px;
  }

  .x-pagination {
    grid-area: pagination;
  }

  .x-cards {
    grid-area: cards;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 8px;
  }

  .x-card {
    display: grid;
    grid-template-rows: 150px 1fr;
  }

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
    left: 0;
  }

  .x-card-content:hover .tooltip-text {
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
    color: red;
    justify-self: center;
  }

  .x-card-title > .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.2em;
    font-weight: bold;
  }

  .x-drop-message {
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;

    p {
      color: #cbcbcb;
    }
  }
</style>
