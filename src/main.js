import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { ApolloClient } from 'apollo-client'
//import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'


/* No caso de usar HTTP
const httpLink = new HttpLink ({
  //endpoint do graphql na hasura
  uri: "https://hasurateste15.herokuapp.com/v1/graphql"
});
*/

const httpLink = new WebSocketLink({
  uri: "wss://hasurateste15.herokuapp.com/v1/graphql",
  option: {
    reconnect: true,
    timeout: 30000,
  }
})
const apolloClient = new ApolloClient ({
  link: httpLink,
  cache: new InMemoryCache(),
  //connectToDevTools: true, 
  
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.config.productionTip = false

Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
