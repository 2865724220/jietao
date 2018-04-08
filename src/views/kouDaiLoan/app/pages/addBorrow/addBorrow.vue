<template>
    <div id="loanPiece">
        <div class="ewrap">
            <div class="eline clearfix">
                <span class="fl">借款人</span>
                <span class="fr color3">{{userName}}</span>
            </div>
            <div class="eline clearfix">
                <div class="eInfo fl">
                    <span>电子签名</span>
                    <span class="color9">用于签署借款协议</span>
                </div>
                <div class="signWrap fr">
                    <div class="signImg" @click="showSign" v-if="signImgSrc.length >0">
                        <img :src="signImgSrc" alt="">
                    </div>
                    <!-- <span class="redS" @click="showSign" v-if="signImgSrc.length >0">重签</span> -->
                    <span class="redS" @click="showSign" v-if="isLoad && signImgSrc.length == 0">未签署</span>
                    <span class="arrow"><img src="../../images/arrowRight.png"></span>
                </div>
            </div>
        </div>
        <p v-if="isLoad && signImgSrc.length == 0" class="eRed">请先进行签名，签完名即可打借条</p>
        <div class="outline">
            <div class="labelInput">
                <label>借款金额</label>
                <span>元</span>
                <input id="focus" type="number" placeholder="请输入整数金额" minlength="1" maxlength="7" v-model='loanInfo.loan_money' @input='change(1)'/>
            </div>
            <div class="labelDate">
                <span>借款日期</span>
                <span class="arrow"><img src="../../images/arrowRight.png"></span>
                <span class="dateS" @click="datePickerShow1">{{loanInfo.start_date}}</span>
            </div>
          <!--   <div class="labelInput pr">
              <span>借款时间</span>
              <span class="arrow arrowDay"><img src="../../images/arrowRight.png"></span>
             <div class="inline-day">
                  <input type="tel" placeholder="请输入借款天数"  minlength="1" maxlength="2" v-model='loanInfo.days' @input='change(3)'/>
                  <span>天</span>
             </div>
              <span class='dateS'>7</span>
          </div> -->
            <div class="labelDate">
                <span>还款日期</span>
                <span class="arrow"><img src="../../images/arrowRight.png"></span>   
                <span class='dateS' @click="datePickerShow2">{{loanInfo.end_date}}</span>
            </div>
            <div class="labelDate" style="border:0;" v-on:click.stop.prevent="showPicker(1)">
                <span>年化利率</span>
                <span class="arrow"><img src="../../images/arrowRight.png"></span>
                <span class="dateS">{{loanInfo.annual_rate}}%</span>
            </div>
        </div>

        <p class="valus gray">
            	<!--您将于{{loanInfo.end_date}}　-->
            	本金<span>{{loanInfo.loan_money?loanInfo.loan_money:0}}</span>+利息<span>{{parseInt(((loanInfo.loan_money?loanInfo.loan_money:0)*loanInfo.annual_rate*day/360))/100}}</span>=到期本息<span class="red">{{parseInt(loanInfo.loan_money?loanInfo.loan_money:0)+parseInt(((loanInfo.loan_money?loanInfo.loan_money:0)*loanInfo.annual_rate*day/360))/100}}</span>元
        </p>
        <div class="outline">
            <div class="labelDate" v-on:click.stop.prevent="showPicker(2)">
                <span>借款用途</span>
                <span class="arrow"><img src="../../images/arrowRight.png"></span>
                <span class="dateS">{{loanInfo.loan_for}}</span>
            </div>
            <div class="labelInput">
                <label>对方姓名</label>
                <input  type="text" placeholder="请输入姓名" v-model="loanInfo.loan_user_name" @input="change()"/>
            </div>
          <!--   <div class="labelInput">
              <label>出借人手机号</label>
              <input type="text"  placeholder="请输入手机号，若错误需重新下单" v-model='loanInfo.loan_user_phone' maxlength="11" @input='change(2)' />
          </div> -->
        </div>

        <div class="agree">
            <p class="agreeCon"><i :class="{checked:isChecked}" @click="checked"></i><span>我已阅读并同意</span><a href='http://static-page.xianjinxia.com/static-page/loanAgreement.html'>《借条借款协议》</a></p>
            <ul class="tips">
                <li>提示</li>
                <li>1、借条不支持逾期催收，请确保线下支付完毕。</li>
                <li>2、借条的确认期为3天，到期未确认自动关闭。</li>
            </ul>
        </div>
        <div class="btnOut">
            <van-button type="danger" size="large" class="btn" :disabled="dis" @click='getUserInfo()'>确定</van-button>
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
    	<div class="box" v-show="bombBoxShow">
			<div class="bombBox">
				<div class="bombBox-top">借款前请先进行信用认证</div>
				<div class="bombBox-bottom">
					<div class="b-common" @click="bombBoxHide">没有米房账户</div>
					<div class="b-common b-right"><a :href="auth.auth_url?auth.auth_url:'javascript:;'" :style="{color:color}">我有米房账号</a></div>
				</div>
			</div>
			<div class="bombMask"></div>    		
    	</div>

        <div class="signCanvas" v-if="showSignC">
            <div class="signCon" >
                <div class="headCanvas clearfix">
                    <span class="fl">请在以下区域手写签名</span>
                    <span class="fr closed" @click="closeCanvas"></span>
                </div>
                <vueSignature v-if="signImgSrc.length ==0 " class="canvasArea" ref="signature" :sigOption="option" :w="'100%'" :h="'300px'">></vueSignature>
                <div class="imgSinCon" v-if="signImgSrc.length > 0">
                    <img :src="signImgSrc" alt="">
                </div>
                <p v-if="signImgSrc.length == 0" class="pTis">注：请务必将本人姓名书写清楚，否则可能被驳回借条。</p>
                <div class="footSign clearfix">
                    <button v-if="signImgSrc.length == 0" @click="clearS" class="clearCanvas">清屏</button>
                    <button v-if="signImgSrc.length == 0" @click="saveS" class="saveCanvas">确认</button>
                    <button @click="resetS" v-if="signImgSrc.length > 0" class="resetCanvas">重新签署</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { Button } from 'vant'
    import { Picker,Toast} from 'vant';
    Vue.component(Picker.name, Picker);
    Vue.component(Button.name, Button);
    import DatePicker from '../../components/DatePicker';
    import password from '../../components/PasswordInput';
    import configs from '../../common/commonService';
    import vueSignature from "vue-signature";
    Vue.use(vueSignature);
    const {myFetch ,switchErrorMsg,preventFn} =configs;

   
    
    export default {
        name:'addBorrow',

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
                auth:'',
                userName:'',
                bombBoxShow:false,
                showSignC:false,
                signImgSrc:'',
                isLoad:false,
                signImgSrcF:'',
                option:{
                    backgroundColor:'transparent'
                },
                color:'rgba(77,123,255,1)',
                loanurl:'api/web/order/borrow-order-save',
                userInfo:'api/web/user/user-info',
                platformStatus:'api/web/user/platform-status',
                xieyi:'api/web/static/loanAgreement.html',
                day:0,
                loanInfo:{
                    id:this.$route.query.id?this.$route.query.id:'',
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
        created(){
            document.title="我是借款人";
        },
        mounted(){
            document.getElementById("focus").focus();
            var that = this;
            //通过session记录  用户填写的信息
           
             console.log(window.sessionStorage);
           /* if( window.sessionStorage.getItem('loanInfo')){
                    that.loanInfo = JSON.parse(window.sessionStorage.getItem('loanInfo'));
            }*/

            // this.loanInfo.loan_for_remark = this.$route.params.loan_for_remark;
            // this.loanInfo.loan_for = this.$route.params.loan_for;
            // this.loanInfo.pic = this.$route.params.pic;
            if(this.loanInfo.loan_money&&this.loanInfo.loan_user_name){
               this.dis = false;
            }
            

            //判断用户有没有注册米房
			/*let backUrl = window.location.href;
            myFetch({back_url:backUrl},that.platformStatus,function(data){
            	that.auth = data.data; 

            	if(data.data.auth_status == '0'){
                	that.bombBoxShow = true;
                }else{
                	that.bombBoxShow = false;
                }
            })*/
          
          
            //时间
            myFetch({},that.userInfo,function(data){
                if(data.code==0){
                    that.loanInfo.start_date= data.data.today_date;
                    that.loanInfo.end_date= data.data.month_later_date;
                    that.signImgSrc = data.data.write_name?data.data.write_name:'';
                    that.signImgSrcF = data.data.write_name?data.data.write_name:'';
                    that.userName = data.data.name;
                    that.isLoad = true;
                    that.setdata(that.loanInfo.start_date,that.loanInfo.end_date)
                    //that.loanInfo.days= data.data.loan_day;
                    /*that.setdata(that.loanInfo.start_date,that.loanInfo.end_date) */
                    // that.loanInfo.end_date=data.data.today_date+that.loanInfo.days;
                    // console.log(that.loanInfo.end_date);
                } 
                if( window.sessionStorage.getItem('loanInfo')){
                    that.loanInfo = JSON.parse(window.sessionStorage.getItem('loanInfo'));
                    if(that.$route.query.cliclkFrom&&that.$route.query.cliclkFrom=="home"){
                         //清空姓名和金额
                        that.loanInfo.loan_user_name='';
                        that.loanInfo.loan_money='';
                    }else{
                        /*that.loanInfo.loan_user_name=''; */
                    }
                   
                } 
               /* if(window.sessionStorage.getItem('otherloan')){
                    let otherloan = JSON.parse(window.sessionStorage.getItem('otherloan'));
                    that.loanInfo.loan_for_remark = otherloan['loan_for_remark'];
                    that.loanInfo.loan_for = otherloan['loan_for'];
                    that.loanInfo.pic = otherloan['pic'];
                    if(that.loanInfo.loan_money&&that.loanInfo.loan_user_name){
                         that.dis = false;
                    }
                }   */
            })


            let jtId = that.$route.query.id?that.$route.query.id:'';
            myFetch({id:jtId},'order/order-info',function(res){
                if(res.code == 0){
                    that.loanInfo = res.data;
                    that.loanInfo.end_date= res.data.total_repay_date;
                    that.loanInfo.start_date= res.data.loan_date;
                    /*that.loanInfo.loan_user_name= res.data.loan_user_name;*/
                    /*that.loanInfo.loan_money= res.data.loan_money;
                    that.loanInfo.start_date= res.data.loan_date;
                   
                    that.loanInfo.annual_rate = res.data.annual_rate;*/
                    if(that.loanInfo.loan_money&&that.loanInfo.loan_user_name){
                         that.dis = false;
                    }
                }
            })
        },
        destroyed () {
            document.title="你我信条";
            console.log(document.title)
        },
        methods : {
         
            // 其他
            otherMore(){
                let that = this;
                window.sessionStorage.setItem('loanInfo',JSON.stringify(that.loanInfo));
                console.log(that.loanInfo)
                this.$router.push({name:'loanOtherB',query:{id:that.$route.query.id?that.$route.query.id:''}})
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
                    this.loan();
                }
            },
            getUserInfo(){
                let that = this;
                /*var isZw = /[\u4e00-\u9fa5]/;*/
                /*var result = that.loanInfo.loan_user_name.replace(/[\u4e00-\u9fa5]/g,'').length == 0*/
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
                if(!that.loanInfo.loan_user_name.replace(/\s/g,"").replace(/[\u4e00-\u9fa5]/g,'').length == 0){
                    Toast('请输入中文姓名');
                    return;
                }
                if(that.signImgSrc.length == 0){
                    Toast("您需要签名才可创建借条");
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
                that.loanInfo.loan_user_name = that.loanInfo.loan_user_name.replace(/\s/g,"");
                myFetch(that.loanInfo,that.loanurl,function(data){
                    if(data.code==0){
                        window.sessionStorage.removeItem('loanInfo');
                        window.sessionStorage.removeItem('otherloan');
                        /*that.isSucess = true;*/
                        that.isSucess = false;
                        if(that.$route.query.id){
                            that.$router.push({name:'generationLoan',params:{id:data.data,type:2},query:{resend:1}})
                        }else{
                            that.$router.push({name:'generationLoan',params:{id:data.data,type:2}})
                        }
                       /* setTimeout(function(){
                            that.isSucess = false;
                            that.$router.push({name:'generationLoan',params:{id:data.data,type:2}})
                        },1000)*/
                        that.isClick = true;
                    }else{
                        if(data.code==100012){
                            Toast('密码不正确');
                            that.isDisplay = true;
                            return;
                        }else{
                            Toast(data.message);
                        }
                        that.isClick = true;
                        window.sessionStorage.setItem('loanInfo',JSON.stringify(that.loanInfo));
                       /* that.isDisplay = false;
                        Toast(data.message); */
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
            bombBoxHide(){
            	this.bombBoxShow = false;
            },
            saveS(){
                var _this = this;
                if(_this.$refs.signature.sig._lastVelocity == 0){
                    Toast("请签署姓名！");
                     _this.showSignC = true;
                }else{
                    var png = _this.$refs.signature.save()
                    _this.showSignC = false;
                    _this.signImgSrc = png;
                    myFetch({write_name:_this.signImgSrc},'user/save-writename',function(data){
                        if(data.code==0){
                           Toast(data.message); 
                        }
                    })
                }
                
            },
            clearS(){
                var _this = this;
                _this.$refs.signature.clear();
            },
            showSign(){
                this.showSignC = true;
            },
            closeCanvas(){
                let that =this;
                that.showSignC = false;
                myFetch({},that.userInfo,function(data){
                    if(data.code==0){
                        that.signImgSrc = data.data.write_name?data.data.write_name:'';
                        that.signImgSrcF = data.data.write_name?data.data.write_name:'';
                    } 
                })
            },
            resetS(){
                this.signImgSrc ='';
            }
        },
        components : {
            DatePicker,
            password
        }
    }
</script>
<style lang="less" scoped>
    @import './addBorrow.less';
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