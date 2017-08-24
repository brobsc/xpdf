<template lang='pug'>
  div
    h1.title Settings
    b-field(label='Quality' grouped)
      b-input(size='is-small' icon='level-up' v-model='quality' type='number' max='100' min='1')
    b-field(label='Contrast' grouped)
      b-input(size='is-small' icon='adjust' v-model='contrast' type='number' max='2' min='0')
</template>

<script>
  export default {
    data() {
      return {
        name: 'settings-panel',
      };
    },

    methods: {
    },

    computed: {
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

<style lang='scss' scoped>
</style>

