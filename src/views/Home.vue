<template>
  <div class="pt-5">
    <FeedListTable />
    <v-row>
      <v-col cols="12" lg="4" md="6">
        <a-card title="What to do next" height="100%">
          <div class="card-container card-container__1">
            <p class="subtitle-sm mb-0">
              If you don’t have a product catalog, you have to create one:
            </p>

            <p>
              <v-btn
                color="blue"
                block
                to="/create-feed"
                x-large
                elevation="0"
                class=""
                style="color: #fff"
                >Create product catalog in business manager</v-btn
              >
            </p>
            <p class="subtitle-sm mb-0">
              Follow the instructions. When asked for a product URL , copy and
              paste the
              <router-link to="/create-feed">Feed URL</router-link> that
              provided above.
            </p>
            <p class="subtitle-sm mb-0">Need Help? just email us at</p>
            <p class="subtitle-sm bold mb-0">Support@awesomestoreapps.com</p>
          </div>
        </a-card>
      </v-col>
      <v-col cols="12" lg="5" md="6">
        <a-card title="FAQ's" height="100%">
          <div class="card-container card-container__2">
            <div>
              <h4 class="mb-3 mt-6">
                How often are products and feeds updated?
              </h4>
              <p class="subtitle-sm mb-10">
                If you are a registered Free user, you can upload up to 3
                personal icons per collection. If you are a Premium user, you
                can add up to 256 personal icons per collection.
              </p>
            </div>
            <faqQuestion />
          </div>
        </a-card>
      </v-col>
      <v-col cols="12" lg="3" md="12">
        <a-card class="pb-7" height="100%">
          <a-card
            title="Happy with the app?"
            color="#F5F5F5"
            class="pb-7"
            style="overflow: unset"
            height="100%"
          >
            <div class="card-container card-container__3">
              <div class="my-4 text-center">
                <v-icon v-for="n in 5" :key="n" color="yellow" large>mdi-star</v-icon>
              </div>

              <div>
                We’ll appreciate if you could leave a
                <span class="bold">short review</span> that help us building new
                and better features instead of marketing.
              </div>
            </div>

            <a-button class="leave-review">Leave a review</a-button>
          </a-card>
        </a-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import faqQuestion from "@/components/faq-question/faq-question";
import FeedListTable from "@/components/tables/feed-list-table";
export default {
  name: "Home",

  components: { faqQuestion, FeedListTable },
  data() {
    return {
      loading: false,
      feeds: [],
    };
  },
  methods: {
    async createFeed() {
      try {
        this.loading = true;
        const resp = await this.axios.post("/create-feed", {
          name: `feed-${Date.now()}`,
        });
        console.log(resp);
        this.loading = false;
        this.fetchAllFeeds();
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async fetchAllFeeds() {
      try {
        this.loading = true;
        const resp = await this.axios.get("/feeds");
        this.feeds = resp.data.feeds;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async deleteFeed(id) {
      try {
        this.loading = true;
        const resp = await this.axios.post("/delete-feed", { id });
        console.log(resp);
        this.fetchAllFeeds();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
  },
  created() {
    // remove the token and query params from the route
    if (this.$route.query.token) {
      this.$router.replace({
        path: "/",
        query: {},
      });
    }

    this.fetchAllFeeds();
  },
};
</script>

<style lang="scss" scoped>
.leave-review {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -15%;
}

.card-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;

  &__1 {
    padding-bottom: 2rem;
  }

  &__2 {
    justify-content: space-between;
    padding-bottom: 2.5rem;
  }
}
</style>
