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
            v-for="stop in historyStops" 
            v-bind:key="stop.stop"
            v-on:click="chooseStop(stop.stop, stop.stopName, true)"
            >
                {{ stop.stopName }}
            </li>
        </ul>

        <input 
        type="text"
        v-model="query"
        v-on:input="input"
        v-on:focus="input"
        v-on:blur="blur"
        placeholder="Rechercher un arrêt"
        >
        <ul class="result-list">
            <li 
            v-for="result in results" 
            v-bind:key="result.item.codeLieu"
            v-on:click="chooseStop(result.item.codeLieu, result.item.libelle)"
            @keydown.enter.prevent="chooseStop(result.item.codeLieu, result.item.libelle)"
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

export default {
  name: 'NextBus-Search',
  props: {
  },
  data: function () {
    return {
        query: "",
        fuse: null,
        stops: null,
        results: [],
        historyStops: {}
    }
  },
  created() {
    let component = this;

    this.historyStops = this.fetchHistory();

    console.log()

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

        if (query.length > 2 && this.fuse != null) {
            this.results = this.fuse.search(event.target.value);
        } else {
            this. results = [];
        }
    },
    chooseStop: function (stop, stopName, fromHistory = false) {
        this.query = stopName;
        this.results = [];
        this.$root.$emit('NextBus_Search', stop);

        if(!fromHistory) {
            this.addToHistory({
                stop: stop,
                stopName: stopName        
            });
        }
    },
    blur: function() {
        //this.results = [];
    },
    fetchHistory: function() {
        let localData = localStorage.getItem("NEXTBUS_HISTORY");
        return localData != null ? JSON.parse(localData) : {};
    },
    addToHistory: function(stop) {

        let stopsArray = Object.values(this.historyStops);
        if(stopsArray.length >= 4 && !Object.keys(this.historyStops).includes(stop.stop)) {
            delete this.historyStops[stopsArray[0].stop]
        }

        this.historyStops[stop.stop] = stop;
        localStorage.setItem("NEXTBUS_HISTORY",JSON.stringify(this.historyStops));
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
