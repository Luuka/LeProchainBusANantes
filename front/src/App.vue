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

const version = '1.1';

export default {
  name: 'App',
  components: {
    NextBusSearch,
    NextBusResults,
    NextBusModal
  },
  mounted: function() {
    let currentVersion = localStorage.getItem("NEXTBUS_VERSION");
    if(currentVersion !== version) {
      localStorage.setItem("NEXTBUS_FAVORITES",JSON.stringify({}));
      localStorage.setItem("NEXTBUS_HISTORY",JSON.stringify({}));
      localStorage.setItem("NEXTBUS_VERSION",version);
    }
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
