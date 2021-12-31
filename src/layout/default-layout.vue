<template>
  <v-main>
      <AppHeader />
    <v-container>
      <router-view></router-view>
    </v-container>
  </v-main>
</template>

<script>
import { mapState } from "vuex";
import AppHeader from './components/header.vue'
export default {
  name: "default-layout",
  components:{AppHeader},
  computed: {
    ...mapState(["shop"]),
  },
};
</script>

<style lang="scss" scoped></style>
