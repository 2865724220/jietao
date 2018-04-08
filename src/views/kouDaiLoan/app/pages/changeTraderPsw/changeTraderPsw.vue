<template>
    <div class="changePsw">
        <div>
            <p class="top">{{telTxt}}</p>
            <div class="label-s clearfix">
                <label class="ln">新密码</label>
                <input class=""  v-model="inputParam.psw" maxlength="6" placeholder="输入密码，由6位数字组成" @input="inpswValid" type="password">
            </div>
            <div class="valid" v-show="valid.pswValid">
                请输入6位支付密码，由数字组成。
            </div>
            <div class="label-s clearfix">
                <label class="ln">确认密码</label>
                <input class="" maxlength="6" @input="newpswValid" v-model="pswnew" type="password" placeholder="请确认新密码">
            </div>
            <div class="valid" v-show="valid.same">
                两次密码输入不一致。
            </div>
            <div class="label-code clearfix">
                <label class="ln">验证码</label>
                <input  class="" type="tel" @input="valideCode" placeholder="请输入验证码" v-model="inputParam.code" >
                <button class="get-code" :class="{red:!disabled , graydeep: disabled}" @click="getCodes" v-text="getCodeTxt" :disabled="disabled"></button>
            </div>
            <!-- <van-button type="danger" size="large" class="btn" @click="nextStep">修改交易密码</van-button> -->
            <a href="javascript:;" @click="nextStep" class="nextStep">修改交易密码</a>
        </div>
    </div>
</template>
<script>
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg} =configs;
    Vue.component(Button.name, Button);
    var wait = 60
    export default {
        name:'chnagePsw',
        data () {
            return {
                disabled:false,
                telTxt:'',
                timer:null,
                pswnew:'',
                userInfo:'api/web/user/user-info',
                getCodeTxt:'获取验证码',
                tel:'',
                valid : {
                    pswValid:false,
                    same:false
                },
                inputParam : {
                    code:'',
                    psw:''
                },
            }
        },
        methods : {
            nextStep() {
                let obj = {
                    pwd:this.inputParam.psw,
                    smsCode:this.inputParam.code
                };
                let _this = this;
                myFetch(obj,`api/web/user/update-pay-pwd`,(jsonData)=>{
                    if(jsonData.code=='0'){
                        Toast('支付密码修改成功！');
                        _this.$router.go(-1);
                    }else{
                        Toast(jsonData.message);
                    }

                })
            },
            valideCode () {
                let code = this.inputParam.code;
                if(code.length>6){
                    this.inputParam.code = this.inputParam.code.substr(0,6);
                }
            },
            inpswValid () {
                let psw = this.inputParam.psw;
                const pswg = /^[a-zA-Z0-9]{6,10}$/;
                if(psw.length>=6 && psw.length<=10 && pswg.test(psw)){
                    this.valid.pswValid = false;
                }else{
                    this.valid.pswValid = true;
                }

            },
            newpswValid () {
                let psw = this.inputParam.psw;
                if(this.pswnew.length==6){
                    if(psw != this.pswnew){
                        this.valid.same = true;
                    }else{
                        this.valid.same = false;
                    }
                }

            },
            count() {
                let _this=this;
                if (wait == 0) {
                    _this.disabled = false;
                    _this.getCodeTxt="获取验证码";
                    wait = 60;
                } else {
                    _this.disabled = true;
                    _this.getCodeTxt=`${wait}s后重新发送`;
                    wait--;
                    this.timer = setTimeout(function() {_this.count() }, 1000)
                }
            },
            getCodes () {
                let tels = this.tel;
                let obj = {
                    phone:tels
                };
                if( !this.inputParam.psw.length==6 && !this.pswnew.length==6){
                    Toast('请先输入新密码');
                    return
                }
                let _this = this;
                myFetch(obj,`api/web/captcha/send-sms`,(jsonData)=>{
                    if(jsonData.code=='0'){
                        _this.count();
                        this.telTxt =`短信已发送到尾号${this.tel.substr(7,4)}的手机` ;
                        Toast('验证码发送成功')
                    }else{
                        Toast(jsonData.message);
                    }

                })
            },
            getUserInfo(){
                let that = this;
                myFetch({},that.userInfo,function(data){
                    that.tel = data.data.phone;
                })
            },
        },
        mounted () {
            this.getUserInfo();
            wait = 60;
        },
        destroyed () {
            clearTimeout(this.timer);
        }
    }
</script>
<style lang="less" scoped>
    @import './changeTraderPsw.less';
</style>