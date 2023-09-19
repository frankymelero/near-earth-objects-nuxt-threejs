<template>
    <Starfield></Starfield>
    <section class="description-content">
    <h1>Objeto próximo a la tierra: {{ des }} </h1><br>
    <button @click="goBack" class="btn-back">Volver</button>
    <p v-if="!showData">Cargando datos...</p>
<div v-else>
    <div class="asteroid-data-content">
        <div class="asteroid-summary-data">
<div class="singleinfo"><p class="celda bolder">Escala de Torino </p><p class="celda">{{ asteroidSummary.ts_max }}</p></div>
<div class="singleinfo"><p class="celda bolder">Escala de Palermo (cumulativa) </p><p class="celda">{{ asteroidSummary.ps_cum }}</p></div>
<div class="singleinfo"><p class="celda bolder ">Escala de Palermo <br>  (max)</p><p class="celda">{{ asteroidSummary.ps_max }}</p></div>
<div class="singleinfo"><p class="celda bolder">Probabilidad de impacto (cum.)</p><p class="celda">{{ asteroidSummary.ip }}</p></div>
<div class="singleinfo"><p class="celda bolder">Última observación</p><p class="celda">{{ asteroidSummary.last_obs }}</p></div>
<div class="singleinfo"><p class="celda bolder">Método de localización</p><p class="celda">{{ asteroidSummary.method }}</p></div>
<div class="singleinfo"><p class="celda bolder">Velocidad de impacto (km/s)</p><p class="celda ultima">{{ asteroidSummary.v_imp }}</p> </div>
<div class="singleinfo"><p class="celda bolder">Velocidad del infinito (km/s)</p><p class="celda ultima">{{ asteroidSummary.v_inf }}</p></div>
<div class="singleinfo"><p class="celda bolder">Diametro <br>(km)</p><p class="celda ultima">{{ asteroidSummary.diameter }}</p></div>
<div class="singleinfo"><p class="celda bolder">Masa <br>(kg)</p><p class="celda ultima">{{ asteroidSummary.mass }}</p></div>
<div class="singleinfo"><p class="celda bolder">Energía <br>(Mt)</p><p class="celda ultima">{{ asteroidSummary.energy }}</p></div>
<div class="singleinfo"><p class="celda bolder">Próxima aproximación<br>estimada</p><p class="celda ultima">{{ asteroidImpacts[0].date.substring(0,10) }}</p></div>

        </div>
   
      </div>
      <h2>Posibles impactos: {{ asteroidImpacts.length }}</h2>
      <div class="asteroid-wrapper">
  
      <div class="asteroid-impacts-data">
       <div class="table-container">
        <table>
            <th>Fecha</th>
            <th>Sigma VI</th>
            <th>Probabilidad de impacto</th>
            <th>Energia del impacto (Mt)</th>
            <th>Escala de Palermo</th>
            <th>Escala de Turín</th>
   

        <tr v-for="(impact, index) in asteroidImpacts" :key="index" class="impact-asteroid">
          <td>{{ impact.date.substring(0,10) }}</td>
          <td>{{ impact.sigma_vi}}</td>
          <td>{{ impact.ip}}</td>
          <td>{{ impact.energy}}</td>
          <td>{{ impact.ps }}</td>
          <td>{{ impact.ts }}</td>
          

          <!-- Agrega otros campos de impacto que desees mostrar -->
        </tr>
        </table>
      </div>
        <Footer></Footer>
    </div>

</div>

</div>

    
    </section>
</template> 

<script setup>

const { des } = useRoute().params
const router = useRouter();
let asteroidSummary = {};
let asteroidImpacts = [];
const showData = ref(false);

const goBack = () => {
const date = Date.now()
localStorage.setItem('isComingFromOtherPage', true);
localStorage.setItem('timestamp', date);
router.push('/');
};

const getData = async () => {
try{
    const encodedDes = encodeURIComponent(des);
    console.log('Solicitando datos para', encodedDes); // Agrega este registro
    const response = await fetch(`https://proxy-express-deploy.vercel.app/?des=${encodedDes}`);
    console.log('Respuesta recibida:', response); // Agrega este registro
    const data = await response.json();
    
    await processData(data);
   
}catch (error){
console.log("Error:", error);
}
}


onMounted(() => {  
    localStorage.setItem('isComingFromOtherPage', false); 
    getData();
  });  
  const sortImpactsByDate = () => {
  asteroidImpacts.sort((a, b) => {
    // Divide las fechas en componentes
    const [yearA, monthA, dayA] = a.date.split('-').map(Number);
    const [yearB, monthB, dayB] = b.date.split('-').map(Number);
    // Compara primero por años
    if (yearA !== yearB) {
      return yearA - yearB;
    }
    // Si los años son iguales, compara por meses
    if (monthA !== monthB) {
      return monthA - monthB;
    }
    // Si los años y los meses son iguales, compara por días
    return dayA - dayB;
  });
};
const parseDate = (dateString) => {
  // Divide la cadena en partes por el carácter "-"
  const parts = dateString.split('-');

  // Verifica si hay una parte decimal en la última parte
  const lastPart = parts[parts.length - 1].split('.');

  // Si hay una parte decimal, solo toma la parte entera
  const formattedDate = lastPart.length > 1 ? lastPart[0] : parts[parts.length - 1];

  // Retorna la fecha en el formato "YYYY-MM-DD"
  return formattedDate;
};

  const processData = async (data) => {

    asteroidSummary = {
    date: data.summary.date,
    last_obs: data.summary.last_obs,
    mass: data.summary.mass,
    nsat: data.summary.nsat,
    method: data.summary.method,
    cdate: data.summary.cdate,
    nobs: data.summary.nobs,
    first_obs: data.summary.first_obs,
    ndop: data.summary.ndop,
    diameter: data.summary.diameter,
    darc: data.summary.darc,
    ps_max: data.summary.ps_max,
    h: data.summary.h,
    ip:data.summary.ip,
    ndel: data.summary.ndel,
    des: data.summary.des,
    n_imp: data.summary.n_imp,
    v_inf: data.summary.v_inf,
    fullname: data.summary.fullname,
    v_imp: data.summary.v_imp,
    ps_cum: data.summary.ps_cum,
    ts_max: data.summary.ts_max,
    energy: data.summary.energy
    
  };

  asteroidImpacts = data.data;

  sortImpactsByDate();

  showData.value = true;
  }
</script>

<style scoped>

  body {
    margin: 0; 
    overflow: hidden; 
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    background-color: black;
  }
  
.description-content{
    overflow: hidden;
width: 100vw;
height: 100vh;
position: relative;
z-index: 1;
display: flex;
justify-content: center;
align-items: center;
color: white;
flex-direction: column;
}
.asteroid-data-content{
  
    background-color: rgba(255,255,255,0.5);
    color: white;

}
.asteroid-impacts-data{
    display:flex;
    justify-content: center;
    align-items: center;
}
td{
    height: 40px;
    min-width: 200px;
    border: 2px white solid;
    text-align: center;
}
th{
  padding: 1.5vh 1.5vw;
}
table{
    border-collapse: collapse;
    font-family: Helvetica, sans-serif;
    
}
th:nth-child(0){
  display: flex;
  justify-content: center;
  align-items: center;
}
h2{text-align: center;}
h1{
  margin-top: -3vh;
  font-size: 40px;
  margin-bottom: 6vh;
}

.btn-back{
    margin-top: -7vh;
    margin-bottom: 3vh;
    width: 200px;
    height: 40px;
    font-size: 25px;
    border: 2px solid white;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgba(255,255,255,0.6);
    color: black;
    transition: 0.2s;
}
.btn-back:hover{
    transition: 0.2s;
    background-color: rgba(255,255,255,0.7);
}
.asteroid-summary-data{
  display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap;

}
.singleinfo{
  width: 15vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size:25px;
}

.bolder{
  
  font-size: 25px;
  text-shadow: 1px 2px 2px rgba(0,0,0,0.5);
 
} 
.asteroid-wrapper{
  
  max-height: 30vh;
  overflow-x: hidden;
  
}

.ultima{
  padding-bottom:0vh;
}
p.celda{
text-align: center;
}
@media (max-width: 1200px){
.bolder{
  font-size: 13px;
}
p.celda{
  font-size:15px;
}

h1{
  font-size: 31px;
  text-align: center;
  margin-top: -10vh;
  
}
h2{
  font-size: 18px;
}
.asteroid-wrapper{
  max-height: 17vh;
}
.asteroid-data-content{
  overflow-x: scroll;
}
.asteroid-summary-data {
    display: flex;
  width: 200%;

  }
  .asteroid-summary-container {
    width: 100%; /* Asegúrate de que el contenedor ocupe todo el ancho disponible */
    overflow-x: auto; /* Cambiamos de 'hidden' a 'auto' */
  }

  .singleinfo {
    width: 33vw;
    flex-shrink: 0; /* Evita que los elementos se reduzcan más allá de 33vw */
  }
tr > td{
min-width: unset;
}
th{
  font-size: 10px;
}
table{
  margin-top: -1vh;
}
}
</style>  