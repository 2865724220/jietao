<template>
    <div class="insure">
        <ul class="con">
            <li>
                <span>应还金额</span>
                <span style="float:right" v-text="money+'元'"></span>
            </li>
            <li class="wpay">
                <span>待还金额</span>
                <div class="wpay-wrap">
                    <input class="wpay-input" type="tel" minlength="1" v-model="wMoney" maxlength="7"  @input='change()'>
                    <img   class="edit-img" src="../../images/edit-money.png" alt="">
                </div>
            </li>
            <li class="zfwrap clearfix" v-on:click.stop.prevent="pickerConfigshow">
                <span style="float:left;">还款方式</span>
                <div class="zfSelect">
                    <span class="arrow fr"><img src="../../images/arrowRight.png"></span>
                    <span style="float:right;">{{typePay}}</span>
                </div>
            </li>
        </ul>
        <div class="btnOut">
            <van-button type="danger" size="large" class="btn" v-if="flow == undefined " @click="back">我已还款，告知对方</van-button>
            <!-- <van-button type="danger" size="large" class="btn"  v-if="flow =='L' " @click="back">我已收款，告知对方</van-button> -->
        </div>
        <div id="mask" v-if="maskLoading">
            <img src="../../images/load.gif" />
            <p>
                请等待
            </p>
        </div>
        <picker-rate :pickerConfig="pickerConfig" @getPickerValue="getPickerValue"></picker-rate>
        <password-input :tel="tel" :isSucess="isSucess" :isDisplay="isDisplay" @tranFn="makeSure" @getValue="getValue"></password-input>
        <dialog-page :maskShow="maskShow" @closed="weixinPay" @triggerPa="weixinPay" class="singleBtn"></dialog-page>
    </div>
</template>
<script>
    //本组件路由需要传递三个参数，total总共还款金额，overdue逾期金额没有就是0，id，多个的id用-拼接
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    Vue.component(Button.name, Button);
    import PickerRate from '../../components/PickerRate';
    import PasswordInput from '../../components/PasswordInput'
    import dialogPage from '../../components/LoanDialog'
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'insure',
        data () {
            return {
                isDisplay:false,//输入支付密码框默认不显示
                isSucess:false,
                tel:'',
                maskLoading:false,
                isRen:true,
                flow:this.$route.query.flow,
                isBorrow:true,
                overdue:0,//逾期费
                overduePayType:'',//逾期费支付方式
               /* isGetValue:true,//  order/borrow-repay 接口开关*/
                pickerConfig : {
                    show:false,
                    arrData : [//还款方式列表
                        '支付宝','微信','现金','银行卡'
                    ],

                },
                typePay : '支付宝',//用户还款给出借方的方式
                money : this.$route.query.total,//还款总金额
                placeHolder: "请输入您还款的金额，最高"+this.$route.query.total+"元",
                wMoney : this.$route.query.total,
                id:this.$route.query.id,
                ids:[],
                maskShow:{   //对话框显示的参数
                    show:false,
                    btnDoub:true,
                    defaultShow:false,
                    /*cancel:'扫码支付',*/
                    confirmTxt:'微信支付',
                    greenFlag:true,
                    overdue:this.$route.query.overdue
                },
            }
        },
        methods : {
            getPickerValue (v) {//还款方式回调
                this.typePay = v;
            },
            pickerConfigshow () {//显示还款方式列表
                preventFn(this.$el.querySelector('.pickerP'));
                this.pickerConfig.show=true;
            },
            back () { //点击我已还款按钮的事件
                if (!this.isRen) {
                    Toast('您还未实名认证，请先认证');
                    this.$router.push({path:'/certification'});

                }else{  //判断是否有逾期还款的借条
                    if(this.overdue > 0){
                        this.maskShow.show = true;//选择支付逾期费方式
                    }else{
                         if( parseFloat(this.wMoney) >0){
                            this.isDisplay = true//仅仅输入支付密码，没有逾期借条
                        }else{
                            Toast("请输入还款金额");
                        }
                    }
                   
                }
            },
            makeSure () {//弹出输入密码
                this.isDisplay = false
                this.isSucess=false;
            },
            //两种支付逾期费的回调函数，通用
            weixinPay (type) {

                if(type=='微信支付'){
                    this.overduePayType =type//支付方式
                    this.maskShow.show = false;
                    this.isDisplay = true//显示输入支付密码
                }else if(type=='扫码支付') {
                    Toast('暂不支持扫码支付')
                }
                else{
                    this.maskShow.show = false;//点击关闭符号，隐藏该对话框
                }

            },
            change () {
                /*console.log(parseFloat(this.wMoney));
                console.log(parseFloat(this.money));*/
                this.wMoney = this.wMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
                if(parseFloat(this.wMoney) > parseFloat(this.money)){
                    Toast("待还最高金额不能超过应还金额");
                }

            },
            getValue (v) {//支付密码输入完成的回调。通用方法
                var homeUrl = '';
                if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
                    homeUrl = encodeURI(`http://prod-iou-h5.xianjinxia.com/#/payend?id=${this.$route.query.id}`);
                }else{
                    homeUrl = encodeURI(`http://iou-h5.xianjinxia.com/#/payend?id=${this.$route.query.id}`);
                }
                this.psw= v;
                let obj = {
                    id:this.id,
                    repay_type:this.typePay,
                    pwd:v,
                    wMoney:this.wMoney,
                    flow:this.flow

                };
                let _this = this;
                if(v.length==6){

                    if(this.overdue> 0){
                        this.maskLoading = true;
                        let obj = {
                            id:this.id || this.ids,
                            repay_type:this.typePay,
                            password:v,
                            charge_pay_type : "微信",
                            charge_type:'2',
                            url:homeUrl,
                            flow:this.flow
                        };
                        myFetch(obj,'api/web/pay/overdue-pay',(res)=>{
                            this.maskLoading = false;
                            if(res.code==0){
                                window.location.href = res.data.redirect_url;
                                //Toast('已通知对方确认还款！');

                            }else if (res.code=='100012'){
                                Toast(res.message);
                                _this.isDisplay=true;
                            }else if (res.code =='100124') {
                                Toast(res.message);
                                _this.$router.history.push({path:'/trader-psw'})
                            }else{
                                Toast(res.message);
                            }
                        })
                    }else{//如果没有逾期的话
                            if(!_this.isBorrow){
                                return
                            }else{
                                _this.isBorrow = false;
                                setTimeout(()=>{
                                    _this.isDisplay = false;
                                },500);
                                myFetch(obj,'api/web/order/borrow-repay',(res)=>{//借款人发起还款确认
                                    if(res.code=='0'){
                                        /*_this.isSucess = true;*/
                                        let fn = ()=>{
                                            Toast('还款成功，已告知对方！');
                                            return _this.$router.history.push({path:'/list-pageB/2'})
                                        }
                                        setTimeout(fn,800);
                                        _this.isBorrow =true;

                                    }else if (res.code =='100124') {
                                         _this.isBorrow =true;
                                        Toast(res.message);
                                        _this.$router.history.push({path:'/trader-psw'})
                                    }else if (res.code=='100012'){
                                         _this.isBorrow =true;
                                        Toast(res.message);
                                    }else if (res.code=='100190'){
                                         _this.isBorrow =true;
                                        Toast(res.message);
                                    }else{
                                         _this.isBorrow =true;
                                        Toast(res.message);
                                    }
                                }) 
                            }
                           
                   
                        
                    }

                }

            }
        },
        created () {
            document.title="你我信条";
        },
        mounted () {
            let str = this.$route.query.id;
            this.overdue = this.$route.query.overdue;
            if(str.includes('-')){
                this.ids = str.split('-');
            }else{
                this.id = str;
            }

            let _this = this;
            myFetch({},'api/web/user/user-info',res=>{
                if(res.data.id_card ==""){
                    _this.isRen = false;
                }
            })
        },
        components : {
            PickerRate,
            PasswordInput,
            dialogPage,
        }
    }
</script>
<style lang="less" scoped>
    @import './inSure.less';
</style>
