import { login, getUserInfo } from "@/api/user"
import { getToken, setToken, removeToken } from "@/utils/auth"

const state = {
	token: getToken() || '',
	userInfo: {}
}

const mutations = {
	setToken(state, newToken) {
		state.token = newToken
		setToken(newToken)
	},
	removeToken(state) {
		state.token = ''
		removeToken()
	},
	setUserInfo(state, newInfo) {
		state.userInfo = newInfo
	}
}


const actions = {
	// 使用actions返回的是一个promise，需要解析
	async loginAction(context, data) {
		const res = await login(data)
		console.log(res)
		context.commit('setToken', res.data.data)
	},
	async getUserInfoAction(context) {
		const res = await getUserInfo()
		console.log(res)
		context.commit('setUserInfo', res.data.data)
	},
	loginOutAction(context) {
		// 清除vuex的数据
		context.commit('removeToken')
		context.commit('setUserInfo', {})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}