<template>
  <v-card
    :color="color"
    :loading="loading ? 'primary' : ''"
    :height="height"
    class="mb-5"
  >
    <v-card-text :style="`height:${height};`">
      <slot name="title">
        <h2 class="card-title" v-if="title">{{ title }}</h2>
      </slot>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "app-card",
  props: {
    title: { type: String, default: "" },
    elevation: { type: Number, default: 0 },
    color: { type: String, default: "#fff" },
    loading: { type: Boolean, default: false },
    height: { type: String, default: "auto" },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  color: #1d2c38;
  opacity: 1;
  font-size: 24px;
  margin-bottom: 1rem;
}
</style>
