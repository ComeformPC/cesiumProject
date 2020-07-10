import Vue from "vue";
import Vuex from "vuex";
import { Viewer } from 'cesium';

Vue.use(Vuex);
interface State{
  viewer:Viewer|null
}
export default new Vuex.Store({
  state: {
    viewer:null
  },
  mutations: {
    ACTIVE_VIEWER(state:State,viewer:Viewer){
      state.viewer=viewer;
    }
  },
  actions: {},
  modules: {}
});
