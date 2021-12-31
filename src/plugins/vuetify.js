import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);


export default new Vuetify({
    default: "light",
    theme: {
      themes: {
        light: {
          primary: "#12B596",
        },
      },
    },
  });
  