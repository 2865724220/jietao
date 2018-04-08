import Vue from 'vue'
import App from './App'
import routers from './router/index'
import VueRouter from 'vue-router'
import 'lib-flexible/flexible.js'
import * as customFilter from '../../../common/filter/index'
import subInput from '../../../common/directive/index'
import { Toast } from 'vant';
import wxShare from './common/share'
import VueScroller from 'vue-scroller'
import configs from './common/commonService'
import api from './common/api'
Vue.use(VueScroller)
const {myFetch } =configs;
Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.prototype.api = api;
Object.keys(customFilter).forEach(key => {
    Vue.filter(key, customFilter[key])
});
//wxShare.share();
const router = new VueRouter({
    //mode : 'history',
    routes : routers
});
router.beforeEach(({ path}, from, next) => {
    if( navigator.onLine){
    	let configsHost = configs.host;
        	let url = window.location.href;
        	let transCode = escape(url);
        myFetch({f_env:'web'}, 'api/web/user/check-user', function (data) {
            if (data.code != 0 && path!=='/loan-agree' && path !== '/login' && path !== '/register') {
            	if(data.code == '100005'){
            		window.location.href = configsHost+'/web/index?redirect_url='+transCode;
                    return 
            	}
               /* if(data.data.is_reg =='0'){
                    return next({path: '/register'})
                }*/
                /*if(data.data.has_card =='0'){
                    return next({path: '/register'})
                }*/
            }else if(path === '/register'){
                return next()
            }else if(data.data.is_reg =='0' && path !== '/register'){
                return next({path: '/register'})
            }
            next()
        })

    }else{
        Toast('网络连接已断开')
    }

    // var isLogin = Boolean(sessionStorage.getItem('userName'))
    // if ( !isLogin && path !== '/login' && path !== '/') {
    //     return next({ path: '/login' })
    // }

});

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value;
  }
});
/* eslint-disable no-new */
new Vue({
    el: '#apps',
    router :router ,
    render: h=> h(App)
});
