<template>
    <Starfield></Starfield>
    <section class="description-content">
    <p>Product detail {{ des }} </p><br>  
    
    <button @click="goBack">Tira patrás</button>
    </section>
</template>

<script setup>
const { des } = useRoute().params
const router = useRouter();

const asteroidData = ref([]);


const goBack = () => {
const date = Date.now()
localStorage.setItem('isComingFromOtherPage', true);
localStorage.setItem('timestamp', date);
router.push('/');
};

const getData = async () => {
try{
const response = await fetch(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${des}`);
const data = await response.json();
asteroidData.value = data;
console.log(asteroidData);
}catch (error){
console.log("Error:", error);
}
}




onMounted(() => {
    localStorage.setItem('isComingFromOtherPage', false); 
    getData(); 
  });  
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

</style>