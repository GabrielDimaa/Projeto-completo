import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3000
})

Vue.toasted.register(
    'defaultSuccess',
    payload => !payload.msg ? 'Operação realizada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' } 
)

Vue.toasted.register(
    'defaultError',
    payload => !payload.msg ? 'Ops... Erro inesperado.' : payload.msg, // nesse payload vai ter uma msg, pode estar setada ou não
    { type: 'error', icon: 'times' } 
)