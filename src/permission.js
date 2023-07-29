import router from "./router";
import nProgress from "nprogress";
import 'nprogress/nprogress.css'
import store from "./store";

const whiteList = ['/login', '/404']
/**
 * 前置守卫
 */
router.beforeEach((to, from, next) => {
	nProgress.start()
	if (store.getters.token) {
		// 存在token
		if (to.path === '/login') {
			// 跳转到主页
			next('/') // 中转到主页
			// next（地址）并没有执行后置守卫
			nProgress.done()
		} else {
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
