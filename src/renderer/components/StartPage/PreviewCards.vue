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
        base-card(v-for='file in currentFiles' :key='file.name'
                        :file='file'
                        :pdf-action='unbundlePDF', pdf-action-icon='unlink',
                        :img-action='rotateImage', img-action-icon='undo'
                        :card-action='removeFile')
    b-loading(:active.sync='unbundling' :canCancel='false')
</template>

<script>
  import BaseCard from '../BaseCard.vue';
  import tools from '../../lib/PDFTools.js';

  export default {
    name: 'preview-cards',

    components: {
      BaseCard,
    },

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
