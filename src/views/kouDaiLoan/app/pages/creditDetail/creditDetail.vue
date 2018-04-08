<template>
    <div class="credit-detail">
       <div class="head">{{authInfo.platform_name}}平台认证信息</div>
       <div class="grey-head">
         平台认证信息
       </div>
       <ul class="info-deail">
         <li class="clearfix">
           <span class="fl">姓名</span>
           <span class="fr" v-text="authInfo.name"></span>
         </li>
         <li class="clearfix">
           <span class="fl">性别</span>
           <span class="fr" v-text="authInfo.sex"></span>
         </li>
          <li class="clearfix">
           <span class="fl">年龄</span>
           <span class="fr" v-text="authInfo.age"></span>
         </li>
         <li class="clearfix">
           <span class="fl">手机号</span>
           <span class="fr"v-text="authInfo.phone"></span>
         </li>
          <li class="clearfix" v-if="authInfo.borrow != undefined ">
           <span class="fl">累计借入</span>
           <span class="fr">{{authInfo.borrow}}元</span>
         </li>
       </ul>
        <div class="grey-head" v-if="cardList.length > 0 ">
         银行卡信息
       </div>
       <ul class="info-deail" v-for="(item,index) in cardList" :key="index">
         <li class="clearfix">
           <span class="fl">银行</span>
           <span class="fr" v-text="item.bank"></span>
         </li>
         <li class="clearfix">
           <span class="fl">银行卡</span>
           <span class="fr" v-text="item.cardnum"></span>
         </li>
          <!-- <li class="clearfix">
           <span class="fl">卡类型</span>
           <span class="fr" v-text="item.age"></span>
                   </li> -->
         <li class="clearfix">
           <span class="fl">预留手机号</span>
           <span class="fr"v-text="item.phone"></span>
         </li>
       </ul>
       <van-loading type="gradient-circle" v-if="loading" color="black" />
    </div>   
</template>
<script>
    //本组件路由需要传递三个参数，total总共还款金额，overdue逾期金额没有就是0，id，多个的id用-拼接
    import Vue from'vue'
    import { Button ,Toast,Loading} from 'vant';
    Vue.component(Button.name, Button);
    Vue.component(Loading.name, Loading);
    import PickerRate from '../../components/PickerRate';
    import PasswordInput from '../../components/PasswordInput'
    import dialogPage from '../../components/LoanDialog'
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'creditForm',
        data () {
            return {
               authInfo:{
                name:'',
                age:'',
                sex:'',
                phone:''
               },
               cardList:[],
               loading:true
            }
        },
        methods : {
          
                
        },
        created (){
           document.title="认证信息";
        },   
        mounted () {
          let that = this;
          let id = that.$route.query.id ? that.$route.query.id:'';
           myFetch({platform:that.$route.query.platform,id:id},'credit/credit-user-info',function(data){
              if(data.code == 0){
               that.authInfo = data.data;
               that.cardList= data.data.cardlist;
               that.loading = false;
              }else if(data.code == '200004'){
                that.authInfo.name = that.$route.query.name;
                that.authInfo.age = that.$route.query.age;
                that.authInfo.sex = that.$route.query.sex;
                that.authInfo.phone = that.$route.query.phone;
                that.authInfo.platform_name = that.$route.query.platformName;
              }else{
                Toast(data.message);
              }
         
          })
        },
    }
</script>
<style lang="less" scoped>
    @import './creditDetail.less';
</style>