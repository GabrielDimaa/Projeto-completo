<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header title="Cod3er - Base de Conhecimento" :hideToggle="!user" :hideUserDropdown="!user" /> <!--vai esconder o toggle e o dropdown se o usuario nao estiver setado !-->
		<Menu v-if="user" />
		<Loading v-if="validatingToken" />
		<Content v-else />
		<Footer />
	</div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, userKey } from '@/global'
import { mapState } from 'vuex'
import Header from "@/components/template/Header" //@ referencia a pasta raiz (src)
import Menu from "@/components/template/Menu"
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"
import Loading from "@/components/template/Loading"

export default {
	name: "App",
	components: { Header, Menu, Content, Footer, Loading },
	computed: mapState(['isMenuVisible', 'user']),
	data: function() {
		return {
			validatingToken: true
		}
	},
	methods: {
		async validateToken() {
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			this.$store.commit('setUser', null)

			if(!userData) {
				this.validatingToken = false
				this.$router.push({ name: 'auth' })
				return
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			if(res.data) {
				this.$store.commit('setUser', userData)
				
				if(this.$mq === 'xs' || this.$mq === 'sm') {
                	this.$store.commit('toggleMenu', false)
            	}
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}

			this.validatingToken = false
		}
	},
	created() {
		this.validateToken()
	}
}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0; /* tirar margens */
	}

	#app {
		-webkit-font-smoothing: antialiased; /* ajuda a imprimir as fontes */
		-moz-osx-font-smoothing: grayscale; /* suavizar na hora que renderizar as fontes */

		height: 100vh; /*ocupar a tela inteira*/
		display: grid;
		grid-template-rows: 60px 1fr 40px; /* definir em três linhas, a 1º vai ter 60px, sendo o Header... , assim por diante*/
		grid-template-columns: 300px 1fr; /* duas colunas 300px é o menu*/
		grid-template-areas: 
			"header header"
			"menu content"
			"menu footer";
	}

	#app.hide-menu {
		grid-template-areas: 
			"header header"
			"content content"
			"footer footer";
	}
</style>