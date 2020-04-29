import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import VueApollo from 'vue-apollo'



const httpLink = new HttpLink ({
  //endpoint do graphql na hasura
  uri: "https://hasurateste15.herokuapp.com/v1/graphql",
  headers: {
    'x-hasura-admin-secret': 'goncalo123'
  },
});


const wsLink = new WebSocketLink({
  uri: "wss://hasurateste15.herokuapp.com/v1/graphql",
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams(){
      return {
        headers: {
          'x-hasura-admin-secret': 'goncalo123'
        },
      }
    }
  }
})


const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);



const apolloClient = new ApolloClient ({
  link: link,
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
