<template>
  <v-app>
    <loader :loading="loading.app_loading" height="100%" size="100">
      <router-view />
    </loader>
    <notifications group="global-notification" animation-type="velocity" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "App",

  data: () => ({
    //
  }),
  computed:{
    ...mapState(['loading' ])
  }
};
</script>
