<template>
    <Starfield></Starfield>
    <section class="description-content">
    <p>OCT: {{ des }} </p><br>
    <p v-if="!showData">Cargando datos...</p>
<div v-else>
    <div class="asteroid-data-content">
        <div class="asteroid-summary-data">
Des: {{ asteroidSummary.des }}
{{ asteroidSummary.v_imp }}
        </div>
        <div class="asteroid-possible-impacts-data">

        </div>

    </div>
</div>

    <button @click="goBack">Tira patrás</button>
    </section>
</template> 

<script setup>
const { des } = useRoute().params
const router = useRouter();
let asteroidSummary = {};

const asteroidData = ref([]);
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
    const response = await fetch(`http://127.0.0.1:3001/?des=${encodedDes}`);
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

  asteroidData.value = asteroidSummary;
  showData.value = true;
  }
</script>

<style scoped>

  body {
    margin: 0; 
    overflow: hidden; 
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
    width: 90vw;
    background-color: green;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 20vh;
}

</style>