<template>
  <header class="mb-5 mt-10">
    <v-container >
      <div class="d-flex align-items-center justify-content-between">
        <div class="logo d-flex align-items-center cursor-pointer" @click="$router.push('/')">
          <v-img
            max-height="100px"
            max-width="100px"
            center
            contain
            src="@/assets/logo.png"
          ></v-img>

          <div class="app-title">
            <h1>Awesome Feed App</h1>
            <p class="subtitle-sm">by Awesome store</p>
          </div>
        </div>
        <div class="btn-list">
          <a-button
            v-for="btn in btnList"
            :key="btn.label"
            :to="btn.to"
            :disabled="btn.disabled"
          >
            {{ btn.label }}
          </a-button>
        </div>
      </div>
    </v-container>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "app-header",
  components: {
    ...mapState(['shop'])
  },
  data() {
    return {};
  },
  computed: {
    btnList() {
      return [
        {
          label: "Change Plan",
          to: "/plans",
        },
        {
          label: "Add a product feed",
          to: "/create-feed",
        },
        {
          label: "Edit Settings",
          to: "/edit-setting",
        },
        {
          label: "Edit Google",
          to: '/edit-google',
        },
      ];
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
h1 {
  letter-spacing: 0px;
  color: #1d2c38;
  font-size: 18px;
}


</style>
