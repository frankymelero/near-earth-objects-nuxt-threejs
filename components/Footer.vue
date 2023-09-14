<script setup>
const year = new Date().getFullYear();

</script>

<template>
    <section class="footer">
      {{ year }}  Developed by  <a href="https://github.com/frankymelero" target="_blank"> Franky Melero</a> | Data source: NASA's Sentry
    </section>
</template>

<style scoped>

.footer{
    position: absolute;
    bottom: 3vh;
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
</style>