<template>
  <div id="app">
    <NextBusModal/>
    <NextBusSearch/>
    <NextBusResults/>
  </div>
</template>

<script>
import Vue from 'vue'
import VueTypedJs from 'vue-typed-js'

import NextBusSearch from './components/NextBus-Search.vue'
import NextBusResults from './components/NextBus-Results.vue'
import NextBusModal from './components/NextBus-Modal.vue'

export default {
  name: 'App',
  components: {
    NextBusSearch,
    NextBusResults,
    NextBusModal
  }
}

Vue.use(VueTypedJs);
</script>

<style>
#app {
  text-align: center;
  margin:0;
  padding:0;
}
</style>
