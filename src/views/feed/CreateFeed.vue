<template>
  <loader :loading="pageLoading">
    <a-card
      :title="`${$route.params.id ? 'Edit' : 'Add'} a product feed`"
      :loading="loading.collection_loading"
    >
      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Product Feed Name"
                filled
                v-model="form.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.store_currency"
                :items="currencies"
                :loading="loading.collection_loading"
                label="Currency"
                filled
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3>Append currency parameter to product URL?</h3>
              <v-radio-group v-model="form.append_currency">
                <v-radio
                  label="Do Not append. (default, example: my-store.com/products/my-product)"
                  :value="false"
                ></v-radio>
                <v-radio
                  label="Do append. (example: my-store.com/products/my-product?currency=USD)"
                  :value="true"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3>All products or some of them?</h3>
              <v-radio-group v-model="form.all_products">
                <v-radio label="All products" :value="true"></v-radio>
                <v-radio
                  label="Products from selected collection"
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-expand-transition>
            <v-row v-if="!form.all_products">
              <v-col cols="12">
                <h3 class="mb-2">Choose Collections</h3>
                <v-autocomplete
                  v-model="form.collections"
                  :items="collections"
                  :loading="loading.collection_loading"
                  label="Collections"
                  item-value="id"
                  item-text="title"
                  chips
                  filled
                  multiple
                  clearable
                  deletable-chips
                  hide-details
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-expand-transition>

          <v-row>
            <v-col cols="12" md="6">
              <h3>Export mode</h3>
              <v-radio-group v-model="form.export_all_variant">
                <v-radio
                  label="Export all variants of a product"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="Export only one variant of a product"
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-col>

            <v-expand-transition>
              <v-col v-if="!form.export_all_variant" cols="12" md="6">
                <h3>Export single variant as:</h3>
                <v-radio-group v-model="form.only_first_variant">
                  <v-radio
                    label="Export first variant of a product (default)"
                    :value="true"
                  ></v-radio>
                  <v-radio
                    label="Export first available for order variant of a product"
                    :value="false"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-expand-transition>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3>Use "Compare at" price:</h3>
              <v-radio-group v-model="form.both_compare_price">
                <v-radio
                  label="Use both 'Compare at price and price' if they exist (default)"
                  :value="true"
                ></v-radio>
                <v-radio
                  label="Don't use 'Compare at' price - only the price field from Shopify will be used in the field"
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3>Product and variant images</h3>
              <v-radio-group v-model="form.use_product_image">
                <v-radio
                  label="Use variant's image if it exists and fallback to using product's image"
                  :value="false"
                ></v-radio>
                <v-radio
                  label="Always use product's image (and never use variant's image)"
                  :value="true"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3>Custom Labels</h3>
            </v-col>
            <v-col cols="12" md="6" v-for="n in 4" :key="n">
              <v-select
                v-model="form.custom_labels[n - 1]"
                :key="form.custom_labels[n - 1]"
                :label="`Custom Label ${n}`"
                :items="customLabelsList"
                placeholder="Empty"
                item-value="value"
                item-text="label"
                filled
                hide-details
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3 class="mb-2">Featured collection on custom labels</h3>
              <v-autocomplete
                v-model="form.featured_collections"
                :items="collections"
                :loading="loading.collection_loading"
                label="Featured Collections"
                item-value="id"
                item-text="title"
                chips
                filled
                multiple
                clearable
                deletable-chips
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3 class="mb-2">Featured Product tags on custom labels <span class="sm" style="font-weight:400;font-size:12px">(press enter after you type the tag)</span> </h3>
              <v-text-field
                v-model="featuredTag"
                @keydown.enter="addFeaturedTag"
                label="Enter Featured Product tag"
                single-line
                filled
              ></v-text-field>
              <div
                class="chips-container"
                v-if="form.featured_product_tags.length"
              >
                <v-chip
                  v-for="(chip, index) in form.featured_product_tags"
                  :key="chip"
                  class="ma-2"
                  close
                  @click:close="form.featured_product_tags.splice(index, 1)"
                >
                  {{ chip }}
                </v-chip>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3>Variant Title</h3>
              <p class="subtitle-2">
                Example: you sell t-shirts with two color options, red and
                white, and two sizes , S and M
              </p>
              <v-radio-group v-model="form.variant_title">
                <v-radio
                  v-for="option in variantTitleOptionList"
                  :key="option.label"
                  :label="option.label"
                  :value="option.value"
                ></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="12">
              <h3>Custom text to append</h3>
              <v-text-field
                v-model="form.custom_text"
                label="Custom text"
                hide-details
                filled
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <h3>
                Exclude options (such as size) from the generated variant titles
                (above).
              </h3>
              <v-text-field
                label="Text to exclude"
                v-model="form.exclude_text"
                filled
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <h3>Shipping Label (applies to all products feed)</h3>
              <v-text-field
                label="Shipping Label"
                v-model="form.shipping_label"
                filled
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <h3>Add tax to all prices - override global Settings</h3>
              <v-radio-group v-model="form.tax.show" hide-details>
                <v-radio
                  v-for="option in taxOptionsList"
                  :key="option.label"
                  :label="option.label"
                  :value="option.value"
                ></v-radio>
              </v-radio-group>
            </v-col>

            <template v-if="showTaxOptions">
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
                  Round & format prices to this number of decimal places
                  (default: 2)
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
        </v-col>
        <v-col cols="12" md="3">
          <a-card>
            <a-card color="#F5F5F5" class="text-center">
              <template v-slot:title>
                <h1 class="card-title mb-5">
                  <v-icon color="warning">mdi-star</v-icon> Quick Tip 1
                </h1>
              </template>
              <p class="subtitle-sm">
                If you can’t see all of your collections
              </p>
              <a-button
                color="blue"
                @clicked="FETCH_COLLECTIONS_SHOP"
                :dark="!loading.collection_loading"
                :loading="loading.collection_loading"
                >Refresh Them now</a-button
              >
              <p class="subtitle-sm">
                Please note this may take a min or two. thanks
              </p>
            </a-card>
          </a-card>

          <a-card>
            <a-card color="#F5F5F5" class="text-center">
              <template v-slot:title>
                <h1 class="card-title mb-5">
                  <v-icon color="warning">mdi-star</v-icon> Quick Tip 2
                </h1>
              </template>
              <p class="subtitle-sm">
                Facebook poses a 100 chars limit on the length of custom labels,
                which mean some custom lables will get truncated. Featured
                collections allow you to specify collections which will alwate
                be included in the custom label.
              </p>
            </a-card>
          </a-card>
        </v-col>
      </v-row>

      <a-button
        @clicked="validateAndCreateFeed"
        :disabled="isBtnDisabled"
        :loading="btnLoading"
      >
        {{ btnLabel }}
      </a-button>
    </a-card>
  </loader>
</template>

<script>
import { CUSTOM_LABELS, TITLE_OPTIONS, TAX_OPTIONS } from "@/constants";
import { mapState, mapActions } from "vuex";
export default {
  name: "create-edit-feed",
  data() {
    return {
      featuredTag: "",
      btnLoading: false,
      pageLoading: false,
      form: {
        name: "",
        store_currency: null,
        append_currency: false,
        all_products: true,
        collections: [],
        export_all_variant: true,
        only_first_variant: true,
        both_compare_price: true,
        use_product_image: false,
        custom_labels: [],
        featured_collections: [],
        featured_product_tags: [],
        variant_title: TITLE_OPTIONS.DEFAULT,
        custom_text: "",
        exclude_text: "",
        shipping_label: "",
        tax: {
          show: TAX_OPTIONS.GLOBAL,
          percentage: 0,
          decimal_point: 2,
        },
      },
    };
  },
  computed: {
    ...mapState(["loading", "shopify_shop", "collections", "shop"]),
    btnLabel() {
      return this.$route.params.id ? "Edit Feed" : "Create Feed";
    },
    showTaxOptions() {
      const { show } = this.form.tax;
      const { tax } = this.shop.default_options;
      if (show === TAX_OPTIONS.NOT) return false;
      if (show === TAX_OPTIONS.GLOBAL) {
        if (tax.show === TAX_OPTIONS.NOT) return false;
      }
      return true;
    },
    isBtnDisabled() {
      const { name, store_currency } = this.form;
      return !name || !store_currency;
    },
    currencies() {
      if (!this.shopify_shop) return [];
      const { enabled_presentment_currencies } = this.shopify_shop;
      return enabled_presentment_currencies;
    },
    taxOptionsList() {
      return [
        {
          label: "Use Global Settings (default)",
          value: TAX_OPTIONS.GLOBAL,
        },
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
    variantTitleOptionList() {
      return [
        {
          label:
            'Do NOT append (default) - all t-shirts would be exported as "t-shirt"',
          value: TITLE_OPTIONS.DEFAULT,
        },
        {
          label: `Append variant's title - t-shirt title would be exported as "t-shirt [variant title from Shopify admin]"`,
          value: TITLE_OPTIONS.APPEND,
        },
        {
          label: `Prepend variant's title - t-shirt title would be exported as "[variant title from Shopify admin] t-shirt"`,
          value: TITLE_OPTIONS.PREPEND,
        },
        {
          label:
            'Append options - t-shirt title would be exported as "t-shirt red S" and "t-shirt white M"',
          value: TITLE_OPTIONS.OPTIONS,
        },
        {
          label: `Append variant's SKU - t-shirt title would be exported as "t-shirt SKU-CODE"`,
          value: TITLE_OPTIONS.SKU,
        },
        {
          label:
            'Append custom text - t-shirt title would be exported as "t-shirt (your custom text)", enter below:',
          value: TITLE_OPTIONS.CUSTOM_TEXT,
        },
      ];
    },
    customLabelsList() {
      const arr = [
        {
          label: "Product Tags (comma separated)",
          value: CUSTOM_LABELS.TAGS,
        },
        {
          label: "Collections id's  (comma separated)",
          value: CUSTOM_LABELS.COLLECTION_ID,
        },
        {
          label: "SKU",
          value: CUSTOM_LABELS.SKU,
        },
        {
          label: "Barcode",
          value: CUSTOM_LABELS.BARCODE,
        },
        {
          label: "Product Handle",
          value: CUSTOM_LABELS.PRODUCT_HANDLE,
        },
        {
          label: "Product variant",
          value: CUSTOM_LABELS.VARIANT,
        },
      ];

      return arr;
    },
  },
  methods: {
    ...mapActions(["FETCH_COLLECTIONS_SHOP"]),
    addFeaturedTag() {
      if (!this.featuredTag) return;

      const exist = this.form.featured_product_tags.includes(this.featuredTag);
      if (exist) return (this.featuredTag = "");

      this.form.featured_product_tags.push(this.featuredTag);
      this.featuredTag = "";
    },

    validateAndCreateFeed() {
      const { name, store_currency, all_products, collections } = this.form;
      let errors = [];
      if (!name) errors.push("Please Add the feed name.");
      if (!store_currency) errors.push("Please Add store currency.");
      if (!all_products && !collections.length)
        errors.push("Please Add Some collections.");
      if (errors.length) {
        errors.forEach((err) => {
          this.$notify({
            group: "global-notification",
            title: "Validation Error",
            text: err,
            type: "error",
            duration: 5000,
          });
        });
        return false;
      }

      if (this.$route.params.id) {
        this.editFeed();
      } else {
        this.createFeed();
      }
    },

    async createFeed() {
      try {
        this.btnLoading = true;
        await this.axios.post("/create-feed", this.form);
        this.$router.push("/");
        this.btnLoading = false;
      } catch (error) {
        this.btnLoading = false;
        console.log(error);
      }
    },

    async editFeed() {
      try {
        this.btnLoading = true;
        await this.axios.post(`/update-feed/${this.$route.params.id}` , this.form)
        this.$router.push('/')
        this.btnLoading = false;
      } catch (error) {
        this.btnLoading = false;
        console.log(error);
      }
    },

    async fetchFeed() {
      try {
        this.pageLoading = true;
        const resp = await this.axios.get(`/feed/${this.$route.params.id}`);
        const { feed } = resp.data;
        this.form = { ...feed.options };
        this.pageLoading = false;
      } catch (error) {
        this.$router.push("/");
        this.pageLoading = false;
      }
    },
  },
  created() {
    this.FETCH_COLLECTIONS_SHOP();
    if (!this.$route.params.id) {
      const { tax } = this.shop.default_options;
      if (tax) {
        this.form.tax = { ...tax };
      }
    } else {
      this.fetchFeed();
    }
  },
};
</script>

<style lang="scss" scoped>
.subtitle-sm {
  font-size: 14px;
}

$color: #1d2c38;

h3,
h1 {
  color: $color;
}

.chips-container {
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 1rem;
}
</style>
