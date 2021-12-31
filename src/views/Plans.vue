<template>
  <a-card title="Change Plan" :loading="loading">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left" v-for="label in labels" :key="label">
              {{ label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="plan in plans" :key="plan._id">
            <td>
              {{ plan.name }}
              <v-chip color="warning" v-if="plan.subscribed" class="ma-2" small>
                current plan
              </v-chip>
            </td>
            <td>${{ plan.price }}</td>
            <td>
              {{ plan.max_products === -1 ? "Unlimited" : plan.max_products }}
            </td>
            <td>
              <v-btn
                icon
                x-small
                dark
                :class="plan.image_resize ? 'primary' : 'error'"
              >
                <v-icon>mdi-{{ plan.image_resize ? "check" : "close" }}</v-icon>
              </v-btn>
            </td>
            <td>
              <a
                v-if="plan.status && plan.status === 'pending'"
                :href="plan.confirmation_url"
                >CLick to Confirm Subscription</a
              >

              <a-button
                v-else-if="!plan.subscribed"
                @clicked="makeSubscription(plan._id)"
                :disabled="loading"
                >Subscribe</a-button
              >

              <a-button
                @clicked="cancelSubscription(plan._id)"
                :disabled="loading"
                v-else
                color="error"
                >Cancel Subscription</a-button
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="empty-state text-center my-10" v-if="!loading && !plans.length">
      <h1>No Plans Available</h1>
    </div>
  </a-card>
</template>

<script>
export default {
  name: "plans",
  data() {
    return {
      loading: false,
      plans: [],
      products_count:0
    };
  },
  computed: {
    labels() {
      return ["Plan", "Price", "Max Products", "Resize Image", "Subscribe"];
    },
  },
  methods: {
    async fetchAllPlans() {
      try {
        this.loading = true;
        const resp = await this.axios.get("/plans");
        const { plans , products_count } = resp.data;
        this.products_count = products_count
        this.plans = plans;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async makeSubscription(plan_id) {
      try {
        this.loading = true;
        const resp = await this.axios.post("/plan/subscribe", { plan_id });
        const { confirmation_url } = resp.data;
        window.location.href = confirmation_url;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async cancelSubscription(plan_id) {
      try {
        this.loading = true;
        await this.axios.post("/plan/cancel", { plan_id });
        this.fetchAllPlans();
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
  },
  created() {
    this.fetchAllPlans();
  },
};
</script>

<style lang="scss" scoped></style>
