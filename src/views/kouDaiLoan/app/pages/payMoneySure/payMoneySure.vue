<template>
    <div id="loan-con">
        <ul class="ul-con">
            <li class="li">
                <span class="fl">还款人</span>
                <span class="fr" v-text="getDatas.borrow_user_name"></span>
            </li>
            <li class="li">
                <span class="fl">还款时间</span>
                <span class="fr" v-text="getDatas.total_repay_date"></span>
            </li>

            <li class="li">
                <span class="fl">还款金额</span>
                <span class="fr" v-text="getDatas.yinghuan_money"></span>
            </li>
            <li class="li">
                <span class="fl">还款方式</span>
                <span class="fr" v-text="getDatas.repay_type"></span>
            </li>

        </ul>
        <div class="btnP">
            <van-button type="danger" size="large" class="btn" @click="isDisplay=true">确认收到还款</van-button>
            <p class="btnDel gray" @click="rejectDisplay=true">未收到还款</p>
        </div>
        <password-input :isDisplay="isDisplay" :isSucess="isSucess" @tranFn="makeSure" @getValue="getValue"></password-input>
        <password-input :isDisplay="rejectDisplay" :isSucess="rejectSucess" @tranFn="rejectSure" @getValue="rejected"></password-input>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { Toast ,Button} from 'vant';
    import PasswordInput from '../../components/PasswordInput'
    Vue.component(Button.name, Button);

    export default {
        data () {
            return {
                isImg:'',
                getDatas:{},
                isDisplay:false,
                rejectDisplay:false,
                isSucess:false,
                rejectSucess:false,
                psw:'',
                rejectIng:true,
                clickOnce:true,
            }
        },
        methods : {
            makeSure () {
                this.isSucess = false;
                this.isDisplay = false;
            },
            rejectSure(){
                this.rejectDisplay = false;
                this.rejectSucess = false;
            },
            rejected(v){
                this.psw= v;
                let _this = this;
                let obj = {
                    pwd:this.psw,
                    id:this.$route.query.id,
                };
                if(v.length==6){
                    if(!_this.rejectIng){
                        return
                    }else{
                        _this.rejectIng = false;
                        setTimeout(()=>{
                            _this.rejectDisplay = false;
                        },500);
                        this.api.repayRefuse(obj,(res)=>{//出借人拒绝收到还款
                            if(res.code=='0'){
                                /*_this.rejectDisplay = false;*/
                                _this.rejectSucess = true;
                                _this.rejectIng = true;
                                let fn = ()=>{
                                    Toast('操作成功！');
                                    return _this.$router.go(-1);
                                }
                                setTimeout(fn,800)

                            }else if (res.code=='100012'){
                                Toast(res.message);
                                /*_this.rejectDisplay=true;*/
                                 _this.rejectIng = true;
                            }else{
                                _this.rejectSure();
                                Toast(res.message);
                                _this.rejectIng = true;
                            }
                        })
                    }
                    
                }

            },
            getValue (v) {
                this.psw= v;
                let _this = this;
                if(v.length==6){
                    let obj = {
                        id:this.$route.query.id,
                        pwd:v
                    };
                    if(!_this.clickOnce){
                        return;
                    }else{
                        _this.clickOnce = false;
                        setTimeout(()=>{
                            _this.isDisplay = false;
                        },500);
                        this.api.loanRepaid(obj,(res)=>{//出借人确认收到还款
                            if(res.code=='0'){
                               /* _this.isDisplay = false;*/
                                /*_this.isSucess = true;*/
                                _this.clickOnce = true;
                                if(res.data.state_code && res.data.state_code=='7'){
                                    let fn = ()=>{
                                    Toast('确认成功！');
                                    return _this.$router.push({name:'homeApp'});
                                    }
                                    setTimeout(fn,1500)
                                }else{
                                  let fn = ()=>{
                                    Toast('确认成功！');
                                    return _this.$router.go(-1);
                                    }
                                    setTimeout(fn,1500)  
                                }
                                /*let fn = ()=>{
                                    Toast('确认成功！');
                                    return _this.$router.go(-1);
                                }*/
                                
                            }else if (res.code =='100124') {
                                _this.clickOnce = true;
                                Toast(res.message);
                                _this.$router.history.push({path:'/trader-psw'})
                            }else if (res.code=='100012'){
                                _this.clickOnce = true;
                                /*_this.isDisplay=true;*/
                                Toast(res.message);
                            }
                            else{
                                _this.clickOnce = true;
                                Toast(res.message);
                                _this.makeSure()
                            }   
                        }) 
                    }
                    
                }

            }
        },
        computed : {
            getData () {
                let obj = {
                    id:this.$route.query.id
                };
                let _this = this;
                this.api.getOrderInfo(obj,(res)=>{
                    if(res.code=='0'){
                        _this.getDatas = res.data;
                    }else{
                        Toast(res.message)
                    }
                })
            }
        },
        components : {
            PasswordInput,
        },
        created () {
            document.title="你我信条";
        },
        mounted () {
            this.getData

        }
    }
</script>
<style lang="less" scoped>
    @import '../generationLoan/generationLoan.less';
    .marg{
        margin-top:50px;
    }
    #loan-con{
        height:100%;
    }
    .ul-con {
        li{
            border-bottom: 1PX solid #f2f2f2;
            height:100px;
        }
    }
    .img-list{
        width:100%;
        height:auto;
        background:#fff;
        padding-left:30px;
        margin-top:20px;
        p{
            line-height:60px;
        }
    }
    .btnP{
        position: fixed;
        bottom:50px;
        left:5%;
        width:90%;
    }
    .btn{
        height:100px;
        font-size:36px;
        width: 100%;
        margin-top:70px;
    }
</style>