import configs from './commonService.js'
const {myFetch ,switchErrorMsg} = configs;
const param = {
    getUserInfo:'api/web/user/user-info',
    getOrderInfo:'order/order-info',
    getRepayList:'order/repay-list',//还款记录
    checkPwd:'user/check-pwd',//验证支付密码
    loanRepaid:'order/loan-repaid',//出借人确认收到还款
    repayRefuse:'order/repay-refuse',//出借人拒绝收到还款
    extendList:'extend/list',//展期记录
    extendSave:'extend/save',
    extendRefuse:'extend/refuse',
    servicePay:'pay/service-pay',//服务费支付
    overExtendPay:'pay/over-extend-pay',
    queryResult:'wechatpay/query-result',
    creditRating:'credit/credit-query',//信用等级
}

const api = (()=>{
    let obj = {};
        for(let k in param){
            obj[k] = (o,callback)=>{
                myFetch(o,param[k],(res)=>{
                    if((callback && typeof callback=='function')){
                         callback(res)
                    }
                })
            }
        }
    return obj
})()

export default api
