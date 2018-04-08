<template>
    <div class="login">
        	<div class="tel" v-show="telModule">
            <img src="~assets/kouDaiLoan/app/images/logo.png">
            <p class="inputS">
                <input type="tel" v-model="inputParam.tel" v-on:input="intelValid" maxlength="11" placeholder="请输入手机号"/>
                <img @click="inputParam.tel=''" class="delinput" src="~assets/kouDaiLoan/app/images/closed.png" v-show="inputParam.tel" />
            </p>
            <p class="valid" v-if="valid.telValid">
                请输入正确手机号
            </p>
            <van-button type="danger" size="large" class="btn" @click="nextStep">下一步</van-button>
        </div>
        <div class="psw" v-show="pswModule">
            <p class="bigt">验证及密码</p>
            <p class="inputS">
                <input type="tel" v-on:input="valideCode" v-model="inputParam.code" placeholder="请输入手机验证码"/>
                <button class="code" :class="{red:!disabled, graydeep: disabled}" @click="getCode" v-text="getCodeTxt" :disabled="disabled"></button>
            </p>
            <p class="valid" v-if="valid.codeValid">
                请输入正确验证码
            </p>
            <p class="inputS">
                <img @click="inputParam.psw=''" class="delinput" src="~assets/kouDaiLoan/app/images/closed.png" v-show="inputParam.psw" />
                <input type="password" maxlength="10" v-model="inputParam.psw" placeholder="请设置登录密码，6-10位字母和数字组成" v-on:input="inpswValid"/>
            </p>
            <p class="valid" v-if="valid.pswValid">
                请输入6-10位密码，由数字和字母组成
            </p>
            <p class="agree">
                <i :class="{checked:isChecked}" @click="checked"></i><span>我已阅读并同意</span><router-link :to="{path:'/loan-agree'}">《借条用户注册协议》</router-link>
            </p>
            <van-button type="danger" size="large" class="btn" :disabled="!isChecked" @click="register">注册</van-button>
        </div>
    </div>
</template>

<script>
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    import configs from '../../common/commonService'
    const {myFetch} =configs;
    Vue.component(Button.name, Button);
    export default {
        name:'login',
        data () {
            return {
                telModule:true,
                pswModule:false,
                isChecked : false,
                disabled:false,
                timer:null,
                val:'',
                getCodeTxt:'获取验证码',
                inputParam : {
                    tel:'',
                    psw:'',
                    code:'',
                    openid:''
                },
                valid : {
                    telValid:false,
                    codeValid:'',
                    pswValid:''
                }
            }
        },
        methods : {

            checked () {
                this.isChecked =!this.isChecked
            },
            nextStep () {
                if(!this.valid.telValid && this.inputParam.tel.length>0){
                    this.getCode();
                }else{
                    this.valid.telValid = true;
                }

            },
            valideCode () {
                let code = this.inputParam.code;
                if(code.length>6){
                    this.inputParam.code = this.inputParam.code.substr(0,6);
                }
            },
            intelValid () {
            	this.inputParam.tel = this.inputParam.tel.replace(/[^0-9]+/g,'');
                const telreg =/^1[3|4|5|6|7|8|9][0-9]{9}$/ ;
                if(this.inputParam.tel.length>11){
                    this.inputParam.tel = this.inputParam.tel.substr(0,11)
                }
                if(this.inputParam.tel.length>0 && telreg.test(this.inputParam.tel)){
                    this.valid.telValid = false;
                }else{
                    this.valid.telValid = true;
                }

            },
            inpswValid () {
                let psw = this.inputParam.psw;
                const pswg = /^[a-zA-Z0-9]{6,10}$/;
                if(this.inputParam.psw.length>10){
                    this.inputParam.psw = this.inputParam.psw.substr(0,10)
                }
                if(psw.length>=6 && psw.length<=10 && pswg.test(psw)){
                    this.valid.pswValid = false;
                }else{
                    this.valid.pswValid = true;
                }        

            },
            count() {
                let _this = this;
                let wait = 60;
                let setf = ()=>{
                    if(wait != 0){
                        _this.disabled = true;
                        _this.getCodeTxt=`${wait}s后重新发送`;
                        wait--;

                    }else{
                        clearInterval(_this.timer);
                        _this.disabled = false;
                        _this.getCodeTxt="获取验证码";
                        _this.telTxt='';
                    }

                };
                setf();
                return ()=> {
                    _this.timer = setInterval (setf,1000);
                };

            },

            getCode () {
                let tels = this.inputParam.tel;
                let obj = {
                    phone:tels
                };
                let _this = this;
                myFetch(obj,'api/web/user/is-register',(d)=>{
                    if(d.code=='0'){
                        _this.pswModule = true;
                        _this.telModule=false;
                        myFetch(obj,`api/web/captcha/send-sms`,(jsonData)=>{
                            if(jsonData.code==0){
                                _this.count()();
                                _this.inputParam.openid=jsonData.data;
                            }else{
                                Toast(jsonData.message);
                            }

                        })
                    }
                    if(d.code == '100121'){
                    	this.$router.push({name:'login',params:{tels:tels,value:this.val}});
                    }
                })

            },
            register () {
                let obj = {
                    phone:this.inputParam.tel,
                    password:this.inputParam.psw,
                    openid:this.inputParam.openid,
                    smsCode:this.inputParam.code,
                    f_env:'web'
                };
                if(this.valid.pswValid || this.inputParam.psw.length==0){
                    this.valid.pswValid = true;
                    Toast('密码输入格式不正确');
                    return false;
                }
                myFetch(obj,`api/web/user/register`,(jsonData)=>{
                    if(jsonData.code=='0'){
                        Toast('注册成功！');
                        //this.$router.history.replace('/');
                        window.location.href = this.val;
                    }else{
                        Toast(jsonData.message);
                    }
                })
            }
        },
        mounted(){
        	let name,value;
	        let str=location.href; 
	        let num=str.indexOf("?");
	        str=str.substr(num+1); 
	    
	        let arr=str.split("&"); 
	        for(let i=0;i < arr.length;i++){
	            num=arr[i].indexOf("=");
	            if(num>0){
	                name=arr[i].substring(0,num);
	                value=arr[i].substr(num+1);
	                this[name]=value;
	            }
	        }
	        
	        this.val = unescape(value);
	        console.log(this.val)
        },
        destroyed () {
            clearTimeout(this.timer);
        }
    }
</script>
<style lang="less" scoped>
    @import './login.less';
</style>