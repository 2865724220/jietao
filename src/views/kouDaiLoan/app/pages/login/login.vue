<template>
    <div class="login" style="padding-bottom:60%;">
        <div class="tel"  v-show="telModule">
            <img src="~assets/kouDaiLoan/app/images/logo.png">
            <p class="inputS">
                <input type="tel" v-model="inputParam.phone" maxlength="11" placeholder="请输入手机号"/>
            </p>
            <p class="valid" v-if="telValid">
                	请输入正确手机号
            </p>
             <p class="inputS" style="margin-top:0px;" v-show="passwordInput">
                <input type="password" v-model="inputParam.password" maxlength="10" placeholder="请输入密码" />
            </p> 
            <p class="label-code" v-show="smsCodeInput">
                <!-- <label class="ln fl">验证码</label> -->
                <input  id="focus" class="fl" v-model="inputParam.smsCode" type="tel" placeholder="请输入验证码">
                <button class="get-code" v-show="loginBtn" :class="{red:!disabled , graydeep: disabled}" @click="getCode" v-text="getCodeTxt" ref="codeOne" :disabled="disabled"></button>
                <button class="get-code" v-show="forgetSms" :class="{red:!disabled , graydeep: disabled}" @click="forgetCode" v-text="getCodeTxt" ref="codeOne" :disabled="disabled"></button>
                <button class="get-code" style="border: none;" v-show="codeNone" :class="{red:!disabled , graydeep: disabled}" @click="passWordLogin" v-text="getPassword" ref="codeOne" :disabled="disabled"></button>
            </p>
            <p class="forget-code" v-show="buttonInput">
                <button class="get-code" :class="{red:!disabled , graydeep: disabled}" @click="verification" v-text="codeLogin" ref="codeOne" :disabled="disabled"></button>
                <button class="get-code" style="float: right;" :class="{red:!disabled , graydeep: disabled}" @click="forgetPassWord" v-text="forgetPassword" ref="codeOne" :disabled="disabled"></button>
            </p>
            <p class="inputS" v-show="pswModule" style="margin-top: 0;">
                <input type="password" v-model="inputParam.pwd" maxlength="10" placeholder="请设置登录密码，6-10位字母和数字组成" v-on:input="inpswValid"/>
            </p>
            <p class="valid" v-if="valid.pswValid">
                请输入6-10位密码，由数字和字母组成
            </p>
            <van-button type="danger" size="large" class="btn" v-show="loginBtn" @click="login">登录</van-button>
            <van-button type="danger" size="large" class="btn" v-show="forgetSms" @click="next">确认</van-button>
        </div>
    </div>
</template>
<script>
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    Vue.component(Button.name, Button);
    import configs from '../../common/commonService'
    const {myFetch} =configs;
    var wait = 60;
    const setCookie = (name , value)=>
    {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    };
    export default {
        name:'login',
        data () {
            return {
                disabled:false,
                passwordInput:false,
                smsCodeInput:true,
                buttonInput:false,
                codeNone:true,
                forgetSms:false,
                loginBtn:true,
                telValid:false,
                pswModule:false,
                telModule:true,
                getCodeTxt:'获取验证码',
                getPassword:'密码登录',
                forgetPassword:'忘记密码?',
                codeLogin:'验证码登录',
                value:'',
                inputParam : {
                    phone:'',
                    smsCode:'',
                    pwd:'',
                    type:'2',
                    f_env:'web'
                },
                valid : {
                    pswValid:''
                }
            }
        },
        mounted(){
        	this.inputParam.phone = this.$route.params.tels;
        	this.value = this.$route.params.value;
        },
        methods : {
            login (){
                let user = this.inputParam;
                let that = this;
                if(!this.telValid && this.inputParam.phone.length>0){
                    myFetch(user,'api/web/user/login',(res)=>{
	                    if(res.code=='0'){
	                        setCookie('sessionid',res.data.sessionid);
	                        Toast('登录成功！')
	                        if(that.value){
	                        	window.location.href = that.value;
	                        }else{
	                        	that.$router.history.replace('/');
	                        }
	                    }else{
	                        Toast(res.message)
	                    }
	
	                })
                }else{
                    this.telValid = true;
                }
                
            },
            passWordLogin (){
            	this.passwordInput = true;
            	this.smsCodeInput = false;
            	this.buttonInput = true;
            },
            verification (){
            	this.buttonInput = false;
            	this.passwordInput = false;
            	this.smsCodeInput = true;
            },
            forgetPassWord (){
            	this.buttonInput = false;
            	this.passwordInput = false;
            	this.smsCodeInput = true;
            	this.codeNone = false;
            	this.loginBtn = false;
            	this.forgetSms = true;
            	this.pswModule = true;
            },
            forgetCode (){
            	let tels = this.inputParam.phone;
                let obj = {
                    phone:tels,
                    type:'3'
                };
                let _this = this;
                clearInterval(_this.timer);
                myFetch(obj,`api/web/captcha/send-sms`,(jsonData)=>{
                    if(jsonData.code==0){
                        this.count()();
                    }else{
                        Toast(jsonData.message);
                    }

                })
            },
            inpswValid () {
                let psw = this.inputParam.pwd;
                const pswg = /^[a-zA-Z0-9]{6,10}$/;
                if(this.inputParam.pwd.length>10){
                    this.inputParam.pwd = this.inputParam.pwd.substr(0,10)
                }
                if(psw.length>=6 && psw.length<=10 && pswg.test(psw)){
                    this.valid.pswValid = false;
                }else{
                    this.valid.pswValid = true;
                }        

            },
            next (){
            	let tels = this.inputParam.phone;
            	let smsCode = this.inputParam.smsCode;
            	let pwd = this.inputParam.pwd;
            	let that = this;
                let obj = {
                    phone:tels,
                    smsCode:smsCode,
                    pwd:pwd,
                    f_env:'web'
                };
            	myFetch(obj,`user/forget-sign-pwd`,(data)=>{
            		if(data.code==0){
		               let psw = this.inputParam.pwd;
                	   const pswg = /^[a-zA-Z0-9]{6,10}$/;
		               if(psw.length>=6 && psw.length<=10 && pswg.test(psw)){
		                    this.valid.pswValid = false;
		                    Toast('修改成功');
                        	//that.$router.history.replace('/');
                        	window.location.href = that.value;
		                }else{
		                    this.valid.pswValid = true;
		                    Toast('密码输入格式不正确');
		                } 
                    }else{
                        Toast(data.message);
                    }

                })
            },
            count() {
                let _this = this;
                if (wait == 0) {
                    this.disabled = false;
                    this.getCodeTxt="获取验证码";
                    wait = 60;
                } else {
                    this.disabled = true;
                    this.getCodeTxt=`${wait}s后重新发送`;
                    wait--;
                    setTimeout(function() {_this.count() }, 1000)
                }
            },
            getCode () {
                let tels = this.inputParam.phone;
                let obj = {
                    phone:tels,
                    type:'2'
                };
                let _this = this;
                clearInterval(_this.timer);
                myFetch(obj,`api/web/captcha/send-sms`,(jsonData)=>{
                    if(jsonData.code==0){
                        this.count()();
                    }else{
                        Toast(jsonData.message);
                    }

                })
            },
        }
    }
</script>
<style lang="less">
    @import "../loginPage/login.less";
    .forget-code{
    	    width: 85%;
		    height: 1.466667rem;
		    margin: auto;
		    position: relative;
		    -webkit-box-sizing: border-box;
		    box-sizing: border-box;
		    .get-code{
		    	width: 34%;
		    	float:left;
			    text-align: center;
			    background: transparent;
			    height: 0.8rem;
			    line-height: 0.8rem;
			    -webkit-box-sizing: border-box;
			    box-sizing: border-box;
			    margin: 0.32rem 0;
		    }
    }
</style>