<template>
    <div class="user-center">
        <div class="top">
            <!--<img class="imgs" :src="dataObj.headimgurl" v-if="!isRenz">-->
            <img class="imgs" :src="dataObj.headimgurl ? dataObj.headimgurl : require('../../images/user.png')">
            <div class="txt">
                <p v-if="isRenz"><span>尚未实名认证</span><img src="~assets/kouDaiLoan/app/images/unrenz.png"></p>
                <p v-show="!isRenz" v-text="dataObj.name"></p>

                <p><span>{{dataObj.phone ? dataObj.phone : '' | blurPhone}}</span></p>
            </div>
        </div>
        <div class="history-tab">
           <ul class="clearfix">
               <li @click="borrowHisory">
                   <img class="hisTabImg" src="~assets/kouDaiLoan/app/images/me-loan.png" alt="">
                   <span>借入</span>
               </li>
               <li @click="loanHisory">
                   <img class="hisTabImg" src="~assets/kouDaiLoan/app/images/me-borrow.png" alt="">
                   <span>借出</span>
               </li>
           </ul>
        </div>
        <div class="con">
            <ul>
                <li>
                    <span class="nameBg eSign">电子签名</span>
                    <img class="conImg" src="~assets/kouDaiLoan/app/images/arrowRight.png">
                    <span class="fr redSign" @click="showSign" v-if="isLoad && signImgSrc.length == 0">未签署</span>
                    <div class="signImg" @click="showSign" v-if="signImgSrc.length >0">
                        <img :src="signImgSrc" alt="">
                    </div>
                </li>
                <li @click="bankCenter">
                    <span class="nameBg">银行卡</span>
                    <img class="conImg" src="~assets/kouDaiLoan/app/images/arrowRight.png">
                </li>
                <li @click="changeTel">
                    <span class="nameBg telImg">更换手机号</span>
                    <img class="conImg" src="~assets/kouDaiLoan/app/images/arrowRight.png">
                </li>
                <li @click="changePsw">
                    <span class="nameBg imgPsw">更换交易密码</span>
                    <img class="conImg" src='~assets/kouDaiLoan/app/images/arrowRight.png'>
                </li>
                <li  @click="about">
                    <span class="nameBg imgMe">关于我们</span>
                    <span class="banben fr">1.0.2</span>
                    <!--<img class="fr conImg" src="~assets/kouDaiLoan/app/images/arrowRight.png">-->
                </li>
            </ul>
        </div>
        <password-input :tel="tel" :isSucess="isSucess" :isDisplay="isDisplay" @tranFn="makeSure" @getValue="getValue"></password-input>
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
    import Vue from'vue';
    import { Toast } from 'vant';
    /*import { VueSignature } from 'vue-signature';*/
    import PasswordInput from '../../components/PasswordInput'
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg} =configs;
    /*Vue.component('VueSignature', VueSignature);*/
    import vueSignature from "vue-signature";
    Vue.use(vueSignature);
    export default {
        name:'user',
        data () {
            return {
                id:'',
                isRenz:true,
                dataObj:{},
                tel:'',
                isDisplay:false,
                isSucess:false,
                clickOnce:true,
                showSignC:false,
                signImgSrc:'',
                isLoad:false,
                option:{
                    backgroundColor:'transparent'
                }
            }
        },
        methods:{
            changeTel() {
                let _this = this;
                _this.$router.history.push({path:'/change-tel',query:{tel:this.dataObj.phone}})

            },
            changePsw() {
                let _this = this;
                if (this.dataObj.set_pay_pwd=='2') {
                    this.$router.history.push({path:'/trader-psw'})
                }else{
                    this.isDisplay=true;
                }

            },
            bankCenter() {
                let _this = this;
                this.jumpto(()=>{
                    _this.$router.history.push({path:'/bank-center'})
                });

            },
            about () {
                let _this = this;
                _this.$router.history.push({path:'/about'})

            },
            loanHisory () {
                let _this = this;
                _this.$router.push({name:'userHistoryList',params:{id:this.dataObj.user_id}})
            },
            borrowHisory() {
                let _this = this;
                _this.$router.push({name:'userHistoryListB',params:{id:this.dataObj.user_id}})
            },
            jumpto (call){//navigator.onLine
                if(this.dataObj.id_card ==''){
                    this.$router.history.push({path:'/certification'});
                    return
                } else if (this.dataObj.set_pay_pwd=='2') {
                    this.$router.history.push({path:'/trader-psw'})
                }else{
                    call()
                }

            },
            makeSure () {//隐藏
                this.isSucess = false;
                this.isDisplay = false;
            },
            getValue (v) {//支付密码输入完成的回调。通用方法
                this.psw = v;
                let pwd = this.psw,
                    _this = this;
                if (v.length == 6) {
                    if(!this.clickOnce){
                        return
                    }else{
                        this.clickOnce = false;
                        setTimeout(()=>{
                            _this.isDisplay = false;
                        },500);
                        this.api.checkPwd({pwd},res=>{
                            if(res.code=='0'){
                                _this.isSucess = true;
                                let fn = ()=>{
                                    return _this.$router.push({path:'/change-psw',query:{tel:this.dataObj.phone}})
                                }
                                setTimeout(fn,800)
                                this.clickOnce = true;
                            }else{
                                this.clickOnce = true;
                                Toast(res.message);
                            }
                        })
                    }

                }
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
                let _this = this;
                _this.showSignC = false;
                _this.api.getUserInfo({},res=>{
                    if(res.code=='0'){
                        _this.signImgSrc = res.data.write_name?res.data.write_name:'';
                    }else{
                        Toast(switchErrorMsg(res.code))
                    }
                })
            },
            resetS(){
                this.signImgSrc ='';
            }
        },
        computed : {
            getDatas () {
                let _this = this;
                this.api.getUserInfo({},res=>{
                    if(res.code=='0'){
                        _this.dataObj = res.data;
                        _this.signImgSrc = res.data.write_name?res.data.write_name:'';
                        _this.isLoad = true;
                        if(res.data.id_card ==""){
                            _this.isRenz=true ;
                        }else{
                            _this.isRenz=false ;
                        }
                    }else{
                        Toast(switchErrorMsg(res.code))
                    }
                })
            }
        },
        created () {
            document.title="你我信条";
        },
        mounted () {
            this.getDatas
        },
        components : {
            PasswordInput,
           /* VueSignature,*/
        }
    }
</script>
<style lang="less" scoped>
    @import './userCenter.less';
</style>

