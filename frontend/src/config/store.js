import Vue from 'vue'
import Vueex from 'vuex'

Vue.use(Vueex)

export default new Vueex.Store({
    state: {
        isMenuVisible: true
    },
    mutations: {
        toggleMenu(state, isVisible) {
            if(isVisible === undefined) {
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }
        }
    }
})