<template lang='pug'>
  .container
    .columns.is-mobile
      .column
        h1.title sPDF
        p Files: {{ files.length }}
      .column
        h1.title Settings
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
    },
  };
</script>

<style>
</style>
