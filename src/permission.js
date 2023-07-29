import router from "./router";
import nProgress from "nprogress";
import 'nprogress/nprogress.css'
import store from "./store";

const whiteList = ['/login', '/404']
/**
 * 前置守卫
 */
router.beforeEach(async (to, from, next) => {
	nProgress.start()
	if (store.getters.token) {
		// 存在token
		if (to.path === '/login') {
			// 跳转到主页
			next('/') // 中转到主页
			// next（地址）并没有执行后置守卫
			nProgress.done()
		} else {
			if (!store.getters.userId) {
				// action返回的值是promise，需要等待数据请求完成才执行下面跳转代码
				await store.dispatch('user/getUserInfoAction')
			}
			next() // 放行
		}
	} else {
		// 没有token
		if (whiteList.includes(to.path)) {
			next()
		} else {
			next('/login') // 中转到登录页
			nProgress.done()
		}
	}
})

/**
 * 后置守卫
 */
router.afterEach((to, from, next) => {
	nProgress.done()
})
