import Home from '../pages/Home.vue'
const routers = [
    {
        path: '/',
        name: 'homeApp',
        component : Home,
    },
    {
        path:'/register',
        name:'register',
        component:() => import('../pages/loginPage/login')//注册
    },
    {
        path:'/login',
        name:'login',
        component:() => import('../pages/login/login')//登录
    },
    {
        path:'/add-loan',
        name:'addLoan',
        component:() => import('../pages/addLoan/addLoan')//加借条
    },
    {
        path:'/add-borrow',
        name:'addBorrow',
        component:() => import('../pages/addBorrow/addBorrow')//加借款人
    },
    {
        path:'/add-borrowe',
        name:'addBorrowE',
        component:() => import('../pages/addBorrowE/addBorrowE')//驳回后修改页面
    },
    {
        path:'/loan-other',
        name:'loanOther',
        component:() => import('../pages/loanOther/loanOther')//借条其他页面
    },
     {
        path:'/loan-otherB',
        name:'loanOtherB',
        component:() => import('../pages/loanOtherB/loanOtherB')//借条其他页面
    },
    {
        path:'/share-loan/:id/:type',
        name:'shareLoan',
        component:() => import('../pages/shareLoan/share')//分享借条
    },
    {
        path:'/share-report',
        name:'shareReport',
        component:() => import('../pages/shareReport/shareReport')//分享报告
    },
    {
        path:'/trader-psw',
        name:'traderPsw',
        component:() => import('../pages/traderPsw/traderPsw')//设置交易密码
    },
    {
        path:'/certification/:id*',
        name:'certification',
        component:() => import('../pages/certificationPage/certificationPage')//实名认证
    },
    {
        path:'/change-tel',
        name:'changeTel',
        component:() => import('../pages/changeTel/changeTel')
    },
    {
        path:'/user-center',
        name:'userCenter',
        component:() => import('../pages/userCenter/userCenter')
    },
    {
        path:'/user-history-list/:id', 
        name:'userHistoryList',
        component:() => import('../pages/historyList/historyList')
    },
    {
        path:'/user-history-listb/:id', 
        name:'userHistoryListB',
        component:() => import('../pages/historyListB/historyListB.vue')
    },
    {
        path:'/change-psw',
        name:'changeTraderPsw',
        component:() => import('../pages/changeTraderPsw/changeTraderPsw')
    },
    {
        path:'/bank-center',
        name:'bankCenter',
        component:() => import('../pages/bankCenter/bankCenter')
    },
    {
        path:'/loan/:id/:type',
        name:'generationLoan',
        component:() => import('../pages/generationLoan/generationLoan')
    },
    {
        path:'/list-page/:id*',//1:待收，2：代还
        name:'gatheringPage',
        component:() => import('../pages/gatheringPage/list')
    },
    {
        path:'/list-pageB/:id*',//2：代还
        name:'gatheringPageB',
        component:() => import('../pages/gatheringPage/listB')
    },
    {
        path:'/list-pageL/:id*',//1:待收
        name:'gatheringPageL',
        component:() => import('../pages/gatheringPage/listL')
    },
    {
        path:'/gather-detail/:id*/:isS*',
        name:'gatherDetail',
        component:() => import('../pages/gatheringPage/detail')
    },
    {
        path:'/gather-detail-new/:id*/:isS*',
        name:'gatherDetailNew',
        component:() => import('../pages/gatheringPage/detailNew')
    },
    {
        path:'/gather-detail-newL/:id*',
        name:'gatherDetailNewL',
        component:() => import('../pages/gatheringPage/detailNewL')
    },
    {
        path:'/gather-more',
        name:'gatherMore',
        component:() => import('../pages/gatheringPage/detailMore')
    },
    {
        path:'/gather-loan-con',
        name:'loanCon',
        component:() => import('../pages/gatheringPage/loanCon')
    },
    {
        path:'/insure',
        name:'insure',
        component:() => import('../pages/insurePage/insure')
    },
    {
        path:'/credit-form',
        name:'creditForm',
        component:() => import('../pages/creditForm/creditForm')
    },
    {
        path:'/credit-report',
        name:'creditReport',
        component:() => import('../pages/creditReport/creditReport')
    },
    {
        path:'/credit-rating',
        name:'creditRating',
        component:() => import('../pages/creditRating/creditRating')
    },
    {
        path:'/credit-list',
        name:'creditList',
        component:() => import('../pages/creditList/creditList')
    },
    {
        path:'/credit-detail',
        name:'creditDetail',
        component:() => import('../pages/creditDetail/creditDetail')
    },
    {
        path:'/overdue',
        name:'overdue',
        component:() => import('../pages/gatheringPage/overdue')
    },
    {
        path:'/pay-money-sure',
        name:'payMoneySure',
        component:() => import('../pages/payMoneySure/payMoneySure')
    },
    {
    	path:'/loan-info',
        name:'loanInfo',
        component:() => import('../pages/loanInfo/loanInfo')
    },
    {
        path:'/test',
        name:'test',
        component:() => import('../components/index')
    },
    {
        path:'/loan-agree/:id*',//判定是否显示输入手机号
        name:'loanAgree',
        component:() => import('../pages/agreePage/loanAgreement')
    },
    {
        path:'/about',
        name:'aboutMe',
        component:() => import('../pages/agreePage/aboutMe')
    },
    {
        path:'/bind-card',
        name:'bindCard',
        component:() => import('../pages/bindCard/bindCard')
    },
    {
        path:'/chart',
        name:'chart',
        component:() => import('../components/chart')
    },
    {
        path:'/yuqi/:type',
        name:'yuqi',
        component:() => import('../pages/overdue/list')
    },
    {
        path:'/extend',
        name:'extend',
        component:() => import('../pages/extendPages/submitExtend')
    },
    {
        path:'/extend-sure',
        name:'extendSure',
        component:() => import('../pages/extendPages/sureExtend')
    },
    {
        path:'/payend',
        name:'payend',
        component:() => import('../pages/paySucess/payend')
    },
    {
        path:'/creditDetailPage',
        name:'creditDetailPage',
        component:() => import('../pages/creditDetailPage/creditDetailPage')
    }

]

export default  routers