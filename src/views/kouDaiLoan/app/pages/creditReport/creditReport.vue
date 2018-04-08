<template>
    <div class="credit-report">
        <div class="bgfff">
            <ul>
                <li class="clearfix">
                    <span class="fl">用户</span>
                    <span class="fr">{{userInfo.name}}</span>
                </li>
                <li class="clearfix">
                    <span class="fl">手机号</span>
                    <span class="fr">{{userInfo.phone}} </span>
                </li>
                <li class="clearfix">
                    <span class="fl">性别</span>
                    <span class="fr">{{userInfo.sex}} </span>
                </li>
                <li class="clearfix">
                    <span class="fl">年龄</span>
                    <span class="fr">{{userInfo.age}}</span>
                </li>
                <li class="clearfix">
                    <span class="fl">已认证项</span>
                    <span class="fr">
                        <span>{{userInfo.platform}}</span>
                    </span>
                </li>
            </ul>
        </div>
        <a href="javascript:;" class="view-a" @click="viewReport">查看报告</a>
        <div class='mask' v-show='showDialog'>
                <div class='pop-content'>
                    <img src="../../images/closed.png" alt="" class='close' @click='close'>
                    <div class='header1'>
                        选择支付方式
                    </div>
                    <p>查看对方的信用报告，您需要支付平台认证费用0.99元</p>
                    <div class='footer'>
                        <span @click='pay()' class='green'>微信支付</span>
                    </div>
                </div>
        </div>
        <password-input :tel="tel" :isSucess="isSucess" :isDisplay="isDisplay" @tranFn="makeSure" @getValue="getValue"></password-input>
    </div>   
</template>
<script>
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    Vue.component(Button.name, Button);
    import PickerRate from '../../components/PickerRate';
    import PasswordInput from '../../components/PasswordInput'
    import dialogPage from '../../components/LoanDialog'
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'creditReport',
        data () {
            return {
                isDisplay:false,//输入支付密码框默认不显示
                isSucess:false,
                dis:true,
                response:true,
                showDialog:false,
                isReg:'',
                tel:'',
                isRealName:'',
                creditFormInfo:{
                    name:'',
                    phone:'',
                },
                userInfo:{},
            }
        },
        methods : {
          change() {
            if(this.creditFormInfo.name && this.creditFormInfo.phone){
                this.dis= false;
            }else{
                this.dis = true;
            }
          },
          makeSure () {//弹出输入密码
            this.isDisplay = false
            this.isSucess=false;
          },
          getValue (v){

          },

          close(){
            this.showDialog = false;
          },
          viewReport(){
            let that =this;
             myFetch({id:that.$route.query.id},'credit/pay-confirm',(res)=>{
                if(res.code== 0){
                  /* if(res.data.pay_status == 1){
                        //不需要支付手续费
                        that.$router.push({name:'creditList',query:{id:that.$route.query.id}});
                   }else{
                        that.showDialog = true;
                        pay();
                   }*/
                   that.$router.push({name:'creditList',query:{id:that.$route.query.id}});
                }else{
                    Toast(res.message);
                }
            })
            
          },
          pay(){

            let that = this;
            if(that.isReg != 1){
                //去注册
                that.$router.push({name:'register'});
                return;
            }
            if(that.isRealName != 1){
                //去实名
                Toast('请实名绑卡')
                that.$router.push({name:'certification'});
                return;
            }
            var homeUrl = '';
                if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
                    homeUrl = encodeURI(`http://prod-iou-h5.xianjinxia.com/#/payend?id=${that.$route.query.id}`);
                }else{
                    homeUrl = encodeURI(`http://iou-h5.xianjinxia.com/#/payend?id=${that.$route.query.id}`);
                }
            let obj = {
                id:that.$route.query.id,
                repay_type:"微信",
                charge_pay_type : "微信",
                charge_type:'2',
                type:'3',
                pwd:'',
                url:homeUrl
                };

            myFetch(obj,'credit/service-pay',(res)=>{
                if(res.code==0){
                    window.location.href = res.data.redirect_url;
                }else{
                    Toast(res.message);
                }
            })
        },
            
        },
        mounted () {
            let that = this;
            myFetch({id:that.$route.query.id},'credit/report-preview',function(data){
                if(data.code == 0){
                   that.userInfo = data.data;
                }else{
                    Toast(data.message);
                }
            }),
            myFetch({},'credit/check-viewer',function(data){
                if(data.code == 0){
                  that.isReg  = data.data.is_reg;
                  that.isRealName = data.data.is_realName;
                }else{
                    /*Toast(data.message);*/
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
    @import './creditReport.less';
</style>