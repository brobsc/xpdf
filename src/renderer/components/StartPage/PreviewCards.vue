<template lang='pug'>
  div
    .columns
      .column
        b-pagination(:total='files.length' :current.sync='current' :per-page='perPage'
                    :size='size' :order='order' :simple='true')
    .columns.is-multiline.is-mobile.dragula-container(v-dragula='currentFiles' drake='currentFiles'
        v-on:dropModel='log(e)')
      .column.is-one-quarter(v-for='file in currentFiles' :key='file')
        .card
          .card-image
            img(:src="'file:///' + file.path")
          .card-content
            .title.is-4.is-spaced.is-marginless
              | {{ file.name }}
            .subtitle.is-6.is-pulled-right {{ file.size | prettyBytes }}
            .subtitle.is-6 {{ file.type }}
            .card-footer
              a.card-footer-item.is-paddingless(@click='removeFile(file)') Remove
</template>

<script>
  export default {
    name: 'preview-cards',

    computed: {
      files() {
        return this.$store.state.files;
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

    data() {
      return {
        current: 1,
        size: 'is-small',
        perPage: 8,
        order: 'is-centered',
      };
    },

    methods: {
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
</style>
