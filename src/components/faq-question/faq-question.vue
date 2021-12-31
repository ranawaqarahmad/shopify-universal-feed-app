<template>
  <div class="faq">
    <input
      type="text"
      v-model="form.question"
      placeholder="Can't find an answer to your question?"
    />
    <v-btn text :loading="loading" :disabled="loading" @click="submitRequest"
      >Submit a request <v-icon> mdi-arrow-right </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "faq-question",
  data() {
    return {
      form: {
        question: "",
      },
      loading: false,
    };
  },
  methods: {
    async submitRequest() {
      if (this.question) return;
      try {
        this.loading = true;
        await this.axios.post("/customer-question", this.form);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        this.form.question = ''
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.faq {
  padding: 10px 1rem;
  background: #f5f5f5;
  border-radius: 15px;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    flex: 1;
    margin-right: 1rem;
    box-shadow: none;
    outline: none;
  }
}
</style>
