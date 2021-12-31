<template>
  <a-card title="Products Feed" :loading="loading">
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
          <tr v-for="(feed, index) in feeds" :key="feed.name">
            <td>{{ index + 1 }}</td>
            <td>{{ feed.options.name }}</td>
            <td>{{ feed.options.product_numbers || "n/a" }}</td>
            <td>
              <div class="d-flex align-items-center uppercase">
                {{ formatFeedStatus(feed.status).status }}
                <v-btn
                  icon
                  x-small
                  dark
                  class="ml-2"
                  :class="formatFeedStatus(feed.status).color"
                >
                  <v-icon>{{ formatFeedStatus(feed.status).icon }}</v-icon>
                </v-btn>
              </div>
            </td>
            <td>{{ formatTime(feed.updatedAt) }}</td>
            <td>
              <span v-if="feed.feed_url">
                {{ feed.feed_url.substr(0, 30) }}
                <span
                  class="copy warning"
                  v-clipboard:copy="feed.feed_url"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  >copy</span
                >
              </span>
              <span v-else>Coming Soon</span>
            </td>
            <td>
              View
              <v-btn icon class="ml-3">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                v-if="feed.status === FEED_LIST_STATUS.COMPLETED"
                :to="`/edit-feed/${feed._id}`"
                icon
              >
                <v-icon color="primary">mdi-pencil-outline </v-icon>
              </v-btn>
              <v-btn
                icon
                class="ml-3"
                @click="deleteFeed(feed._id)"
                :loading="deleteLoading"
              >
                <v-icon color="error">mdi-trash-can </v-icon>
              </v-btn>
              <a-button
                large
                :x-large="false"
                @clicked="updateFeed(feed)"
                >Update</a-button
              >
                <!-- :disabled="feed.status === FEED_LIST_STATUS.PENDING || loading" -->

            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="empty-state text-center my-10" v-if="!loading && !feeds.length">
      <h1>
        No Feeds Available
        <router-link to="/create-feed">click here</router-link> to create a new
        feed.
      </h1>
    </div>
  </a-card>
</template>

<script>
import { FEED_LIST_STATUS } from "@/constants";
import moment from "moment";
export default {
  name: "feed-list-table",
  data() {
    return {
      loading: false,
      deleteLoading: false,
      feeds: [],
      FEED_LIST_STATUS,
    };
  },
  computed: {
    labels() {
      return [
        "ID",
        "Name",
        "Num",
        "Status",
        "Last Refreshed at",
        "Feed URL",
        "View Feed",
        "Edit/Delete",
      ];
    },
  },
  methods: {
    onCopy() {
      this.$notify({
        group: "global-notification",
        title: "Success",
        text: "Link copied Successfully",
        type: "success",
        duration: 5000,
      });
    },
    onError() {
      this.$notify({
        group: "global-notification",
        title: "Error",
        text: "There's an error while copying link please try again.",
        type: "error",
        duration: 5000,
      });
    },
    formatFeedStatus(status) {
      let icon = "mdi-check";
      let color = "success";
      let feedStatus = status;

      if (FEED_LIST_STATUS.COMPLETED === status) {
        feedStatus = "OK";
      } else if (FEED_LIST_STATUS.PENDING === status) {
        (feedStatus = "pending"), (icon = "mdi-clock ");
        color = "warning";
      } else {
        (feedStatus = "error"), (icon = "mdi-close ");
        color = "error";
      }

      return {
        status: feedStatus,
        icon,
        color,
      };
    },
    formatTime(time) {
      return moment(time).format("lll");
    },
    async fetchFeeds() {
      try {
        this.loading = true;
        const resp = await this.axios.get("/feeds");
        const { feeds } = resp.data;
        this.feeds = feeds;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async deleteFeed(id) {
      try {
        this.deleteLoading = true;
        await this.axios.post("/delete-feed", { id });
        this.feeds = this.feeds.filter((feed) => feed._id !== id);
        this.deleteLoading = false;
      } catch (error) {
        this.deleteLoading = false;
        console.log(error);
      }
    },
    async updateFeed(feedList) {
      try {
        this.loading = true;
        const resp = await this.axios.post(
          `/update-feed/${feedList._id}`,
          feedList.options
        );
        const { feed } = resp.data;
        const index = this.feeds.findIndex((f) => f._id === feedList._id);
        if (index !== -1) {
          const feeds = [...this.feeds];
          feeds[index] = feed;
          this.feeds = [...feeds];
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchFeeds();
  },
};
</script>

<style lang="scss" scoped>
.copy {
  color: #fff;
  display: inline-block;
  border-radius: 5px;
  padding: 2px 10px;
  margin-left: 1rem;
  cursor: pointer;
}

.uppercase {
  text-transform: uppercase;
}
</style>
