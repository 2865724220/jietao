<template>
    <div class="gather-detail">
        <div class="top">
            <div class="zhanqi-wrap"><router-link :to="{path:'/gather-more',query: {isS:txt}}" tag="a"  class="zhan-qi blue"><a class="blue">查看还款记录 ></a></router-link></div>
            <p class="graydeep" v-if="isPay"><span :class="{fs:extend}">待还金额</span>
            </p>
            <p class="graydeep" v-else>待收金额</p>
            <p class="money">{{getDatas.total_repay_money}}元</p>
            <p  class="graydeep">将于<span class="red"> {{getDatas.total_repay_date}} </span><span>{{datetxt}}</span><button class="redBtn" v-if="isYuqi">{{getDatas.surplus_days}}</button></p>
            <p class="btn" v-show="isPay && overdue === 0">
                <van-button type="danger" size="large" @click = "fn">立即还款</van-button>
            </p>
             <p class="btn" v-show="isPay && overdue >0">
                <van-button type="danger" size="large" @click = "payOverdue">支付平台逾期费</van-button>
            </p>
          
            <div class="btn" v-if="!isPay">
                <router-link :to="{path:'/extend',query: {id: getDatas.id,annual_rate:getDatas.annual_rate}}" tag="p"><van-button type="danger" size="large">提交展期</van-button></router-link>
            </div>
            <p>
                <router-link v-if="isPay&&extend" class="blue" :to="{path:'/extend-sure',query: {id: getDatas.id,yuqi:getDatas.surplus_state,annual_rate:getDatas.annual_rate}}" tag="a">查看展期></router-link>
            </p>
        </div>
        <div class="con">
            <p class="title">
                <span>借款内容</span>
                <span class="more"><router-link :to="{path:'/gather-loan-con',query: {id: getDatas.id,yuqi:getDatas.surplus_state}}" tag="font">更多</router-link></span>
            </p>
            <ul class="ul-li">
                <li>
                    <span class="fl">借款人：</span>
                    <span class="fl">{{getDatas.borrow_user_name}}</span>
                </li>
                <li>
                    <span class="fl">出借人：</span>
                    <span class="fl">{{getDatas.loan_user_name}}</span>
                </li>
                <li>
                    <span class="fl">借款金额：</span>
                    <span class="fl">{{getDatas.loan_money}}</span>
                </li>
                <!-- <li class="li">
                  <span class="fl">信用报告</span>
                  <span class="fl blue" @click="viewReport(getDatas.borrow_user_id)">点击查看 ></span>
                               </li> -->
                <li>
                    <span class="fl">出借方式：</span>
                    <span class="fl">线下借款</span>
                </li>
                <li>
                    <span class="fl">借款日期：</span>
                    <span class="fl">{{getDatas.loan_date}}</span>
                </li>
                <li>
                    <span class="fl">还款日期：</span>
                    <span class="fl">{{getDatas.total_repay_date}}</span>
                </li>
                <li>
                    <span class="fl">借款利率：</span>
                    <span class="fl">{{getDatas.annual_rate}}%</span>
                </li>
                <li>
                    <span class="fl">借款用途：</span>
                    <span class="fl">{{getDatas.loan_for}}</span>
                </li>
                <li>
                    <span class="fl">创建时间：</span>
                    <span class="fl">{{getDatas.created_time}}</span>
                </li>
                <li>
                    <span class="fl">借款协议</span>
                    <span class="fl blue" @click="jumpto">点击查看 ></span>
                </li>
            </ul>
        </div>
        <div class='mask' v-show='showDialog'>
                <div class='pop-content'>
                    <img src="../../images/closed.png" alt="" class='close' @click='close'>
                    <div class='header1'>
                        支付逾期费
                    </div>
                    <p>该借条已逾期，根据协议，您需要向本平台支付逾期费用{{getDatas.overdue_fee}}元</p>
                    <div class='footer'>
                        <!-- 去掉扫码支付 -->
                        <!--  <span @click='pay(1)'>扫码支付</span> -->
                        <span @click='pay()' class='green'>微信支付</span>
                    </div>
                </div>
        </div>
        <action-sheet :tranShowFlag="tranShowFlag" @displayN="displayN" @postPrama="postPrama"></action-sheet>
        <password-input :isDisplay='isDisplay' :isSucess='isSucess' v-on:getValue='getValue'  @tranFn="makeSure"></password-input>
    </div>
</template>
<script>
    //1 daishou 2,daihuan

    import Vue from'vue';
    import { Button ,Toast} from 'vant';
    import PasswordInput from '../../components/PasswordInput'
    import configs from '../../common/commonService';
    import ActionSheet from '../../components/NewActionSheet';
    const {myFetch, switchErrorMsg ,agreeUrl} =configs;

    export default {
        data () {
            return {
                url:'',
                extend:0,
                userTel:'',//设置用户手机号，传入还款页面等
                isPay:false,
                isYuqi:'',
                txt:'',
                datetxt:'日到期',
                getDatas : {},
                userId :'',
                tranShowFlag:false,
                pwd:'',
                overdue:'',//是否有逾期,
                showDialog:false,
                isSucess:false,
                isDisplay:false,
            }
        },
        methods : {
            jumpto(){
                window.location.href=`${agreeUrl}?id=${this.$route.query.id}`;
            },
            viewReport(userId) {
                this.$router.push({name:'creditList',query:{id:userId}});
            },
            fn () {
                if(this.getDatas.total_repay_money !='0'){
                    this.tranShowFlag=true;
                }
            },
            displayN () {
                this.tranShowFlag=false;
            },
            postPrama () {
                this.$router.history.push({path:'/insure',query: {total: this.getDatas.total_repay_money,id:this.$route.query.id,overdue:0}});
            },
            close(){
                this.showDialog = false;
            },
            payOverdue(){
                this.showDialog =  true;
            },
            getValue(val){
                var homeUrl = '';
                if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
                    homeUrl = encodeURI(`http://prod-iou-h5.xianjinxia.com/#/payend?id=${this.$route.query.id}`);
                }else{
                    homeUrl = encodeURI(`http://iou-h5.xianjinxia.com/#/payend?id=${this.$route.query.id}`);
                }
                let that = this;
                if(val.length>=6){
                    that.pwd = val;
                    let obj = {
                        id:that.$route.query.id,
                        repay_type:"微信",
                        password:val,
                        charge_pay_type : "微信",
                        charge_type:'2',
                        type:'3',
                        url:homeUrl
                    };
                    myFetch(obj,'api/web/pay/overdue-pay',(res)=>{
                        if(res.code==0){
                            window.location.href = res.data.redirect_url;
                            //Toast('已通知对方确认还款！');

                        }else if (res.code=='100012'){
                            Toast(res.message);
                            that.isDisplay=true;
                        }else if (res.code =='100124') {
                            Toast(res.message);
                            that.$router.history.push({path:'/trader-psw'})
                        }else{
                            Toast(res.message);
                        }
                    })
                   
                }
            },
            makeSure () {//弹出输入密码
                this.isDisplay = false;
            },
            pay(){
                this.showDialog = false;
                this.isDisplay = true;
            }
        },
        computed :{
            setShow () {
                let id = this.$route.query.isS;//是借款还是出借方
                this.txt = id;
                if(id == '2'){
                    this.isPay = true;
                }else if(id == '1'){
                    this.isPay = false;
                }
            },
            getData () {
                let obj = {
                    id:this.$route.query.id//借条id
                };
                let _this = this;
                _this.api.getOrderInfo(obj,res=>{
                    if(res.code=='0'){
                        _this.getDatas = res.data;
                        _this.url = res.data.agreement_url;
                        _this.overdue = res.data.overdue_fee;
                        _this.extend = res.data.extend_num;
                        if(_this.getDatas.surplus_state =='3'){
                            _this.isYuqi='123'
                        }else if(_this.getDatas.surplus_state =='2') {
                            _this.datetxt = '今日到期'
                        }
                    }else if (res.code=='100005') {
                        _this.$router.replace('/login');
                    }else{
                        Toast(switchErrorMsg(res.code))
                    }
                })
            }
        },
        mounted () {
            this.getData;
            this.setShow;
        },
        components : {
            ActionSheet,
            PasswordInput,
        }
    }
</script>
<style lang="less" scoped>
    .gather-detail{
        width:100%;
        height:100%;
        overflow-y: auto;
        .top{
            height: auto;
            background:#fff;
            box-sizing: border-box;
            padding-top:40px;
            padding-bottom:30px;
            margin-bottom:30px;
            .zhan-qi{
                text-align: right;
                padding-right:30px;
                font-size: 32px;
            }
            .money{
                font-size: 50px;
                line-height: 90px;
            }
            p{
                font-size: 30px;
                text-align: center;
                line-height: 70px;
                .fs{
                   /*  margin-left: 14%; */
                }
            }
            .btn{
                margin:15px 0;
                .van-button--large{
                    width:70%;
                    line-height:80px;
                    height:80px;
                    font-size: 36px;
                    border-radius: 10px;
                }
            }
            .graydeep{
                button{
                    display: inline-block;
                    margin-left:25px;
                    font-size:26px;
                    width:auto;
                    padding:0 8px;
                }
            }
        }
        .con{
            width:100%;
            height:auto;
            background:#fff;
            .title{
                height:100px;
                width:100%;
                background:url("../../images/loan.png") 30px center no-repeat;
                background-size:7%;
                font-size: 30px;
                border-bottom: 1PX solid #ccc;
                span{
                    float:left;
                    line-height: 100px;
                    padding-left:90px;
                }
                .more{
                    float:right;
                    padding-right:50px;
                    background:url("../../images/arrowRight.png") right center no-repeat;
                    background-size:22%;
                    color:#666;
                }
            }
            .ul-li{
                width:100%;
                height:auto;
                padding-top:15px;
                padding-bottom:15px;
                margin-bottom:30px;
                li{
                    font-size: 30px;
                    height:80px;
                    padding:0 30px;
                    span{
                        line-height: 80px;
                        margin-right:30px;
                    }
                    span:nth-child(2n+1){
                        color:#666;
                    }
                }
            }
        }
    }
    .zhanqi-wrap{
        text-align: right;
    }

  .mask{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.6)
    }
    .pop-content{
        text-align:center;
        background:#fff;
        width:580px;
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        border-radius:12px;
        padding:50px 0;
        padding-bottom:0px;
        font-size:32px;
        .close{
            position: absolute;
            top:15px;
            right: 15px;
            width:40px;
        }
        .header1{
            img{
                width:120px;
            }
            font-size:36px;
        }
        p{
            margin:50px 0;
            padding:0 50px;
            color:#666;
            &.red{
                color:#f03232;
            }
        }
        .footer{
            border-top:1PX solid #efefef;
            line-height: 90px;
            font-size:0;
            span{
                box-sizing: border-box;
                width:50%;
                display: inline-block;
                font-size:34px;
            }
            .bor{
                border-left:1PX solid #efefef;
            }
        }
    }
</style>
