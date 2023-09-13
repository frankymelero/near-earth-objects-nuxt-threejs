<template>
    <div class="asteroid">
        <h2 class="fullname">{{ asteroid.fullname }}</h2>
        <div class="asteroid-img"><img :src="asteroidImageUrl" :alt="asteroid.fullname"></div>
        
        <div class="asteroid-description">

      <table>
        <tr>
            <td><b class="item">Diametro</b> <br>{{ asteroid.diameter }} km</td>
      <td><b class="item">Rango de años</b> <br>{{ asteroid.range }}</td>
      <td><b class="item">Velocidad inf</b><br> {{ asteroid.v_inf }}</td>
      <td><b class="item">Probab. impacto<br></b> {{ asteroid.ip }}</td>
        </tr>
        <tr class="second-row">
            <td><b class="item">Magnitud<br></b> {{ asteroid.h }}</td>
      <td><b class="item">Posibles impactos <br></b>{{ asteroid.n_imp }}</td>
      <td><b class="item">Escala de palermo<br></b> {{ asteroid.ps_max }}</td>
      <td><b class="item">Escala de torino<br> </b>{{ asteroid.ts_max }}</td>
        </tr>

      </table>


    </div>
</div>
  </template>
  
  <script setup>
 import { defineProps, computed } from 'vue';
 

  const props = defineProps({
    asteroid: Object
  });
  
  const diametro = {
    diameter: props.asteroid.diameter
  }
  
  function calculateImage(diametroAsteroide){
    let imagenUrl;
  if(diametroAsteroide >= 0.5){
    imagenUrl = "_nuxt/public/assets/img/asteroid2.png"
  } else if (diametroAsteroide < 0.5 && diametroAsteroide >= 0.01){
    imagenUrl = "_nuxt/public/assets/img/asteroid3.png"
  } else if (diametroAsteroide < 0.01 && diametroAsteroide >=0.005){
    imagenUrl = "_nuxt/public/assets/img/asteroid1.png"
  }else{
    imagenUrl = "_nuxt/public/assets/img/asteroid4.png"
  }

  return imagenUrl;
  }


const asteroidImageUrl = computed(() => {

   return calculateImage(diametro.diameter);

});

  </script>

<style scoped>

.asteroid{
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:0px;
    border-bottom: 2px solid white;
    flex-wrap: wrap;
    padding: 2vh;

}
.asteroid-img{
    width: 20%;
}
.asteroid-description{
    width: 80%;
    line-height: 1.5 !important;
    
}
.asteroid-img > img{
   width: 90%;
    position: relative;
    left: 20px;
}
b.item{
    font-size: 30px !important;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
}

h2.fullname{
    font-size: 41px !important;
    margin-top: 0vh;
    margin-bottom: -3vh;
    width: 100%;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
}
th,td{
    width: 26%;
    height: 5vh;
    font-size:25px;
}


tr{
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 70vw;
}

.second-row{
    margin-top: 25px;
}

</style>