import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies:[
      {title:"Tarzan", release_date:"2008-10-29", director:"Rui", composer:"Luis"},
      {title:"Rui na Escolas", release_date:"2018-10-29", director:"Manel", composer:"Luis"},
      {title:"Manel na Casa", release_date:"2022-10-29", director:"Rui", composer:"Luis"},
    ]
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
