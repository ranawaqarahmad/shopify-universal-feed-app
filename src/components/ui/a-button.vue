<template>
  <v-btn
    :color="color"
    :loading="loading"
    :disabled="disabled || loading"
    :elevation="elevation"
    :to="to"
    :block="block"
    :dark="dark"
    :x-large="xLarge"
    :large="large"
    :small="small"
    :x-small="xSmall"
    class="ma-3"
    @click="$emit('clicked')"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: "a-button",
  props: {
    color: { type: String, default: "primary" },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    elevation: { type: Number, default: 0 },
    to:{ default:undefined},
    block:{type:Boolean,default:false},
    dark:{type:Boolean,default:false},
    xLarge: { type: Boolean, default: true },
    large:{type:Boolean , default:false},
    small:{type:Boolean , default:false},
    xSmall:{type:Boolean , default:false},
  },

};
</script>

<style lang="scss">

</style>
