<template lang='pug'>
  div
    .columns
      .column
        b-pagination(:total='files.length' :current.sync='current' :per-page='perPage'
        :size='size' :order='order' :simple='true' :class='{ "is-invisible": !needsPagination }')
    .columns.is-multiline.is-mobile.dragula-container.fixed-height(v-dragula='currentFiles'
                                      drake='currentFiles' :class='{ "drop-area": isEmpty }')
      .column.is-one-quarter(v-for='file in currentFiles' :key='file.name')
        .card
          .card-image
            img(src='http://via.placeholder.com/350x150' :ref='file.name')
            .dim-overlay
            a.button.is-small.is-primary(:class="{'is-loading': unbundling}" v-if='isPDF(file)' @click='unbundlePDF(file)')
              span.icon.is-small
                i.fa.fa-unlink
            a.button.is-small.is-primary(:class="{'is-loading': rotating}" v-if='!isPDF(file)' @click='rotateImage(file)')
              span.icon.is-small
                i.fa.fa-undo
          .card-content
            .title.is-4.is-spaced.is-marginless
              | {{ file.name }}
            .subtitle.is-6.is-pulled-right {{ file.size | prettyBytes }}
            .subtitle.is-6 {{ getExtension(file) }}
            .card-footer
              a.card-footer-item.is-paddingless(@click='removeFile(file)') Remove
    b-loading(:active.sync='unbundling' :canCancel='false')
</template>

<script>
  import tools from '../../lib/PDFTools.js';

  export default {
    data() {
      return {
        name: 'preview-cards',
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
          if (this.files.length <= 0) return []; // Bail out if empty. Improves perfomance.

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
  .card-image {
    background-color: #cbcbcb;
    height: 150px;
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

  .card-footer-item {
    color: red;
    font-size: 8px;
  };

  .card-content {
    padding: 4px;
  };

  .is-4 {
    font-size: 12px;
  };

  .is-6 {
    font-size: 8px;
    margin-bottom: 4px;
  };

  .column {
    padding: 5px;
  };

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  };

  .fixed-height {
    height: 430px !important;
  };

  .drop-area {
    width: 100%;
    position: relative;
    border: 2px dashed #cbcbcb;
  };

  .is-invisible {
    visibility: collapse;
  };
</style>
