<template>
    <div class="history-list">
       <div class="bgfff" v-if="total > 0">
            <div class="first-title">出借总金额</div>
            <div class="num">{{loanData.total_money}}元</div>
            <div class="orderNum">单数：{{loanData.total}}单</div>
            <div class="ser">
               <!--  <input class= "ser-in" type="text" maxlength="10" @input="intelValid" placeholder="搜索">
               <img src="../../images/serIcon.png" class="ser-img"  @click="onSearch">
               <img src="../../images/closed.png"  class="ser-icon" @click="onclosed" > -->
            </div>
       </div>
       <div class="list-con-wrap" v-if="total > 0">
           <div class="list-head">
            <ul class="clearfix">
                <li><span class="red">借款人</span></li>
                <li>借款情况</li>
                <li>状态</li>
            </ul>
            </div>
            <ul class="list-con clearfix">
                <li class="clearfix"  v-for="(item,index) in loanList" :key="index">
                    <div class="tabCell">
                        <span class="bold">{{item.borrow_user_name}}</span>
                        <!-- <span>{{item.borrow_user_phone}}</span> -->
                    </div>
                    <div class="tabCell">
                        <span class="bold">{{item.loan_money}}元
                       <!--  /{{item.loan_days}}天 -->
                        </span>
                       <!--  <span>{{item.loan_date}}日起借</span> -->
                    </div>
                    <div class="tabCell">
                       <span :class="{'red':item.state_code == '已逾期'}">{{item.state}}</span>
                       <img src="../../images/overdue.png" v-if="item.yuqi == '1'"/>
                    </div>
                </li>
            </ul>
           <!--  <van-pull-refresh v-model="isLoading">
            <p>刷新次数: 12</p>
                      </van-pull-refresh>
                      <ul class="test">
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                </ul> -->
       </div>
      <div class="more" v-if="loanList.length > 0" @click="more">{{moreInfo}}</div>
      <div class="nodata">
        暂无数据~
      </div>
    </div>
</template>
<script>
    //本组件路由需要传递三个参数，total总共还款金额，overdue逾期金额没有就是0，id，多个的id用-拼接
    import Vue from'vue'
    import { Button ,Toast , PullRefresh } from 'vant';

    import PickerRate from '../../components/PickerRate';
    import PasswordInput from '../../components/PasswordInput';
    import dialogPage from '../../components/LoanDialog';
    import configs from '../../common/commonService';
    Vue.component(Button.name, Button);
    Vue.component(PullRefresh.name, PullRefresh);

    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'userHistoryList',
        data () {
            return {
               loanData : {},
               loanList:[],
               isLoading:false,
               page:0,
               pageNum:0,
               page_size:10,
               total:0,
               moreInfo:"点击查看更多",
            }
        },
        methods : {
            onSearch (){

            },
            onclosed(){

            },
            getList () {
                /*let id = this.$router.params.id;
                console.log(id);*/
            },
            more(){
                let that = this;
                let id = that.$route.params.id;
                that.page ++;
                if(that.page > that.pageNum){
                    that.moreInfo = "没有更多数据了~";
                    return
                }else{
                    myFetch({page:that.page,id:id},'order/get-loan',function(data){
                    if(data.code == 0){
                           that.loanList.push(...data.data.list);
                           that.page == that.pageNum?that.moreInfo="没有更多数据了~":that.moreInfo="点击查看更多";
                        }
                    })
                }
            }

        },
        created () {
            document.title="借出记录";
        },
        mounted () {
          let that = this;
          let id = that.$route.params.id;
          console.log(id);
          myFetch({page:that.page,id:id},'order/get-loan',data=>{
             if(data.code ==0){
                  that.loanData = data.data;
                  that.loanList = data.data.list;
                  that.total = data.data.total;
                  if(that.total == '0'){
                    	document.getElementsByClassName('nodata')[0].style.display = 'block';
                    }
                  that.pageNum = Math.floor(data.data.total/that.page_size);
                  that.page == that.pageNum?that.moreInfo="没有更多数据了~":that.moreInfo="点击查看更多";
              }else{
                  Toast(data.message);
              }
          });

          that.getList();
        },
        components : {
            PickerRate,
            PasswordInput,
            dialogPage,
            PullRefresh,
        }
    }
</script>
<style lang="less" scoped>
    @import './historyList.less';
</style>
