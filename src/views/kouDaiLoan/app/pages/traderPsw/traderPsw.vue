<template>
    <div class="pswInput setPsw">
        <div v-if="setPsw">
            <h2 class="title">设置交易密码</h2>
            <!-- 密码输入框 -->
            <van-password-input
                    :value="value"
                    errorInfo=""
            ></van-password-input>

            <!-- 数字键盘 -->
            <van-number-keyboard
                    :show="showKeyboard=true"
                    @blur="blur"
                    @input="onInput"
                    @delete="onDelete"
                    @click.native="onClick"
            />
        </div>
        <div v-if="comfirm">
            <h2 class="title">再次确认交易密码</h2>
            <!-- 密码输入框 -->
            <van-password-input
                    :value="confrimV"
                    errorInfo=""
            ></van-password-input>

            <!-- 数字键盘 -->
            <van-number-keyboard
                    :show="showKeyboard=true"
                    @blur="blurConfirm"
                    @input="onInputConfirm"
                    @delete="onDeleteSet"
                    @click.native="onClickT"
            />
        </div>
        <div v-if="isSucess">
            <h2 class="title">设置交易密码</h2>
            <img class="registerSuc" src="../../images/registerSuc.png" />
            <p class="resu">
                设置成功
            </p>
        </div>
        <p class="col-icon red" v-if="comfirm || setPsw">
            <img src="../../images/safe.png">
            你我信条安全认证
        </p>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { PasswordInput ,Toast} from 'vant';
    import { NumberKeyboard } from 'vant';
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg} =configs;
    Vue.component(NumberKeyboard.name, NumberKeyboard);
    Vue.component(PasswordInput.name, PasswordInput);
    export default {
        name:'psw',
        data() {
            return {
                value: '',
                confrimV:'',
                showKeyboard: false,
                comfirm:false,
                setPsw:true,
                isSucess:false
            }
        },
        mounted(){
        	/*if(window.screen.width > 1024){
        		document.getElementsByClassName('van-password-input')[0].style.marginTop = '0';
        	}*/
        },
        methods: {
            onInput(key) {
                this.value = (this.value + key).slice(0, 6);
                this.step;
            },
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
            },
            onDeleteSet () {
                this.confrimV = this.confrimV.slice(0, this.confrimV.length - 1);
            },
            blur () {
            },
            blurConfirm () {

            },
            onInputConfirm (key) {
               /* console.log(this.confrimV)*/
                this.confrimV = (this.confrimV + key).slice(0, 6);
                this.confrimPswFn
            },
            onClick(e) {
                const target = e.target;
                if(target.className === "van-hairline van-number-keyboard__delete") {
                    this.onDelete();
                }else{
                    this.onInput(target.innerHTML);
                }
            },
            onClickT(e) {
                const target = e.target;
                if(target.className === "van-hairline van-number-keyboard__delete") {
                    this.onDeleteSet();
                }else{
                    this.onInputConfirm(target.innerHTML);
                }
            }
        },
        computed : {
            step () {
                if(this.value.length==6) {
                    setTimeout(()=>{
                        this.setPsw = false;
                        this.comfirm = true;
                    },200);

                }
            },
            confrimPswFn () {
                if(this.confrimV.length==6) {
                    if( this.confrimV == this.value){
                        let _this = this;
                        let obj = {pwd:this.confrimV};
                        myFetch(obj,'api/web/user/set-pay-pwd',(res)=>{
                            if(res.code=='0'){
                                this.comfirm = this.setPsw =false;
                                _this.isSucess = true;
                                let fn = ()=>{
                                    return _this.$router.go(-1);
                                }
                                setTimeout(fn,800)
                            }else{
                                Toast(switchErrorMsg(res.code))
                            }

                        })
                    }else{
                        Toast('两次密码输入不一致，请重新输入');
                        this.setPsw = true;
                        this.comfirm = false;
                        this.confrimV = this.value = '';
                    }
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    @import './traderPsw.less';
</style>