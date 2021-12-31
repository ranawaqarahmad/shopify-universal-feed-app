import Vue from "vue";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import vueAxios from "vue-axios";
import VueClipboard from 'vue-clipboard2'



import axios from '@/axios/axios'
import Loader from '@/components/loader/loader'
import aButton from '@/components/ui/a-button'
import aCard from '@/components/ui/a-card.vue'

Vue.use(vueAxios, axios);
Vue.use(Notifications, { velocity });
Vue.use(VueClipboard)

Vue.component('Loader',Loader)
Vue.component('a-button'  , aButton)
Vue.component('a-card'  , aCard)
