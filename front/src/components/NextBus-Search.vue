<template>
    <section class="search-wrapper">

        <vue-typed-js :strings="['Bus', 'Tram', 'Chronobus', 'Busway', 'Navibus']" :backSpeed="100" :loop="true" :showCursor="false" :typeSpeed="100" :startDelay="10" :backDelay="2000">
        <h1>
            <span>Le prochain </span>
            <span>
                <span class="typing"></span> à
            </span>
        </h1>
        </vue-typed-js>

        <ul class="history">
            <li
            v-for="stop in favoriteStops"
            v-bind:key="stop.codeLieu"
            v-on:click="chooseStop(stop)"
            >
                {{ stop.libelle }}
            </li>
        </ul>

      <div class="input">
        <input
          type="text"
          v-model="queryLibelle"
          v-on:input="input"
          v-on:focus="focus"
          v-on:blur="blur"
          placeholder="Rechercher un arrêt"
        >
        <div class="input--icons">
          <i class="fas fa-street-view" v-on:click="useGeolocation()"></i>
          <i
            class="far fa-star"
            v-on:click="onStarClick()"
            v-if="!Object.keys(favoriteStops).includes(query.codeLieu) && target != null"
          ></i>
          <i
            class="fas fa-star"
            v-on:click="onUnstarClick()"
            v-if="Object.keys(favoriteStops).includes(query.codeLieu) && target != null"
          ></i>
        </div>
      </div>
        <ul class="result-list" v-if="showHistory">
          <li
            v-for="stop in historyStops"
            v-bind:key="stop.stop"
            v-on:click="chooseStop(stop, true)"
            class="result"
            tabindex="0"
          >
            <span>
            <i class="fas fa-history"></i>
            {{ stop.libelle }}
            </span>

            <ul>
              <li v-for="ligne in stop.ligne" v-bind:key="ligne.numLigne">
                {{ ligne.numLigne }}
              </li>
            </ul>

          </li>
        </ul>
        <ul class="result-list" v-if="showLocation">
          <li
            v-for="stop in geolocationResults"
            v-bind:key="stop.stop"
            v-on:click="chooseStop(stop)"
            class="result"
            tabindex="0"
          >
            <span>
            {{ stop.libelle }}
            </span>

            <ul>
              <li v-for="ligne in stop.ligne" v-bind:key="ligne.numLigne">
                {{ ligne.numLigne }}
              </li>
            </ul>

          </li>
        </ul>
        <ul class="result-list">
            <li
            v-for="result in results"
            v-bind:key="result.item.codeLieu"
            v-on:click="chooseStop(result.item)"
            @keydown.enter.prevent="chooseStop(result.item)"
            class="result"
            tabindex="0"
            >
          
            {{ result.item.libelle }}

            <ul>
                <li v-for="ligne in result.item.ligne" v-bind:key="ligne.numLigne">
                    {{ ligne.numLigne }}
                </li>
            </ul>

            </li>
        </ul>
    </section>
</template>

<script>
import Fuse from 'fuse.js'
import Vue from 'vue'

export default {
  name: 'NextBus-Search',
  props: {
  },
  data: function () {
    return {
        query: "",
        queryLibelle: "",
        target: null,
        fuse: null,
        stops: null,
        results: [],
        geolocationResults: [],
        historyStops: {},
        favoriteStops: {},
        showHistory: false,
        showLocation: false
    }
  },
  created() {
    let component = this;

    this.historyStops = this.fetchHistory();
    this.favoriteStops = this.fetchFavorites();

    fetch(process.env.VUE_APP_WEBSERVICE_URL+'/stops').then(function(response){
        return response.text();
    }).then(function(stops){
        component.stops = JSON.parse(stops);

        component.fuse = new Fuse(component.stops, {
            keys: ['libelle'],
            threshold: 0.1
        });
    });



  },
  methods: {
    input: function (event) {
        let query = event.target.value;
        this.target = null;
        this.showHistory = false;
        this.showLocation = false;
        if (query.length > 2 && this.fuse != null) {
            this.results = this.fuse.search(event.target.value);
            this.showHistory = false;
            this.showLocation = false;
        } else if(query.length == 0) {
            this.showHistory = true;
        } else {
            this.results = [];
        }
    },
    chooseStop: function (stop, fromHistory = false) {
        this.target = stop;
        this.query = stop;
        this.queryLibelle = stop.libelle;
        this.results = [];
        this.showHistory = false;
        this.showLocation = false;
        this.$root.$emit('NextBus_Search', stop.codeLieu);

        if(!fromHistory) {
            this.addToHistory({
                codeLieu: stop.codeLieu,
                libelle: stop.libelle,
                ligne: stop.ligne
            });
        }
    },
    focus: function() {
      if(this.queryLibelle === ""){
        this.showHistory = true;
      }
    },
    blur: function() {
    },
    fetchHistory: function() {
        let localData = localStorage.getItem("NEXTBUS_HISTORY");
        return localData != null ? JSON.parse(localData) : {};
    },
    fetchFavorites: function() {
      let localData = localStorage.getItem("NEXTBUS_FAVORITES");
      return localData != null ? JSON.parse(localData) : {};
    },
    addToHistory: function(stop) {

        let stopsArray = Object.values(this.historyStops);
        if(stopsArray.length >= 4 && !Object.keys(this.historyStops).includes(stop.stop)) {
            delete this.historyStops[stopsArray[0].codeLieu]
        }

        this.historyStops[stop.codeLieu] = stop;
        localStorage.setItem("NEXTBUS_HISTORY",JSON.stringify(this.historyStops));
    },
    onStarClick: function () {

      let elem = {};
      elem.codeLieu = this.query.codeLieu
      elem.libelle = this.query.libelle
      elem.ligne = this.query.ligne

      Vue.set(this.favoriteStops, elem.codeLieu, elem);
      localStorage.setItem("NEXTBUS_FAVORITES",JSON.stringify(this.favoriteStops));
    },
    onUnstarClick: function () {
      let elem = {};
      elem.codeLieu = this.query.codeLieu;

      Vue.delete(this.favoriteStops, elem.codeLieu);
      localStorage.setItem("NEXTBUS_FAVORITES",JSON.stringify(this.favoriteStops));
    },
    useGeolocation: function() {
      let self = this;
      navigator.geolocation.getCurrentPosition(function(location) {
        fetch(process.env.VUE_APP_WEBSERVICE_URL+'/stops/'+location.coords.latitude.toString().replace('.',',')+'/'+location.coords.longitude.toString().replace('.',',')).then(function(response){
            return response.text();
        }).then(function(stops){
          self.results = [];
          self.geolocationResults = JSON.parse(stops);
          self.showLocation = true;
        });
      });
    }
  }
}
</script>

<style scoped>
    h1 {
        font-size: 3rem;
        color: #26A65B;
    }
    h1 span {
        font-family: 'manrope bold', sans-serif;
    }

    .input {
      position: relative;
    }

    .input--icons {
      position: absolute;
      right: 14px;
      bottom: -16px;
      font-size: 1.5rem;
      color: #26A65B;
    }

    .input--icons i {
      margin: 0 0 0 .5rem;
    }

    input {
        width: 35rem;
        padding: .8rem;
        font-size: 1em;
        position: relative;
        top: 1.5rem;
        border: .1rem solid #26A65B;
    }

    .result-list {
        padding:0;
        margin:0;

        position: absolute;
        top: calc(100% + 1.5rem);
        background: white;
    }

    .result {
        list-style: none;
        width: 35rem;
        border: .02rem solid gray;
        border-top: 0;
        padding: .8rem;
        text-align: left;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
    }

    .result i {
      color: #26A65B;
      font-size: .9rem;
      margin-right: .2rem;
    }

    .result:hover {
        background:lightgrey;
    }

     .result:hover ul li{
        background:white;
    }

    .result ul li {
        list-style: none;
        padding: 0;
        margin: 0 .2rem;
        background: lightgrey;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 100%;
        text-align: center;
        display: inline-block;
        font-size: .8rem;
        line-height: 1.5rem;
    }

    .search-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        background: white;
    }

    .history {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        width:35rem;
        flex-wrap: wrap;
    }

    .history li {
        background: #26A65B;
        color: white;
        padding: .5rem;
        margin: 0.2rem;
        border-radius: 100rem;
        font-size: .7rem;
        cursor: pointer;
    }


    @media screen and (max-width: 900px) {
        h1 {
            height: 10rem;
            display: flex;
            flex-direction: column;
        }

        input {
            width: 95vw;
        }

        .results, .result, .history {
            width: 95vw;
        }
    }
</style>
