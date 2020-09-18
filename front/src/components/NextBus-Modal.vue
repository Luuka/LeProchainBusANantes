<template>
    <div class="modal-wrapper">
        <section class="tooltip" v-on:click="openModal()">
        ?
        </section>
        <section class="modal" v-if="isOpen == true">
            <div class="close" v-on:click="closeModal()"><i class="fas fa-times"></i></div>
            <div class="content">
                <h2>Le prochain bus à Nantes</h2>
                <p>Application développée par <a href="https://github.com/Luuka">Lucas Trebouet Voisin</a></p>
                <p>
                Source des données : <a href="https://data.nantesmetropole.fr/explore/dataset/244400404_api-temps-reel-tan/">API TAN</a>
                | Sources de l'application : <a href="">GitHub</a>
                </p>
                <p>Aucune donnée personnelle n'est collectée lors de l'utilisation de cette application</p>
            </div>
        </section>
        <section class="overlay" v-if="isOpen == true" v-on:click="closeModal()"></section>
    </div>
</template>

<script>
export default {
  name: 'NextBus-Modal',
  props: {
  },
  data: function () {
    return {
        isOpen: false
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
      openModal: function() {
          this.isOpen = true;
      },
      closeModal: function() {
          this.isOpen = false;
      }
  }
}
</script>

<style scoped>
.tooltip {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    color: white;
    position: absolute;
    right: 1rem;
    top:1rem;
    z-index: 999;
    text-align: center;
    border-radius: 100%;
    background: rgb(38, 166, 91, .5);
    cursor: pointer;
}

.modal {
    position: absolute;
    width:50%;
    left: 25%;
    top: 25%;
    background: white;
    border: .2rem solid #26A65B;
    z-index: 9999;
}

.close {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    color: white;
    position: absolute;
    right: -1rem;
    top:-1rem;
    border: .1rem solid #26A65B;
    background: white;
    font-family:'manrope bold', sans-serif;
    color: #26A65B;
    font-size:1rem;
    border-radius: 100%;
    cursor: pointer;
}

.close i {
    position: relative;
    top: -.1rem;
}

.overlay {
    position:fixed;
    width:100%;
    height:100%;
    background: rgba(255,255,255,.7);
    z-index:99;
}

@media screen and (max-width: 900px) {
    .modal {
        width:90%;
        left: 5%;
    }
}

</style>
