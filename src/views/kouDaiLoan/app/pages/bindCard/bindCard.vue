<template>
    <div class="certif">
        <div class="tips">注意： 请您避免绑定<span class="red">信用卡、结算卡</span></div>
        <ul class="forms">
            <li>
                <label>持卡人</label>
                <input type="text" placeholder="请输入持卡人姓名" v-model="postData.name" required/>
            </li>
            <li>
                <label>身份证号</label>
                <input type="text" placeholder="请输入身份证号" v-on:input="intelIdCard" maxlength="18" v-model="postData.id_card" required/>

            </li>
            <p class="valid" v-show="valid.id_card">
                请输入正确格式身份证号
            </p>
            <li>
                <label>银行卡号</label>
                <input id="focus" type="number" v-on:input="intelBankCard" placeholder="请输入银行卡号" v-model="postData.card" required/>
                <img @click="postData.card=''" class="delinput" src="~assets/kouDaiLoan/app/images/closed.png" v-show="postData.card" />
            </li>
            <p class="valid" v-show="valid.card">
                请输入正确格式的银行卡号
            </p>
            <li>
                <label>选择银行</label>
                <span class="bankSelect" v-on:click.stop.prevent="pickerConfigshow" >{{idCardName}}</span>
            </li>
            <li>
                <label>预留手机号</label>
                <input type="number" v-on:input="intelValid" placeholder="请输入手机号" v-model="postData.phone" required/>
                <img @click="postData.phone=''" class="delinput" src="~assets/kouDaiLoan/app/images/closed.png" v-show="postData.phone" />
            </li>
            <p class="valid" v-show="valid.telValid">
                请输入正确格式手机号
            </p>
            <li class="unicode">
                <label>验证码</label>
                <input type="number" @input="valideCode" placeholder="请输入验证码" v-model="postData.smsCode" required />
                <button :class="{uncheckedBtn:!disabled, checkedBtn:disabled}" @click = "getUnicode" :disabled="disabled">{{txt}}</button>
            </li>
        </ul>
        <div class="btnOut">
            <van-button type="danger" size="large" class="btn"  @click="bindCard" >添加银行卡</van-button>
        </div>
        <picker-rate :pickerConfig="pickerConfig" @getPickerValue="getPickerValue"></picker-rate>
    </div>
</template>
<script>
    var wait=60;
    import Vue from 'vue'
    import { Button ,Toast} from 'vant';
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    Vue.component(Button.name, Button);
    import PickerRate from '../../components/PickerRate';

    export default {
        name:'anthear',
        data () {
            return {
                disabled:false,
                txt:'获取验证码',
                timer:null,
                pickerConfig : {//调用组件选择银行卡
                    show:false,//是否显示
                    arrData:[]//列表显示
                },
                valid : {
                    telValid:false,
                    card:false,
                    id_card:false
                },
                idCardName:'请选择',
                isPsw:'0',//判断有没有设置过支付密码，0是没有，1是有
                postData : {//提交数据
                    name:'',
                    id_card:'',
                    bank:'',
                    card:'',
                    phone:'',
                    smsCode:''
                }
            }
        },
        methods : {
            getPickerValue (v,arr) {
                let _this = this;
                _this.idCardName = v;
                arr.map((item) => {
                    let key = Object.keys(item) ;
                    if(key == v){
                        _this.postData.bank = item[key];
                    }
                })
            },
            pickerConfigshow () {
                this.getList;
                preventFn(this.$el.querySelector('.pickerP'));
                this.pickerConfig.show=true;
            },
            valideCode () {
                let code = this.postData.smsCode;
                if(code.length>6){
                    this.postData.smsCode = this.postData.smsCode.substr(0,6);
                }
            },
            intelValid () {
                const telreg =/^1[3|4|5|6|7|8|9][0-9]{9}$/ ;
                if(this.postData.phone.length>11){
                    this.postData.phone =this.postData.phone.substr(0,11)
                }
                if(this.postData.phone.length>0 && telreg.test(this.postData.phone)){
                    this.valid.telValid = false;
                }else{
                    this.valid.telValid = true;
                }
            },
            intelIdCard() {
                const telreg =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if(this.postData.id_card.length>0 && telreg.test(this.postData.id_card)){
                    this.valid.id_card = false;
                }else{
                    this.valid.id_card = true;
                }
            },
            intelBankCard () {
                const telreg =/^\d{16,19}$/;
                if(this.postData.card.length>19){
                    this.postData.card =this.postData.card.substr(0,19)
                }
                if(this.postData.card.length>0 && telreg.test(this.postData.card)){
                    this.valid.card = false;
                }else{
                    this.valid.card = true;
                }
            },
            bindCard() {
                myFetch(this.postData,'api/web/user-card/card-save',(res)=>{
                    if(res.code=='0'){
                        Toast('添加银行卡成功');
                        this.$router.go(-1)

                    }else{
                        Toast(res.message);
                    }
                })
            },
            getUnicode () {
                let obj = {phone:this.postData.phone};
                let _this = this;
                if(!this.valid.telValid && this.postData.phone.length>0) {
                    myFetch(obj,'api/web/captcha/send-sms',(res)=>{
                        if(res.code=='0'){
                            _this.count();
                            Toast('验证码已发送')
                        }else{
                            Toast(res.message);
                        }

                    })
                }else{
                    Toast('请输入正确手机号')
                }

            },
            count() {
                let _this = this;
                if (wait == 0) {
                    this.disabled = false;
                    this.txt="获取验证码";
                    wait = 60;
                } else {
                    this.disabled = true;
                    this.txt=`${wait}s后重新发送`;
                    wait--;
                    _this.timer = setTimeout(function() {_this.count() }, 1000)
                }
            }
        },
        mounted () {
            document.getElementById("focus").focus();
            this.$nextTick(function () {
                wait=60;
                let _this = this;
                myFetch ({},'api/web/user-card/bank-list',(res)=>{
                    _this.postData.name = res.data.name;
                    _this.postData.id_card = res.data.id_card;
                })
            })

        },
        destroyed () {
            clearTimeout(this.timer);
        },
        components : {
            PickerRate,
        }

    }
</script>
<style lang="less" scoped>
    @import '../certificationPage/certification.less';
</style>