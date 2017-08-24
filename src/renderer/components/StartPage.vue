<template lang='pug'>
  .container
    .columns.is-mobile
      .column
        h1.title sPDF
        p Files: {{ files.length }}
      .column
        h1.title Settings
        b-field(label='Quality')
          b-input(size='is-small' icon='level-up' v-model='quality' type='number' max='100' min='1')
        b-field
          b-checkbox(v-model='contrast')
            | Contrast
    .columns.is-mobile
      .column
        preview-cards
    .columns.is-mobile
      .column
        bundler-buttons
</template>

<script>
  import BundlerButtons from './StartPage/BundlerButtons';
  import PreviewCards from './StartPage/PreviewCards';

  export default {
    name: 'start-page',
    components: {
      BundlerButtons,
      PreviewCards,
    },

    computed: {
      files() {
        return this.$store.state.files;
      },
      quality: {
        get() {
          return this.$store.state.quality;
        },
        set(val) {
          this.$store.commit('changeQuality', val);
        },
      },
      contrast: {
        get() {
          return this.$store.state.applyContrast;
        },
        set(val) {
          this.$store.commit('changeContrast', val);
        },
      },
    },
  };
</script>

<style>
</style>
