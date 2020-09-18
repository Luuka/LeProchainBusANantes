<template>
    <div class="results-wrapper">
        <p v-if="isLoading && times.length == 0"><i class="fas fa-spinner"></i></p>

        <ul class="filter-lines">
            <li 
            v-for="line in lines"
            v-bind:key="line"
            v-bind:class="[filteredLines.includes(line) ? 'filter-enabled' : 'filter-disabled']"
            v-on:click="toggleFilter(line)"
            class="filter-line">{{ line }}</li>
        </ul>
        <ul class="results">
            <li class="result" 
            v-for="time in filteredTimes" 
            v-bind:key="time.temps+time.arret.codeArret+time.ligne.numLigne"
            >
                <div class="line">
                    <p>{{ time.ligne.numLigne }} - {{ time.terminus }}</p> 
                    <div class="time"> 
                        <p v-if="time.dernierDepart == true" class="lastDeparture">Dernier départ</p>
                        <p>{{ time.temps }}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'NextBus-Search',
  props: {
  },
  data: function () {
    return {
        stop: null,
        times: [],
        lines: [],
        filteredLines: [],
        isFiltered: false,
        isLoading: false
    }
  },
  computed: {
    filteredTimes: function () {
      let component = this;
      return this.times.filter(function (time) {

          if(component.filteredLines.length == 0){
              return true;
          }

        return component.filteredLines.includes(time.ligne.numLigne)
      })
    }
  },
  created() {
    let component = this;
    this.$root.$on('NextBus_Search', (stop) => {
        this.stop = stop;
        this.times = [];
        this.lines = [];
        this.filteredLines = [];
        this.isFiltered = false;
        this.fetchTime(stop);
    });

    setInterval(function(){
        component.fetchTime(component.stop);
    }, 60000);
  },
  methods: {
      fetchTime: function(stop) {
          if(stop == null) {
              return;
          }

        let component = this;
        this.isLoading = true;
        fetch(process.env.VUE_APP_WEBSERVICE_URL+'/stop/'+stop).then(function(response){
            return response.text();
        }).then(function(times){
            component.isLoading = false;
            component.times = JSON.parse(times); 
            
            let lines = [];
            component.times.forEach((time) => {
                lines.push(time.ligne.numLigne);
            });
            component.lines = [...new Set(lines)];
            if(!component.isFiltered) {
                component.filteredLines = []// [...new Set(lines)]
                component.isFiltered = true;
            }
        });  
      },
      toggleFilter: function(line) {
          if (this.filteredLines.includes(line)){
              let id = this.filteredLines.indexOf(line);
              this.filteredLines.splice(id, 1);
          } else {
              this.filteredLines.push(line);
          }
      }
  }
}
</script>

<style scoped>

    .filter-lines {
        list-style: none;
        margin: 0;
        padding: 0;
        width: 35rem;
        display: flex;
        flex-direction: row;
        text-align:left;
    }

    .filter-line {
        border-radius: 15%;
        border: .05rem solid lightgray;
        padding: 0.1rem 0.5rem;
        margin: 0 .5rem 0 0;
        background: #26A65B;
        color: white;
        border-radius: 100rem;
    }

    .results-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 2rem;
    }
    
    .results-wrapper > p {
        color: white;
    }

    .results, .result{
        list-style: none;
        padding: 0;
        margin: 0;       
    }

    .results {
        width: 35rem;
        display: flex;
        flex-direction: column;
    }

    .result {
        border: .02rem solid lightgray;
        padding: .6rem;
        margin: .5rem 0;
        background: white;
        border-radius: .3rem;
    }

    .result .line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .result .line p {
        margin: 0;
    }

    .time {
        text-align: right;
    }

    .lastDeparture {
        text-align: right;
        margin: 0;
        padding: 0;
        font-size: .7rem;   
    }

    .filter-enabled {
        background: white;
        color: black;
    }

    .filter-disabled {}

    .fa-spinner{
        animation: spin 2s linear infinite;
        font-size: 3rem;
        position: relative;
        top: 20vh;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media screen and (max-width: 900px) {
        .results {
            width: 100vw;
        }

        .result {
            width: calc(100vw - 1rem);
            margin: .5rem .5rem;
        }

        .filter-lines {
            max-width: 100vw;
            flex-wrap: wrap;
            justify-content:center;
        }

        .filter-line {
            margin-bottom: .5rem;
        }
    }
</style>
