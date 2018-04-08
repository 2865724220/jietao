<template>
    <div class="modifyBorrow">
        <div class="head">
            <img src="../../images/loanCon.png" alt="">
            <span>借款内容</span>
        </div>
        <div class="content">
            <div class="manInfo">
                <div class="subTitle clearfix">
                    <span class="fl">出借人</span>
                    <span class="fr">借款人(我)</span>
                </div>
                <div class="name clearfix">
                    <span>{{loanInfo.loan_user_name}}</span>
                    <div class="arrowWrap">
                        <img class="arrowMan" src="../../images/arrow-man.png" alt="">
                    </div>
                    <span class="fr">{{loanInfo.borrow_user_name}}</span>
                </div>
            </div>
            <div class="infoList">
                <div class="infoCon clearfix">
                    <span class="info-title">借款金额</span>
                    <input type="tel" placeholder="请输入整数金额" minlength="1" maxlength="7" v-model='loanInfo.loan_money' @input='change(1)'>
                </div>
                 <div class="infoCon clearfix">
                    <span class="info-title">信用报告</span>
                    <div class="blue-arrow">
                        <span>点击查看</span>
                        <i class="arror"></i>
                    </div>
                </div>
                 <div class="infoCon clearfix">
                    <span class="info-title">借款日期</span>
                    <div class="blue-arrow">
                        <span class="dateS" @click="datePickerShow1">{{loanInfo.start_date}}</span>
                        <i class="arror"></i>
                    </div>
                </div>
                 <div class="infoCon clearfix">
                    <span class="info-title">还款日期</span>
                    <div class="blue-arrow">
                        <span class="dateS" @click="datePickerShow2">{{loanInfo.end_date}}</span>
                        <i class="arror"></i>
                    </div>
                </div>
                 <div class="infoCon clearfix">
                    <span class="info-title">年化利率</span>
                    <div class="blue-arrow" v-on:click.stop.prevent="showPicker(1)">
                        <span class="dateS">{{loanInfo.annual_rate}}%</span>
                        <i class="arror"></i>
                    </div>
                </div>
                <div class="infoCon clearfix">
                    <span class="info-title">借款用途</span>
                    <div class="blue-arrow" @click="otherMore()">
                        <span>{{loanInfo.loan_for}}</span>
                        <i class="arror"></i>
                    </div>
                </div>
                <div class="infoCon disabled clearfix">
                    <span class="info-title">补充说明</span>
                    <span class="text">{{loanInfo.loan_for_remark}}</span>
                </div>
                <div class="infoCon disabled line clearfix">
                    <span class="info-title">借款协议</span>
                    <div class="blue-arrow">
                        <span>点击查看</span>
                        <i class="arror"></i>
                    </div>
                </div>
                <div class="infoCon disabled clearfix">
                    <span class="info-title">借条编号</span>
                    <span class="text">{{loanInfo.order_no}}</span>
                </div>
                <div class="infoCon disabled clearfix">
                    <span class="info-title">创建时间</span>
                    <span class="text">{{loanInfo.created_time}}</span>
                </div>
                <div class="infoCon disabled clearfix">
                    <span class="info-title">借条状态</span>
                    <span class="text red">{{loanInfo.state}}</span>
                </div>
            </div>
            <div class="btn-wrap clearfix">
                <a href="javascript:;" class="delete" @click="remove()">删除</a>
                <a href="javascript:;" class="send" @click="loan()">再次发送</a>
            </div>
        </div>

        <date-picker :dateConfig="dateConfig" @confirm="confirm" class="teshude" ></date-picker>
        <div class='toast' v-show='toastshow'>{{message}}</div>
        <div class='mask' v-show='pickerbox'>
            <van-picker
            show-toolbar
            :title="title"
            :columns="pickerColumns"
            @cancel="handlePickerCancel"
            @confirm="handlePickerConfirm"
            ></van-picker>
        </div> 
        <password :isDisplay='isDisplay' :isSucess='isSucess' v-on:getValue='getValue' @tranFn="makeSure"></password> 
    </div>
</template>
<script>
    import Vue from 'vue'
    import { Button } from 'vant'
    import { Picker,Toast} from 'vant';
    Vue.component(Picker.name, Picker);
    Vue.component(Button.name, Button)
    import DatePicker from '../../components/DatePicker'
    import password from '../../components/PasswordInput'
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg,preventFn} =configs

   
    
    export default {
        name:'addBorrowE',
        data () {
            return {
                isChecked : true,
                dateConfig : {
                    show:false
                },
                isDisplay:false,
                message:'',
                toastshow:false,
                title: '',
                pickerbox:false,
                pickerColumns: [
                ],
                isSucess:false,
                dis:true,
                isClick:true,
                title:'',
                loanurl:'api/web/order/borrow-order-save',
                userInfo:'api/web/user/user-info',
                xieyi:'api/web/static/loanAgreement.html',
                day:0,
                loanInfo:{
                    loan_money:'',
                    start_date:'',
                    /*days:'7',*/
                    end_date:'',
                    annual_rate:'24',
                    loan_user_name:'',
                    /*loan_user_phone:'',*/
                    pwd:'',
                    loan_for:'其他',
                    loan_for_remark:'',
                    pic:[]
                }
            }
        },
        mounted(){
            var that = this;
           
            myFetch({id:that.$route.query.id},'api/web/order/order-info',(res)=>{
                console.log(this)
                if(res.code=='0'){
                   that.loanInfo = res.data;
                   that.dis = false;
                }else{
                    Toast(res.message);
                }
            })
           
        },
        methods : {
         
            // 其他
            otherMore(){
                let that = this;
                window.sessionStorage.setItem('loanInfo',JSON.stringify(that.loanInfo));
                this.$router.push({name:'loanOtherB'})
            },
          /*  setdata(y1,y2){
                if(y1&&y2){
                    let that = this;
                    let startTime =(new Date(y1)).getTime();
                    let millSeconds = startTime +(y2*24*60*60*1000);
                    let rDate = new Date(millSeconds);
                    let year = rDate.getFullYear();
                    let month = rDate.getMonth() +1 < 10 ?'0'+(rDate.getMonth() +1):rDate.getMonth() +1;
                    let date = (rDate.getDate()-1)< 10?'0'+(rDate.getDate()-1):(rDate.getDate()-1);
                    let t = year+'-'+month+'-'+date;
                    that.loanInfo.end_date=t;
                }else{
                    this.loanInfo.end_date=''
                }                
            },*/
            setdata(y1,y2){
                let startTime = y1.replace(/\-/g, "/");  
                let endTime = y2.replace(/\-/g, "/"); 
                let t = new Date(endTime).getTime()-new Date(startTime).getTime();
                this.day = t/3600/1000/24 + 1;
            },
            makeSure () {//弹出输入密码
                this.isDisplay = false;
            },
            checked () {
                this.isChecked =!this.isChecked;
                if(this.isChecked){
                    if(this.loanInfo.loan_money&&this.loanInfo.loan_user_name&&this.isChecked){
                        this.dis = false;
                    } 
                }else{
                    this.dis = true;
                }
            },
            datePickerShow1 () {
                preventFn(this.$el.querySelector('.datePicker'));
                this.dateConfig.show=true;
                this.dateConfig.data=1;
            },
            datePickerShow2 () {
                preventFn(this.$el.querySelector('.datePicker'));
                this.dateConfig.show=true;
                this.dateConfig.data=2;
            },
            confirm (n,d) {
                this.dateConfig.show=false;
                if(d==1){
                    this.loanInfo.start_date = n;
                    this.setdata(this.loanInfo.start_date,this.loanInfo.end_date) 
                }else if(d==2){
                    this.loanInfo.end_date = n;
                    this.setdata(this.loanInfo.start_date,this.loanInfo.end_date) 
                }
                if(new Date(this.loanInfo.start_date).getTime() > new Date(this.loanInfo.end_date).getTime()){
                    Toast("借款日期不能大于还款日期！")
                }
            },
            showPicker(way){
                preventFn(this.$el.querySelector('.mask'));
                this.pickerbox = true;
                if(way==1){
                    this.pickerColumns = [
                        {
                        values: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
                        className: 'column1'
                        }
                    ];
                    this.title='年化率%';
                }
                if(way==2){
                    this.pickerColumns = [
                        {
                        values: ['个体经营','消费','助学','创业','租房','旅游','装修','医疗','其他'],
                        className: 'column1'
                        }
                    ];
                    this.title='借款用途';
                }
                
            },
            handlePickerConfirm(picker){
                if(this.title=='借款用途'){
                    this.loanInfo.loan_for = picker[0];
                }
                if(this.title=='年化率%'){
                     this.loanInfo.annual_rate = picker[0];
                }
                this.pickerbox = false;
            },
            handlePickerCancel(){
                this.pickerbox = false;
            },
            getPwd(){
                this.isDisplay = true;
            },
            getValue(val){
                if(val.length>=6){
                    this.loanInfo.pwd = val;
                    this.isDisplay = false;
                    this.deleteO(this.$route.query.id,val);
                }
            },
            getUserInfo(){
                let that = this;
                if(!this.loanInfo.loan_money||!this.loanInfo.start_date||!this.loanInfo.end_date||!this.loanInfo.loan_user_name){
                    Toast('请检查填写信息');
                    return;
                } 
             /*   if(!(/^1[34578]\d{9}$/.test(this.loanInfo.loan_user_phone))){
                    Toast('电话号码不正确');
                    return;
                }*/
                if(this.loanInfo.loan_money>1000000){
                    Toast('输入金额不能超过1百万');
                    return;
                }
                if(this.loanInfo.loan_money.charAt(0)==0){
                    Toast('输入金额不能以0开头');
                    return;
                }
                if(!that.isClick){
                    return;
                }
                myFetch({},that.userInfo,function(data){
                    window.sessionStorage.setItem('loanInfo',JSON.stringify(that.loanInfo));
                    if(!data.data.id_card){
                        Toast('请先完成实名认证')
                        that.$router.push({name:'certification'});
                        return;
                    }
                    if(data.data.set_pay_pwd==2){
                        Toast('请设置交易密码')
                        that.$router.push({name:'traderPsw'});
                        return;
                    }
                    /*that.getPwd();*/  //去掉校验密码
                    that.loan();
                })
                
            },
            loan(){
                let that = this;
                that.isClick = false;
                myFetch(that.loanInfo,that.loanurl,function(data){
                    if(data.code==0){
                        Toast("发送成功！");
                        that.$router.push({path: '/'});
                    }else{
                        if(data.code==100012){
                            Toast('密码不正确');
                            that.isDisplay = true;
                            return;
                        }else{
                            Toast(data.message);
                        }
                    }
                })
                
            },
            change(way){
                if(this.loanInfo.loan_money&&this.loanInfo.loan_user_name&&this.isChecked){
                    this.dis = false;
                }else{
                    this.dis = true;
                }
                if(way==1){
                    this.loanInfo.loan_money=this.loanInfo.loan_money.replace(/[^0-9-]+/,'');
                }/*else{
                    this.loanInfo.loan_user_phone=this.loanInfo.loan_user_phone.replace(/[^0-9-]+/,'');
                }*/
                if(way ==3){
                    /*if(this.loanInfo.days && this.loanInfo.days == 0){
                        Toast("借款天数至少为1天");
                    }*/
                    this.setdata(this.loanInfo.start_date,this.loanInfo.end_date) 
                } 
            },
            remove() {
                this.isDisplay = true;
            },
            deleteO(id,pwd){
                let that = this;
                that.isDisplay = false;
                myFetch({id:that.$route.query.id,pwd:pwd},'api/web/order/order-del',function(data){
                    if(data.code==0){
                        setTimeout(function(){
                            Toast('借条删除成功')
                            that.$router.push({path: '/'});
                        },1000)
                    }else{
                        if(data.code==100012){
                            Toast('密码不正确');
                            that.isDisplay = true;
                            return;
                        }
                        Toast(data.message)
                        that.isDisplay = false;
                    }
                })
            },
        },
        components : {
            DatePicker,
            password
        }
    }
</script>
<style lang="less" scoped>
    @import './addBorrowE.less';
    .toast{
        position: fixed;
        top:50%;
        left:50%;
        padding:8px 20px;
        background:rgba(0,0,0,.6);
        transform: translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
        border-radius:8px;
        font-size: 32px;
        color:#fff;
        line-height: 50px;
    }
    .mask{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        width:100%;
        height:100%;
        z-index:3;
        background:rgba(0,0,0,.6)
    }
    .van-picker{
        position: absolute;
        bottom:0;
        left: 0;
        width:100%;
    }
    .pr{
        position:relative;
        span{
            width:auto;
            float: left;
        }
    }
    .pr .arrowDay{
        display: block;
        position:absolute;
        top:0;
        right:0;
        width:60px;
        height:90px;
        line-height: 88px;
        img{
            display:inline-block;
            vertical-align: middle;
            width:50%;
        }
    }
    .inline-day{
        display: block;
        position: relative;
        text-align: right;
        width:500px;
        float: right;
        padding-right:50px;
        span{
            float:none;
        }
        input{
            width:200px;
            float:none;
            height:80px;
            line-height:80px;
        }
    }
</style>