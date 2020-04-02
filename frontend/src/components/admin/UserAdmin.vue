<template>
    <div class="user-admin">
        <b-table hover striped :items="users" :fields="fields"></b-table>
    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
    name: 'UserAdmin',
    data: function() {
        return {
            mode: 'save', // vai servir pra alterar o button do formulário, pra salvar e excluir
            user: {}, // usuário q vamos cadastrar
            users: [],
            fields: [ // descrição dos fields que serão usados pelo b-table
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'email', label: 'E-mail', sortable: true },
                { key: 'admin', label: 'Administrador', sortable: true,
                    formatter: value => value ? 'Sim' : 'Não' },
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadUsers() { // para obter alista de usuários
            const url = `${baseApiUrl}/users` 
            axios.get(url).then(res => {
                this.users = res.data
            })
        }
    },
    mounted() {
        this.loadUsers()
    }
}
</script>

<style>

</style>