import axios from 'axios';
import Qs from 'qs';
import { Toast} from 'vant';
/*let host='http://iou-test.sudaichaoren.com/';*/
let host='http://ioubak.xianjinxia.com/';

/*let ip = "http://dev-newh5-zuypo3.h5.dev.jisuqianbao.com/kouDaiLoan/app/index.html#/"*/
let ip = "http://iou-h5.xianjinxia.com/#/"
if(window.location.hostname=='iou-h5.xianjinxia.com'){
    host = 'http://ioubak.xianjinxia.com/';
}else if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
    host = 'http://prod-ioubak.xianjinxia.com/';
    ip = 'http://prod-iou-h5.xianjinxia.com/#/'
}
const configs ={
    host:host,
    ip:ip,
    agreeUrl:`${host}agreement/query`,
    timeout:100000,
    myFetch(obj, url, callback) {
        let config = {
            timeout: configs.timeout,
            method: 'post',
            header: {
                'Access-Control-Allow-Credentials': true,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true //设置请求带cookie
        }
        //相应之后拦截器
        axios.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            //let errorObj = {code: '0097'};
            // 对请求错误做些什么
            /*alert(error)*/
            Toast('网络不佳，请稍后再试');
            return Promise.reject(error);
        });
        axios.post(`${configs.host}${url.replace('api/web/','')}`, Qs.stringify(obj),config)
            .then(function(res){
                if(res.code=='100005'){
                    let str = encodeURIComponent(configs.host+'#/')
                    /*window.location.href = window.location.hostname=='iou-h5.sudaichaoren.com'*/
                    window.location.href = window.location.hostname=='iou-h5.xianjinxia.com'
                    ? `http://ioubak.xianjinxia.com/web/auth-login?back_url=${str}`
                    : 'http://localhost:3000/#/';
                }else{
                    callback(res.data)
                }

            })
            .catch(function (error) {
                //console.log('Error', error.message);
            })
    },
    preventFn (el) {
        el.addEventListener('touchstart', function() {
            var top = el.scrollTop
                , totalScroll = el.scrollHeight
                , currentScroll = top + el.offsetHeight;
            if(top === 0) {
                el.scrollTop = 1;
            } else if(currentScroll === totalScroll) {
                el.scrollTop = top - 1;
            }
        });
        el.addEventListener('touchmove', function(evt) {
            if(el.offsetHeight < el.scrollHeight)
                evt._isScroller = true;
        });
    },
    errorMsg : {
        100000 : '系统错误',
        100001 : '不是有效的手机号码',
        100002 : '验证码不正确',
        100003 : '验证码发送频繁',
        100004 : '您的账户已被冻结',
        100005 : '请先登录',
        100006 : '登录失败，请稍候重试',
        100007 : '您的验证码发送次数过多，请明日重试',
        100008 : '请输入图形验证码',
        100009 : '图形验证码错误',
        100010 : '请求频繁，请稍候重试',
        100011 : '请先注册',
        100012 : '密码不正确',
        100013 : '密码不能为空',
        100014 : '请填写手机号码',
        100015 : 'openid不能为空',
        100016 : '请先微信授权',
        100017 : '用户账户创建失败',
        100018 : '注册失败',
        100103 : '借条逾期',
        100104 : '您不是出借人，无法操作',
        100105 : '借条中无借款人ID',
        100106 : '您不是借款人，无法操作',
        100107 : '借条中无出借人ID',
        100108 : '上传出错，请重试',
        100109 : '借条当前状态无法进行此操作',
        100110 : '操作失败',
        100111 : '请先绑定身份证',
        100112 : '请先绑定银行卡',
        100113 : '该身份证已被绑定',
        100114 : '您输入的姓名或身份证号有误',
        100115 : '卡号不能为空',
        100116 : '该银行卡已被绑定',
        100117 : '绑定失败',
        100118 : '无效的验证码',
        100119 : '身份证号不能为空',
        100120 : '请选择正确的银行',
        100121 : '该手机号已被绑定',
        100122 : '银行卡信息不能为空',
        100123 : '未绑定该银行卡',
        100124 : '请设置交易密码',
        100125 : '正在提交，请稍后',
        100128 : '请设置6位数字密码',
        100129 : '密码设置失败',
        100130 : '未设置密码',
        100131 : '新密码不可原密码相同',
        100132 : '密码错误超过5次，请2小时后重试',
        100133 : '密码已存在',
        100134 : '用户不存在',
        100135 : '用户已存在，可直接登录',
        100136 : '请设置6-16位数字密码',
        100137 : '验证内容不合法',
        '100138' : '请使用储蓄卡',
        '100139' : '请输入验证码',
        '100140' : '姓名不能为空',
        '100141' : '解绑失败',
        '100142' : '银行卡不存在或已解绑',
        '100143' : '必须至少保留一张银行卡',
        '100144' : '借款金额不正确',
        '100145' : '借款日期不正确',
        '100146' : '还款日期不正确',
        '100147' : '年化利率不正确',
        '100148' : '借款人姓名不正确',
        '100149' : '借款人手机号不正确',
        '100150' : '不可超过最高年化利率',
        '100151' : '不可小于1天',
        '100153' : '借款日期不可大于还款日期',
        '100154' : '保存失败',
        '100155' : '借条不存在',
        '100156' : '删除失败',
        '100157' : '没有权限',
        '100158' : '状态不存在',
        '100159' : '账户不存在',
        '100160' : '模板类型缺失',
        '100165' : '请选择正确的支付方式',
	    '100169' : '请选择正确的费用支付方式',
        '200000': '缺少必要参数',
        '200001': '接口请求超时',
        '200002' : '参数签名错误'
    },
    switchErrorMsg: (code) => {
    let msg = '';
    for (var k in configs.errorMsg) {
        if (k == code) {
            msg = configs.errorMsg[k]
        }
    }
    return msg;
}
};
export default configs
