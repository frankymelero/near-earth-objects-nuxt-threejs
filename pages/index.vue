<template>
    <div class="starfield-container">
        <Starfield></Starfield>
      <div class="starfield-content">
        <h1>Objetos Próximos a la Tierra</h1>
        <h2 class="sub">Consulta los asteroides rastreados por el programa Sentry de la Nasa</h2>
        <div class="starfield-form">
          <form ref="star-form" @submit.prevent="searchAsteroids" v-if="isComingFromDesPage">
            <input v-model="searchTerm" type="text" name="search" placeholder="Asteroid name...">
            <select v-model="sortBy" name="sortBy">
    
              <option value="date">Sort by discovery date asc</option>
              <option value="dateDesc">Sort by discovery date desc</option>
              <option value="ip">Sort by impact probability asc</option>
              <option value="ipDesc">Sort by impact probability desc</option>
              <option value="pi">Sort by possible impacts asc</option>
              <option value="piDesc">Sort by possible impacts desc</option>
              <option value="diameter">Sort by diameter asc</option>
              <option value="diameterDesc">Sort by diameter desc</option>
              <option value="yearRange">Sort by year range asc</option>
              <option value="yearRangeDesc">Sort by year range desc</option>
              <option value="palermo">Sort by Palermo Scale asc</option> 
              <option value="palermoDesc">Sort by Palermo Scale desc</option> 
  
            </select>
            <select name="sortByPalermo" v-model="palermoFilter">
      <option value="-12">Any Palermo Scale</option>
      <option value="1">Palermo Scale +1</option>
      <option value="0">Palermo Scale 0</option>
      <option value="-1">Palermo Scale -1 or higher</option>
      <option value="-2">Palermo Scale -2 or higher</option>
      <option value="-3">Palermo Scale -3 or higher</option>
      <option value="-4">Palermo Scale -4 or higher</option>
      <option value="-5">Palermo Scale -5 or higher</option>
      <option value="-6">Palermo Scale -6 or higher</option>
      <option value="-7">Palermo Scale -7 or higher</option>
      <option value="-8">Palermo Scale -8 or higher</option>
      <option value="-9">Palermo Scale -9 or higher</option>
      <option value="-10">Palermo Scale -10 or higher</option>
    </select>
           
          </form>
  
        </div>
        <button @click="start" class="btn-intro" v-if="!isComingFromDesPage">Empezar</button>
        <div class="starfield-content-wrapper" v-if="isComingFromDesPage">
          <label for="results-per-page">Resultados por página: </label><select name="results-per-page" class="rpp" v-model="ipp" @change="changeItemsPerPage"><option value="25">25</option><option value="50">50</option><option value="75">75</option><option value="100">100</option></select>
          <div class="starfield-content-scroll">
            <div v-for="asteroid in currentPageAsteroids" :key="asteroid.id">
             <NuxtLink :to="'/'+asteroid.des"> <Asteroid :asteroid="asteroid" class="single-asteroid" /></NuxtLink>
            </div>
          </div>
           <div class="pagination rpp">
      <button @click="previousPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ maxPages }}</span>
      <button @click="nextPage" :disabled="currentPage === maxPages">Siguiente</button>
    </div>
        </div>
      
      </div>
      <Footer></Footer>
    </div>

  </template>
  
  <script setup>
  
  import { ref, onMounted, computed } from 'vue';
  import data from '~/static/data/data.json';

  const isComingFromDesPage = ref(false);
  const shouldRerender = ref(false);
  const searchTerm = ref('');
  const sortBy = ref('yearRange');
  const palermoFilter = ref('-7');
  const currentPage = ref(1);
  const totalAsteroids = ref(0);
  const maxPages = ref(0)
  const ipp = ref(25);

  
  
  const sortOptions = {
    date: 'date',
    dateDesc: 'dateDesc',
    ip: 'ip',
    ipDesc: 'ipDesc',
    diameter: 'diameter',
    diameterDesc: 'diameterDesc',
    palermo: 'palermo',
    palermoDesc: 'palermoDesc',
    pi: 'pi',
    piDesc: 'piDesc',
    yearRange: 'yearRange',
    yearRangeDesc: 'yearRangeDesc',
  };
  
  const asteroids = ref([]);
  const canvasRef = ref(null);
  let scene, camera, renderer, stars, starGeo;
  
  const fetchData = () => {
    asteroids.value = data.data;
    totalAsteroids.value = asteroids.value.length;
  };
  


  onMounted(() => {
    fetchData();
    checkStatus();
    
  });  



  const filteredAsteroids = computed(() => {
    const palermoValue = Number(palermoFilter.value);
    const startIndex = (currentPage.value - 1) * ipp.value;
    const endIndex = startIndex + ipp.value;
  
    let filtered = [...asteroids.value];
  
  
    if (searchTerm.value) {
      filtered = filtered.filter((asteroid) =>
        asteroid.fullname.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    }
  
  // Filtrar por la Escala de Palermo
  if (palermoFilter.value === "Any") {
    filtered = filtered.filter((asteroid) => asteroid.id);
  
    } else {
  
      if (!isNaN(palermoValue)) {
           if (palermoValue >= -9 && palermoValue <=1){
            filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
            filtered.sort((a, b) => b.ps_max - a.ps_max);
           }
        }
      
    }
  
    if (sortBy.value === sortOptions.date) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => new Date(a.des.substring(0, 4)) - new Date(b.des.substring(0, 4)));
    } else if (sortBy.value === sortOptions.dateDesc) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => new Date(b.des.substring(0, 4)) - new Date(a.des.substring(0, 4)));
     } else if (sortBy.value === sortOptions.ip) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => a.ip - b.ip);
    } else if (sortBy.value === sortOptions.ipDesc) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => b.ip - a.ip);
    }  else if (sortBy.value === sortOptions.pi) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => a.n_imp - b.n_imp);
    } else if (sortBy.value === sortOptions.piDesc) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => b.n_imp- a.n_imp);
    }  
    else if (sortBy.value === sortOptions.diameter) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => a.diameter - b.diameter);
    } else if (sortBy.value === sortOptions.diameterDesc) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => b.diameter - a.diameter);
    }else if (sortBy.value === sortOptions.palermo) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => a.ps_max - b.ps_max);
    }else if (sortBy.value === sortOptions.palermoDesc) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => b.ps_max - a.ps_max);
    }else if (sortBy.value === sortOptions.yearRange) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => a.range.substring(0,4) - b.range.substring(0,4));
    }else if (sortBy.value === sortOptions.yearRangeDesc) {
      filtered = filtered.filter(asteroid => asteroid.ps_max >= palermoValue);
      filtered.sort((a, b) => b.range.substring(0,4) - a.range.substring(0,4));
    }
  
    
    return filtered;
    
  });
  
  
  const currentPageAsteroids = computed(() => {
      const totalPages = Math.ceil(filteredAsteroids.value.length / ipp.value);
    maxPages.value = totalPages;
  
    const startIndex = (currentPage.value - 1) * ipp.value;
    const endIndex = startIndex + ipp.value;
    return filteredAsteroids.value.slice(startIndex, endIndex);
  });
  
  
  
  
  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  };
  
  const nextPage = () => {
    const totalPages = Math.ceil(filteredAsteroids.value.length / ipp.value);
    if (currentPage.value < totalPages) {
      currentPage.value += 1;
    }
  };
  
  const start = () => {
    isComingFromDesPage.value = true;

  }
 const checkStatus = () => {
    const storedTimestamp = localStorage.getItem('timestamp');

if (storedTimestamp) {
  const currentTime = Date.now();
  const storedTime = parseInt(storedTimestamp, 10); // Convierte el valor de localStorage a número

  // Calcula la diferencia en segundos entre el tiempo almacenado y el tiempo actual
  const timeDifferenceInSeconds = (currentTime - storedTime) / 1000;

  // Verifica si han pasado 5 segundos o más
  if (timeDifferenceInSeconds >= 5) {
    // Realiza alguna acción aquí

    isComingFromDesPage.value = false;
  } else {

    let localvalues = localStorage.getItem('lastValues').toString();
let vals = localvalues.split('/');
   isComingFromDesPage.value = true;
    sortBy.value = vals[1].trim();
    palermoFilter.value =  vals[2].trim();
  
   
  }
} else {
//No se encontró timestamp en el ls
}
 }
 watch(
  [isComingFromDesPage, shouldRerender, searchTerm, sortBy, palermoFilter, currentPage, totalAsteroids, maxPages, ipp],
  (newValues, prevValues) => {
    
    localStorage.setItem('lastValues', `${isComingFromDesPage.value} / ${sortBy.value} / ${palermoFilter.value} / ${currentPage.value} / ${totalAsteroids.value} / ${maxPages.value} / ${ipp.value}`);

    // Puedes realizar acciones adicionales aquí en respuesta a los cambios en los refs
  }
);


  </script>
  
  <style>
  body {
    margin: 0; 
    overflow: hidden; 
    font-family: helvetica, Verdana;
  }
  
  .starfield-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden; 
    margin: 0;
    background: black;
  }
  
  .starfield-content {
    color: white;
    position: relative;
    z-index: 1;
    text-align: center;
    line-height: 0.4;
    margin-top: -8vh;
  }
  
  h1{
    font-size: 80px;
      font-family: math;
  }
  h2.sub{
    font-size: 25px;
    margin-bottom: 6vh;
  }
  
  .starfield-content-wrapper{
    width: 90vw;
    background-color: rgba(255,255,255,0.5);
    height: 58vh;
    margin-top:4vh;
    border: 1px solid white;
    border-radius: 25px;
    overflow: hidden;
  }.starfield-content-scroll{
    overflow-y: scroll;
    height: 50vh;
  margin-top: 1vh;
  
  }
  .rpp{
    margin-top: 1vh;
    margin-bottom: -2vh;
    height: 20px;
  }
 
  .btn-intro{
    width: 200px;
    height: 50px;
    border-radius: 40px;
    margin-top: 3vh;
    background-color: rgba(255,255,255,0.5);
    color: black;
    border: 1px solid white;
    cursor: pointer;
    transition: 0.2s;
    font-size: 23px;
    font-weight: bolder;
  }
  .btn-intro:hover{
    background-color:  rgba(255,255,255,0.6);
    transition: 0.2s;
  }
  .display-animation{
    animation: fade-in 0.5s forwards;
  }
  ::-webkit-scrollbar {
    width: 8px; 
    height: calc(100%-10vh);
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: white; 
    border-radius: 4px; 
  }
  
  ::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0,0,0,0.6);
    border-radius: 4px;
  }
  a{
    color: white;
    text-decoration: none;
  }
  .single-asteroid:hover{
  background-color:  rgba(0,0,0,0.2);
  transition: 0.2s;
  }
  .single-asteroid{
    transition: 0.2s;
  }
  input[type=text]{
    height: 28px;
  }
  select{
    height: 34px;

  }
  </style>
  