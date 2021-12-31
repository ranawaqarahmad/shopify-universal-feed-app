<template>
  <a-card title="Global Settings" :loading="loading">
    <v-row>
      <v-col cols="12">
        <h3>Tax Settings</h3>
        <v-radio-group v-model="form.tax.show" hide-details>
          <v-radio
            v-for="option in taxOptionsList"
            :key="option.label"
            :label="option.label"
            :value="option.value"
          ></v-radio>
        </v-radio-group>
      </v-col>

      <template v-if="showTaxFields">
        <v-col cols="12" md="6">
          <h3 class="mb-2">
            Tax rate percent (example: if the tax rate is 22%, enter 22)
          </h3>
          <v-text-field
            v-model="form.tax.percentage"
            label="Add Tax Percentage"
            type="number"
            filled
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <h3 class="mb-2">
            Round & format prices to this number of decimal places (default: 2)
          </h3>
          <v-text-field
            v-model="form.tax.decimal_point"
            label="Tax decimal places"
            type="number"
            :max="5"
            :min="0"
            filled
          ></v-text-field>
        </v-col>
      </template>
    </v-row>

    <a-button :loading="loading" @clicked="updateSettings"
      >Update Settings</a-button
    >
  </a-card>
</template>

<script>
import { mapState  , mapMutations} from "vuex";
import { TAX_OPTIONS } from "@/constants";
export default {
  name: "edit-setting",
  data() {
    return {
      loading: false,
      form: {
        tax: {
          show: TAX_OPTIONS.NOT,
          percentage: "",
          decimal_point: "",
        },
      },
    };
  },
  computed: {
    ...mapState(["shop"]),
    showTaxFields() {
      const { show } = this.form.tax;
      return show !== TAX_OPTIONS.NOT;
    },
    taxOptionsList() {
      return [
        {
          label: "Do NOT add tax prices",
          value: TAX_OPTIONS.NOT,
        },
        {
          label: "Do add tax to prices - set tax rate below",
          value: TAX_OPTIONS.ADD,
        },
      ];
    },
  },
  methods: {
      ...mapMutations(['SET_SHOP']),
    async updateSettings() {
      try {
        this.loading = true;
        const resp = await this.axios.post("/shop/global-setting", this.form);
        const { shop } = resp.data;
        this.SET_SHOP(shop)
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
  },
  created() {
    this.form = { ...this.shop.default_options };
  },
};
</script>

<style lang="scss" scoped>
$color: #1d2c38;

h3,
h1 {
  color: $color;
}
</style>
