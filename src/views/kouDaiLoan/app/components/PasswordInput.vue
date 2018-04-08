<template>

    <div class="pswInput" v-if="isDisplay || isSucess" >
        <div class='box' v-if="isDisplay">
            <h4>输入交易密码<img src="../images/closed.png" alt=""  @click="blur"></h4>
            <!-- 密码输入框 -->
            <van-password-input class="www"
                    :value="value"
            ></van-password-input>

            <!-- 数字键盘 -->
            <van-number-keyboard
                    :show="showKeyboard=true"
                    @input="onInput"
                    @delete="onDelete"
                    @click.native="onClick"/>
            <div class='forget'><span class="red fr bigflagon" @click="forgetPassord">忘记交易密码?</span></div>

            <p class="col-icon red">
                <img src="../images/safe.png">
                你我信条安全认证
            </p>
        </div>
        <div class='box' v-if="isSucess">
            <h4>输入交易密码</h4>
            <img class="registerSuc" src="../images/registerSuc.png" />
            <p class="resu">
                验证成功
            </p>
        </div>
    </div>

</template>
<script>
    import Vue from 'vue';
    import { PasswordInput } from 'vant';
    import { NumberKeyboard } from 'vant';
    Vue.component(NumberKeyboard.name, NumberKeyboard);
    Vue.component(PasswordInput.name, PasswordInput);
    export default {
        name:'psw',
        data () {
            return {
                value: '',
                showKeyboard: false,
            }
        },
        methods: {
            onInput(key) {
                this.value = (this.value + key).slice(0, 6);
                if(this.value.length==6){
                    this.$emit('getValue',this.value);
                    /*this.showKeyboard = false;*/
                    setTimeout(()=>{
                     this.value = '';
                    },1000);
                }

            },
            onClick(e) {
                const target = e.target;
                if(target.className === "van-hairline van-number-keyboard__delete") {
                    this.onDelete();
                }else{
                    this.onInput(target.innerHTML)
                }
            },
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
            },
            blur (e) {
                let ev = e || window.event;
                /*if(ev.srcElement.className.indexOf('bigflagon')!=-1){//判断是否点击的忘记密码
                    this.$router.push({path:'/change-psw',query: {tel: this.$props.tel}});
                }else{
                    this.showKeyboard = false;
                    this.value = '';
                    this.$emit('tranFn');
                }*/
                
                
                if(ev.srcElement){
                	if(ev.srcElement.className.indexOf('bigflagon')!=-1){//判断是不是点击的tab,设置请求的day
	                    this.$router.push({path:'/change-psw',query: {tel: this.$props.tel}});
	                }else{
	                    this.showKeyboard = false;
	                    this.value = '';
	                    this.$emit('tranFn');
	                }
                }else if(ev.originalTarget.className.indexOf('bigflagon')!=-1){
                	this.$router.push({path:'/change-psw',query: {tel: this.$props.tel}});
                }else{
                    this.showKeyboard = false;
                    this.value = '';
                    this.$emit('tranFn');
                }

            },

            forgetPassord(){
                this.$router.push({path:'/change-psw'});
            }
        },
        props : {
            isDisplay:{
                type:Boolean
            },
            isSucess:{
                type:Boolean
            },
            tel : {}
        }
    }
</script>
<style lang="less" scoped>
    .pswInput{
        position: fixed;
        left: 0%;
        top:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.5);
        z-index:500
    }
    .box{
        height:800px;
        position: fixed;
        bottom:0;
        width:100%;
        background:#fff;
        z-index:501;
        .registerSuc{
            margin-top:23%;
            margin-left: 40%;
            width:20%;
            //pointer-events:none;
        }
        .resu{
            line-height:70px;
            font-size:32px;
            text-align: center;
        }
        h4{
            text-align:center;
            line-height:100px;
            font-size:40px;
            font-weight: normal;
            position: relative;
            img{
                position:absolute;
                top:10px;
                right: 10px;
                width:50px;
               /*  pointer-events:none; */
            }
        }
        .forget{
            padding:20px;
            overflow:hidden;
            font-size:32px;
        }
        .col-icon{
            margin-top:40px;
            text-align:center;
            border-top:1PX solid #ccc;
            padding-top:10px;
            font-size:32px;
            img{
                width:30px;
                vertical-align:middle;
            }
        }
    }
    .www{
        border:1PX solid #ccc;
    }
   

</style>
