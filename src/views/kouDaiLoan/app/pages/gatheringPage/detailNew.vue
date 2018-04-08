<template>
    <div class="back-plan noTop">
       <div class="extend-tip" v-if="hasExtend" @click="viewExtend">
           <img class="logo" src="../../images/extend-tips.png" alt="">
           <div class="text">
               <p>您有一个展期待确认</p>
               <span>快去确认吧！</span>
           </div>
           <img class="arrow" src="../../images/plan-more.png" alt="">
       </div>
       <div class="planCon">
           <div class="con-head clearfix" @click="borrowDetail">
               <img class="title-icon" src="../../images/moneyIcon.png" alt="">
               <span class="title">借款内容</span>
               <i class="fr"></i>
           </div>
           <div class="content">
               <div class="small">
                   <span>借款总额（元）</span>
                   <span class="deadline">
                       到期时间
                       <i class="overdueTips" v-if="getDatas.surplus_state =='3' ">{{getDatas.surplus_days}}</i>
                   </span>
               </div>
               <div class="big">
                   <span>{{getDatas.loan_money}}</span>
                   <span>{{getDatas.total_repay_date}}</span>
               </div>
               <div class="con-man clearfix">
                   <span class="fl">出借人</span>
                   <div class="middle">
                       <span>{{getDatas.loan_user_name}}</span>
                       <img src="../../images/plan-arrow.png" alt="">
                       <span class="blue">借款人(我)</span>
                   </div>
                   <span class="fr">{{getDatas.borrow_user_name}}</span>
               </div>
           </div>
       </div>
       <div class="planCon">
           <div class="con-head clearfix">
               <img class="title-icon" src="../../images/waitPay.png" alt="">
               <span class="title">待还金额</span>
               <!-- <span class="fr">已还500元</span> -->
           </div>
           <div class="back-con">
               <p>待还金额(元)</p>
               <div class="clearfix">
                   <span class="fl">{{getDatas.total_repay_money}}</span>
                   <a href="javascript:;" v-if="getDatas.total_repay_money > 0 " @click="goPay" class="backMoney">还款</a>
               </div>
           </div>
       </div>
       <div class="planCon">
           <div class="con-head clearfix">
               <img class="title-icon" src="../../images/payRecord.png" alt="">
               <span class="title">还款记录</span>
               <span class="fr" v-if="repayList.length>0">已还{{payed}}元</span>
           </div>
           <div class="record-head clearfix" v-if="repayList.length>0">
               <span>还款时间</span>
               <span>还款金额</span>
               <span>还款状态</span>
           </div>
           <ul class="recordUl" v-if="repayList.length>0">
               <li class="clearfix" v-for="(item ,index) in repayList" :key="index">
                   <span>{{item.repay_date}}</span>
                   <span>{{item.repay_money}}元</span>
                   <span>{{item.state}}</span>
               </li>
               <!--  <li class="clearfix">
                  <span>2018.01.10</span>
                  <span>100元</span>
                  <span>待出借人确认</span>
                              </li> -->
           </ul>
           <div class="noList" v-if="repayList.length == 0 ">
               暂无记录
           </div>
       </div>
       <div class="planCon noBottom" @click="viewExtend">
            <div class="con-head clearfix">
               <img class="title-icon" src="../../images/extendRecord.png" alt="">
               <span class="title">展期记录</span>
               <i class="fr"></i>
           </div>
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
                hasExtend:0,
                userTel:'',//设置用户手机号，传入还款页面等
                isPay:false,
                isYuqi:'',
                txt:'',
                datetxt:'日到期',
                getDatas : {},
                userId :'',
                tranShowFlag:false,
                pwd:'',
                payed:0,
                overdue:'',//是否有逾期,
                showDialog:false,
                isSucess:false,
                isDisplay:false,
                repayList:[],
                page:0,
                num: 10, // 一页显示多少条
                totalPages:0
            }
        },
        methods : {
            jumpto(){
                window.location.href=`${agreeUrl}?id=${this.$route.query.id}`;
            },
            viewReport(userId) {
                this.$router.push({name:'creditList',query:{id:userId}});
            },
            viewExtend() {
                this.$router.push({path:'/extend-sure',query:{id:this.$route.query.id,yuqi:this.getDatas.surplus_state,annual_rate:this.getDatas.annual_rate}})
            },
            borrowDetail() {
                this.$router.push({path:'/gather-loan-con',query:{id:this.$route.query.id,yuqi:this.getDatas.surplus_state}})
            },
            goPay() {
                if(this.getDatas.total_repay_money !='0'){
                    /*this.tranShowFlag=true;*/
                    this.$router.history.push({path:'/insure',query: {total: this.getDatas.total_repay_money,id:this.$route.query.id,overdue:0}});
                }
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
                let id = this.$route.query.userType;//是借款还是出借方
                this.txt = id;
                if(id == '2'){
                    this.isPay = true;//借款方
                }else if(id == '1'){
                    this.isPay = false;//出借方
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
                        _this.hasExtend = res.data.has_extend;
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
            },
            getRepayList(){
                let that = this;
                myFetch({order_id:that.$route.query.id,user_type:2,page:that.page},'order/repay-list',(res)=>{
                    let total = res.data.total;
                    that.totalPages =  Math.floor(total/10);
                    that.payed = res.data.true_repay_money;
                    that.repayList = res.data.list;
                });
            }
        },
        created () {
            document.title="还款计划";
        },
        mounted () {
            this.getData;
            this.setShow;
            this.getRepayList;
        },
        components : {
            ActionSheet,
            PasswordInput,
        }
    }
</script>
<style lang="less" scoped>
.back-plan{
    padding-top: 20px;
}
.back-plan *{
    box-sizing: border-box;
}
.clearfix{
  display: block;
  &:before{
    display: block;
    clear: both;
    content: '';
  }
  &:after{
    display: block;
    clear: both;
    content: '';
  }
}
.extend-tip{
    display: block;
    width:100%;
    height: 150px;
    background: url(../../images/extendBg.png) no-repeat center center;
    background-size:cover;
    position: relative;
    padding:30px 30px 0;
    box-sizing: border-box;
    margin-bottom: -10px;
.logo{
    display: inline-block;
    width:59px;
    height: 61px;
    vertical-align: middle;
}
.text{
    color:#fff;
    font-size: 26px;
    display: inline-block;
    vertical-align: middle;
    padding:0 24px;
    p{
        font-size: 30px;
        font-weight: bold;
    }
}
.arrow{
    display: block;
    width:13px;
    height: 22px;
    position: absolute;
    top:60px;
    right:30px;
}
}
.planCon{
    background: #fff;
    margin:20px 0 20px;
    padding:30px;
    &.noTop{
        margin:0 0 20px;
    }
    &.noBottom{
        margin-bottom: 60px;
        .con-head{
            border-bottom: 0;
            padding:0;
        }
    }
    .con-head{
        padding:0 0 24px;
        border-bottom:1PX solid #e6e6e6;
        position: relative;
        .title{
            font-size: 30px;
            color: #252633;
            font-weight: bold;
            display: inline-block;
            vertical-align: middle;
            padding:0 20px;
        }
        i.fr{
            display: block;
            position:absolute;
            top:10px;
            right:0;
            width:13px;
            height:22px;
            background: url('../../images/plan-more-grey.png') no-repeat center center;
            background-size:cover;
        }
    }
    .title-icon{
        display: inline-block;
        width:36px;
        height: 36px;
        vertical-align: middle;
    }
    .small{
        font-size: 24px;
        color: #858E9E;
        display: block;
        width:100%;
        padding:30px 0;
        span{
            display: inline-block;
            vertical-align: middle;
            width:46%;
            &.deadline{
                width:50%;
            }
        }
    }
    .big{
        font-size: 42px;
        font-weight: bold;
        color: #252633;
        padding-bottom: 30px;
        span{
            display: inline-block;
            vertical-align: middle;
            width:46%;
        }
    }
    .con-man{
        padding:30px 0 0;
        border-top:1PX solid #e6e6e6;
        font-size: 30px;
        .fl{
            color: #858E9E
        }
        .middle{
            display: inline-block;
            width:60%;
            text-align: center;
            vertical-align: top;
            img{
                display: inline-block;
                width:35px;
                height: 18px;
                margin:0 28px;
            }
            .blue{
                color: #4D7BFF;
            }
        }
    }
    .back-con{
        font-size: 42px;
        color: #252633;
        p{
            display: block;
            color: #858E9E;
            font-size: 24px;
            padding:30px 0;
        }
        .backMoney{
            display: block;
            float: right;
           /*  height:50px;
           line-height: 50px; */
            color: #4D7BFF;
            border:1PX solid #4D7BFF;
            border-radius:25px;
            font-size: 28px;
            padding:4px 35px;
        }
    }
    .record-head{
        font-size: 26px;
        color: #858E9E;
        padding:30px 0 0;
        span{
            display: block;
            width:33.33%;
            float: left;
            &:nth-child(2){
                text-align: center;
            }
            &:last-child{
                text-align: right;
            }
        }
    }
    .recordUl{
        li{
            padding:30px 0;
            span{
                display: block;
                width:33.33%;
                float: left;
                font-size: 28px;
                color: #252633;
                 &:nth-child(2){
                    text-align: center;
                }
                &:last-child{
                    text-align: right;
                }
            }
        }
    }
}
.overdueTips{
    font-style: normal;
    font-size: 20px;
    color:#fff;
    background: #f94543;
    border-radius:8px;
    padding:0 10px;
    height: 50px;
    line-height: 50px;
    position: relative;
    margin:0 0 0 20px;
    display: inline-block;
    box-sizing: border-box;
    &:before{
        display: block;
        content: '';
        width:0;
        height:0;
        border:6px solid transparent;
        border-right: 12px solid #f94543;
        position: absolute;
        top:20px;
        left:-16px;
    }
    
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
    .noList{
        display: block;
        font-size: 30px;
        text-align: center;
        padding:20px 0;
        color: #666;
    }
</style>
