<template>
    <div class="credit-form">
        <div class="outline">
           <div class="labelInput">
                <label>姓名</label>
                <input  type="text" v-model='creditFormInfo.name' id="name" placeholder="请输入对方姓名" @input='change()'/>
            </div>
            <div class="labelInput">
                <label>手机号</label>
                <input type="tel"  v-model='creditFormInfo.phone' placeholder="请输入对方手机号" maxlength="11" @input='change()'/>
            </div> 
        </div>
        <div class="btnOut">
            <a href="javascript:;" class="goView" :class="{disabled:dis}" @click='getUserInfo()'>立即查看</a>
            <!-- <van-button type="danger" size="large" class="btn" :disabled="dis" @click='getUserInfo()'>立即查看</van-button> -->
        </div>
    </div>   
</template>
<script>
    //本组件路由需要传递三个参数，total总共还款金额，overdue逾期金额没有就是0，id，多个的id用-拼接
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    Vue.component(Button.name, Button);
    import PickerRate from '../../components/PickerRate';
    import PasswordInput from '../../components/PasswordInput'
    import dialogPage from '../../components/LoanDialog'
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'creditForm',
        data () {
            return {
                dis:true,
                response:true,
                creditFormInfo:{
                    name:'',
                    phone:'',
                }
            }
        },
        methods : {
          getUserInfo(){
                let that = this;
                
                if(!that.creditFormInfo.name||!that.creditFormInfo.phone){
                    Toast('请检查填写信息');
                    return;
                } 
                if(!(/^1[3456789]\d{9}$/.test(that.creditFormInfo.phone))){
                    Toast('手机号码不正确');
                    return;
                }
                if(!that.response){
                    return;
                }else{
                    /*that.response = false;*/
                    /*that.$router.push({name:'creditList',query:{name:that.creditFormInfo.name,phone:that.creditFormInfo.phone,search:'form'}});*/
                    myFetch({name:that.creditFormInfo.name,phone:that.creditFormInfo.phone},'user/check-user',function(data){
                        if(data.code == 0){
                            that.response = true;
                            that.$router.push({name:'creditList',query:{name:that.creditFormInfo.name,phone:that.creditFormInfo.phone,search:'form'}});
                        }else{
                            that.response = true;
                            Toast(data.message);
                        }
                   
                    })
                }
                
                
            },
          change() {
            if(this.creditFormInfo.name && this.creditFormInfo.phone){
                this.dis= false;
            }else{
                this.dis = true;
            }
          } 
            
        },
        mounted () {
        /* document.getElementById("name").focus();*/
         document.getElementsByTagName('body')[0].className='formSearch';
        },
        destroyed (){
         document.getElementsByTagName('body')[0].className='';
        },
        components : {
            PickerRate,
            PasswordInput,
            dialogPage,
        }
    }
</script>
<style lang="less" scoped>
    @import './creditForm.less';
</style>