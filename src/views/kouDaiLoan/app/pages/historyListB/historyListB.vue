<template>
    <div class="history-list">
       <div class="bgfff" v-if="total > 0">
            <div class="first-title">借款总金额</div>
            <div class="num">{{borrowData.total_money}}元</div>
            <div class="orderNum">单数：{{borrowData.total}}单</div>
            <div class="ser">
                <!-- <input class= "ser-in" type="text" maxlength="10" @input="intelValid" placeholder="搜索">
                <img src="../../images/serIcon.png" class="ser-img"  @click="onSearch">
                <img src="../../images/closed.png"  class="ser-icon" @click="onclosed" > -->
            </div>
       </div>
       <div class="list-con-wrap" v-if="total > 0">
           <div class="list-head">
            <ul class="clearfix">
                <li><span class="red">出借人</span></li>
                <li>借款情况</li>
                <li>状态</li>
            </ul>
            </div>
            <ul class="list-con clearfix">
                <li class="clearfix"  v-for="(item,index) in borrowList" :key="index">
                    <div class="tabCell">
                        <span class="bold">{{item.loan_user_name}}</span>
                        <!-- <span>{{item.loan_user_phone}}</span> -->
                    </div>
                    <div class="tabCell">
                        <span class="bold">{{item.loan_money}}元
                        <!-- /{{item.loan_days}}天 -->
                        </span>
                        <!-- <span>{{item.loan_date}}日起借</span> -->
                    </div>
                    <div class="tabCell">
                      <span :class="{'red':item.state_code == '已逾期'}">{{item.state}}</span>
                      <img src="../../images/overdue.png" v-if="item.yuqi == '1'"/>
                    </div>
                </li>
            </ul>
       </div>
       <div class="more" v-if="borrowList.length > 0" @click="more">{{moreInfo}}</div>
        <div class="nodata">
        暂无数据~
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
        name:'userHistoryList',
        data () {
            return {
               borrowData : {},
               borrowList:[],
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
            more(){
                let that = this;
                let id = that.$route.params.id;
                that.page ++;
                if(that.page > that.pageNum){
                    that.moreInfo = "没有更多数据了~";
                    return
                }else{
                    myFetch({page:that.page,id:id},'order/get-borrow',function(data){
                    if(data.code == 0){
                           that.borrowList.push(...data.data.list);
                           that.page == that.pageNum?that.moreInfo="没有更多数据了~":that.moreInfo="点击查看更多";
                        }
                    })
                }
            }
           
            
        },
       /* props : {
            loanList : {
                type:Array
            }
        },*/
        created () {
            document.title="借入记录";
        },
        mounted () {
            let that = this;
            let id = that.$route.params.id;
            console.log(id);
            myFetch({page:that.page,id:id},'order/get-borrow',data=>{
            	console.log(data);
               if(data.code ==0){
                    that.borrowData = data.data;
                    that.borrowList = data.data.list;
                    that.total = data.data.total;
                    console.log(that.borrowList);
                    if(that.total == '0'){
                    	document.getElementsByClassName('nodata')[0].style.display = 'block';
                    }
                    that.pageNum = Math.floor(data.data.total/that.page_size);
                    that.page == that.pageNum?that.moreInfo="没有更多数据了~":that.moreInfo="点击查看更多";
                }else{
                    Toast(data.message);
                }
            })
        },
        components : {
            PickerRate,
            PasswordInput,
            dialogPage,
        }
    }
</script>
<style lang="less" scoped>
    @import './historyListB.less';
</style>