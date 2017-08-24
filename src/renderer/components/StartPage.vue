<template lang='pug'>
  .container
    .columns.is-mobile
      .column
        h1.title sPDF
        p Files: {{ files.length }}
      .column
        settings-panel
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
  import SettingsPanel from './StartPage/SettingsPanel';

  export default {
    name: 'start-page',
    components: {
      BundlerButtons,
      PreviewCards,
      SettingsPanel,
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
