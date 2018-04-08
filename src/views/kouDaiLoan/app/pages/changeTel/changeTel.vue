<template>
    <div class="changeTel">
        <div v-if="old">
            <p class="top">{{telTxt}}</p>
            <p class="label-code">
                <label class="ln fl">验证码</label>
                <input  id="focus" class="fl" type="tel" placeholder="请输入验证码" v-model="oldCode" >
                <button class="get-code" :class="{red:!disabled , graydeep: disabled}" @click="getCode" v-text="getCodeTxt" ref="codeOne" :disabled="disabled"></button>
            </p>
            <!-- <van-button type="danger" size="large" class="btn" @click="next">下一步</van-button> -->
            <a href="javascript:;" class="aBtn" @click="next">下一步</a>
        </div>
        <div v-else>
            <p class="label-s">
                <label class="ln fl">新手机号</label>
                <input class="fl"  v-model="inputParam.tel" v-on:input="intelValid" type="tel" placeholder="请输入新的手机号">
            </p>
            <p class="valid" v-show="valid.telValid">
                请输入正确手机号
            </p>
            <p class="label-code">
                <label class="ln fl">验证码</label>
                <input  class="fl" @input="valideCode" type="tel" placeholder="请输入验证码" v-model="inputParam.code" >
                <button class="get-code" :class="{red:!newDisabled , graydeep: newDisabled}" ref="codeTwo" @click="getNewCode" v-text="newGetCodeTxt" :disabled="newDisabled"></button>
            </p>
            <!-- <van-button type="danger" size="large" class="btn" @click="changeTel">更换手机号</van-button> -->
            <a href="javascript:;" class="aBtn" @click="changeTel">更换手机号</a>
        </div>

    </div>
</template>
<script>
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg} =configs;
    Vue.component(Button.name, Button);
    var wait = 60;
    var waitNew = 60;
    export default {
        name:'changeTel',
        data () {
            return {
                old:true,
                disabled:false,
                newDisabled:false,
                newGetCodeTxt:'获取验证码',
                getCodeTxt:'获取验证码',
                oldCode:'',
                telTxt:'',
                timer:null,
                timerNew:null,
                valid : {
                    telValid:false
                },
                inputParam : {
                    tel:'',
                    code:''
                },
            }
        },
        methods : {
            next (){
                let tels = this.$route.query.tel;
                let obj = {
                    phone:tels,
                    smsCode:this.oldCode
                };
                let _this = this;
                myFetch(obj,`api/web/captcha/validate-sms`,(jsonData)=>{
                    if(jsonData.code=='0'){
                        _this.old = false;
                    }else{
                        Toast(jsonData.message);
                    }
                })
            },
            changeTel () {
                let obj = {
                    phone:this.inputParam.tel,
                    smsCode:this.inputParam.code
                };
                myFetch(obj,`api/web/user/edit-phone`,(jsonData)=>{
                    if(jsonData.code=='0'){
                        Toast('更换手机号成功！');
                        this.$router.go(-1)
                    }else{
                        Toast(jsonData.message);
                    }
                })
            },
            intelValid () {
                const telreg =/^1[3|4|5|6|7|8|9][0-9]{9}$/ ;
                if(this.inputParam.tel.length>0 && telreg.test(this.inputParam.tel)){
                    this.valid.telValid = false;
                    this.disabled = true;
                }else if(this.inputParam.tel.length>11){

                    this.inputParam.tel = this.inputParam.tel.substr(0,11);

                }else{
                    this.valid.telValid = true;
                    this.disabled = false;
                }
            },
            valideCode () {
                let code = this.inputParam.code;
                if(code.length>6){
                    this.inputParam.code = this.inputParam.code.substr(0,6);
                }
            },
            count() {
                clearInterval(this.timer);
                let _this = this;
                if (wait == 0) {
                    this.disabled = false;
                    this.getCodeTxt="获取验证码";
                    wait = 60;
                }else {
                    this.disabled = true;
                    this.getCodeTxt=`${wait}s后重新发送`;
                    wait--;
                    _this.timer = setTimeout(function() {_this.count() }, 1000)
                }
               
            },
            countNew() {
                clearInterval(this.timerNew);
                let _this = this;
                if (waitNew == 0) {
                    this.newDisabled = false;
                    this.newGetCodeTxt="获取验证码";
                    waitNew = 60;
                }else {
                    this.newDisabled = true;
                    this.newGetCodeTxt=`${waitNew}s后重新发送`;
                    waitNew--;
                    _this.timerNew = setTimeout(function() {_this.countNew() }, 1000)
                }

            },
            getCode () {
                let tels = this.$route.query.tel;
                let obj = {
                    phone:tels
                };
                let _this = this;
                clearInterval(_this.timer);
                myFetch(obj,`api/web/captcha/send-sms`,(jsonData)=>{
                    if(jsonData.code==0){
                        this.telTxt =`短信已发送到尾号${tels.substr(7,4)}的手机` ;
                        this.count()();
                    }else{
                        Toast(jsonData.message);
                    }

                })
            },
            getNewCode () {
                let obj = {
                    phone:this.inputParam.tel
                };

                let _this = this;
                clearInterval(_this.timerNew);
                myFetch(obj,`api/web/captcha/send-sms`,(jsonData)=>{
                    if(jsonData.code==0){
                        this.countNew()();
                    }else{
                        Toast(jsonData.message);
                    }

                })
            }
        },
        created () {
            document.title="更换手机号";
        },
        mounted () {
            document.getElementById("focus").focus();
            if(!this.disabled){
                this.getCode()
            }

        },
        destroyed () {
            clearInterval(this.timer);
            clearInterval(this.timerNew);
        }
    }
</script>
<style lang="less" scoped>
    @import './changeTel.less';
</style>
