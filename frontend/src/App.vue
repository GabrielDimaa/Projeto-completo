<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible}">
		<Header title="Cod3er - Base de Conhecimento" :hideToggle="false" :hideUserDropdown="false" />
		<Menu />
		<Content />
		<Footer />
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Header from "@/components/template/Header" //@ referencia a pasta raiz (src)
import Menu from "@/components/template/Menu"
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"

export default {
	name: "App",
	components: { Header, Menu, Content, Footer },
	computed: mapState(['isMenuVisible'])
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
			"constent content"
			"footer footer";
	}
</style>