import { login } from "@/api/user"
import { getToken, setToken, removeToken } from "@/utils/auth"

const state = {
	token: getToken() || ''
}

const mutations = {
	setToken(state, newToken) {
		state.token = newToken
		setToken(newToken)
	},
	removeToken(state) {
		state.token = ''
		removeToken()
	}
}


const actions = {
	async loginAction(context, data) {
		const res = await login(data)
		console.log(res)
		context.commit('setToken', res.data.data)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}