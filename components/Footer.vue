<script setup>
const year = new Date().getFullYear();

</script>

<template>
    <section class="footer">
      {{ year }}  Desarrollado por  <a href="https://github.com/frankymelero" target="_blank"> Franky Melero</a>
    </section>
</template>

<style scoped>

.footer{
    position: absolute;
    bottom: 1.5vh;
    width: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}
.footer > a{
    text-decoration: none;
    color: white;
    margin-left:4px;
    margin-right:4px;
    font-size: large;
}

@media (max-width: 1200px){
.footer{
    bottom: 8vh;
}
}
</style>