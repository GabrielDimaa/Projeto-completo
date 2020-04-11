import axios from 'axios'

const success = res => res
const error = err => {
    if(401 === err.response.status) {
        window.location = '/' //via javaScript vai recarregar a pagina, pedindo o login
    } else {
        return Promise.reject(err) //rejeitando a promise
    }
}

axios.interceptors.response.use(success, error)