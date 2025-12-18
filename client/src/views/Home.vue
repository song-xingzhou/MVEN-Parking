<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/mevn.jpg" width="350" />
    <DbStatus />
    <HelloWorld msg="Default Boilerplate Template" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import DbStatus from "@/components/DbStatus.vue";

export default {
  name: "home",
  components: {
    HelloWorld,
    DbStatus,
  },
};
</script>
