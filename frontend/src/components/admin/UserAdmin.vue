<template>
    <div class="user-admin">
        <b-form>
            <input type="hidden" id="user-id" v-model="user.id"> <!-- se o id estiver setado // !-->
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Nome:" label-for="user-name">
                        <b-form-input id="user-name" type="text" 
                            v-model="user.name" 
                            required placeholder="Informe o Nome do Usuário..." 
                            :readonly="mode === 'remove'"/> 
                    </b-form-group>
                </b-col>

                <b-col md="6" sm="12"> 
                    <b-form-group label="E-mail:" label-for="user-email">
                        <b-form-input id="user-email" type="text" 
                            v-model="user.email" required placeholder="Informe o E-mail do Usuário..." /> 
                    </b-form-group>
                </b-col>
            </b-row>

            <b-form-checkbox id="user-admin" v-model="user.admin" v-show="mode === 'save'" class="mt-3 mb-3">
                Administrador
            </b-form-checkbox>

            <b-row v-show="mode === 'save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha:" label-for="user-password">
                        <b-form-input id="user-password" type="password" 
                            v-model="user.password" required placeholder="Informe a Senha do Usuário..." /> 
                    </b-form-group>
                </b-col>

                <b-col md="6" sm="12">
                    <b-form-group label="Confirmação de Senha:" label-for="user-confirm-password">
                        <b-form-input id="user-confirm-password" type="password" 
                            v-model="user.confirmPassword" required placeholder="Confirme a Senha do Usuário..." /> 
                    </b-form-group>
                </b-col>
            </b-row>
            
            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>

        </b-form>
        <hr>
        <b-table hover striped :items="users" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadUser(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'

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
        loadUsers() { // para obter a lista de usuários
            const url = `${baseApiUrl}/users` 
            axios.get(url).then(res => {
                this.users = res.data
            })
        },
        reset() {
            this.mode = 'save' // mode vai retornar para o modo padrão
            this.user = {} // objeto user vai ficar limpo
            this.loadUsers() // carregar novamente todos os usuários 
        },
        save() {
            const method = this.user.id ? 'put' : 'post' //se o id estiver setado o método vai ser PUT
            const id = this.user.id ? `/${this.user.id}` : '' 
            axios[method](`${baseApiUrl}/users${id}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.user.id
            axios.delete(`${baseApiUrl}/users/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadUser(user, mode = 'save') {
            this.mode = mode
            this.user = { ...user }
        }
    },
    mounted() {
        this.loadUsers()
    }
}
</script>

<style>

</style>