<template>
    <div class="listWrap">
       <ul class="tabHead clearfix">
        <li @click="Tab(1)" :class="{active:active == 1}">
               <span>全部待还</span>
               <span class="money">{{topData.amount_no_all}}</span>
               <i></i>
           </li>
           <li @click="Tab(0)" :class="{active:active == 0}">
               <span>今日待还</span>
               <span class="money">{{topData.amount_no_1}}</span>
               <i></i>
           </li>
           <li @click="Tab(2)" :class="{active:active == 2}">
               <span>7天待还</span>
               <span class="money">{{topData.amount_no_7}}</span>
               <i></i>
           </li>
           <li @click="Tab(3)" :class="{active:active == 3}">
               <span>逾期待还</span>
               <span class="money">{{topData.amount_no_overdue}}</span>
               <i></i>
           </li>
       </ul>
      <!--  <div class="num">
          <span>全部待还(元)</span>
          <span class="big">{{accountList.total_money}}</span>
          <span>共{{accountList.total}}单</span>
      </div> -->
       <div class="search">
           <div class="inputWrap">
               <input type="text" placeholder="搜索姓名" v-model = "postData.name" @input="intelValid">
               <img src="../../images/search.png" alt="">
           </div>
       </div>
       <div class="accountList">
           <ul class="">
               <li v-for="(item,index) in accountListL " :key="index">
                   <a href="javascript:;">
                      <div class="choiceImg" :class="{active:choiceIdex== index}" @click="choice(index,item.total_repay_money,item.id)">
                          <span class="choice"></span>
                      </div>
                       <div class="con">
                           <p>{{item.total_repay_money}}</p>
                           <div class="text">
                               <span class="serial">{{index > 8 ? (index+1):'0'+(index+1)}}</span>
                               {{item.loan_user_name}}-{{item.loan_for}}
                           </div>
                       </div>
                       <div class="right" @click="detailNew(item.id)">
                           <div class="inline-con" :class="{today:item.surplus_days == '今日到期'}">
                                <span :class="{red:item.surplus_state=='3'}">{{item.surplus_days}}</span>
                               <span v-if="item.state_code=='5' " class="orange">线下还款确认中</span>
                           </div>
                           <img src="../../images/accountMore.png" alt="">
                       </div>
                   </a>
               </li>
           </ul>
           <div class="data-tips" v-if="accountListL.length >0">
               <img class="alarmImg" src="../../images/alarm.png" alt="">
               <span @click="more">{{moreInfo}}</span>
           </div>
            <div class="no-data" v-if="accountListL.length == 0">
               <span>暂无数据</span>
           </div>
        </div>
        <div class="bottom">
            <div class="payWrap clearfix">
                <div class="money">
                    待还款<span class="blue">{{payMoney}}</span>元
                </div>
                <a class="payA" href="javascript:;" @click="goPay">还款</a>
            </div>
        </div>
       <action-sheet :tranShowFlag="tranShowFlag" @displayN="displayN" @postPrama="postPrama"></action-sheet>
    </div>
</template>
<script>
    import { Tab, Tabs,Toast } from 'vant';
    import Vue from 'vue';
    import onPay from './onPay/onPay';
    import configs from '../../common/commonService'
    import ActionSheet from '../../components/NewActionSheet'
    import ChartPage from '../../components/chart'
    const {myFetch ,host} =configs;
    Vue.component(Tab.name, Tab);
    Vue.component(Tabs.name, Tabs);

    const type = {
        '0':'1',
        '1':'',
        '2':'7',
        '3':'-1'
    };
    const wenzi = /[\u4e00-\u9fa5]+/;
    export default {
        data () {
            return {
                active:1,
                choiceIdex:-1,
                tranShowFlag:false,//还款操作
                /*user_type:this.$route.params.id,*/
                id:'',//选中的id
                userType:this.$route.params.id,
                topData : {},//页面头部数据
                accountList:{},
                accountListL:[],
                postData : {//点击tab提交的参数
                    user_type:this.$route.params.id,
                    page:0,
                    days:'',
                    name:''
                },
                payMoney:0,
                name:'',
                moreInfo:'点击查看更多',
                pageNum:0,
                page_size:10,
            }
        },
        methods : {
            getDatas () {
                let user_type = this.postData.user_type;
                let that = this;
                myFetch({user_type:user_type},'api/web/order/account',(res)=>{
                   if(res.code ==0){
                     that.topData = res.data;
                 }else{
                    Toast(res.message);
                 }
                });
            },
           Tab(index,e) {
                this.choiceIdex = -1;
                this.payMoney = 0;
                let ev = e || window.event;
                if(ev.srcElement.nodeName =='SPAN'){//判断是不是点击的tab,设置请求的day
                    this.postData.name='';
                }
                this.active = index;
                this.postData.days = type[index];
                this.postData.page = 0;
                this.getAccountList(this.postData);
   
           },
           choice(index,payMoney,orderId){
                let that = this;
                that.choiceIdex = index;
                that.payMoney = payMoney;
                that.id = orderId;
           },

           getAccountList (obj) {
                let that = this;
                myFetch(obj,'api/web/order/account-list',(res) =>{
                    if(res.code == 0){
                        that.accountList = res.data;
                        that.accountListL =res.data.list;
                        that.pageNum = Math.floor((res.data.total-1)/that.page_size) <0?0: Math.floor((res.data.total-1)/that.page_size);
                        that.postData.page >= that.pageNum?that.moreInfo="没有更多了":that.moreInfo="点击查看更多";
                    }else{
                        Toast(res.message)
                    }
                })
           },
           more () {
                let that = this;
                this.postData.page ++;
                if(this.postData.page > this.pageNum){
                    this.moreInfo = "没有更多了";
                    return
                }else{
                    myFetch(this.postData,'api/web/order/account-list',(res) =>{
                        if(res.code == 0){
                            that.accountListL.push(...res.data.list);
                            this.postData.page == this.pageNum ? this.moreInfo = "没有更多了":this.moreInfo = "点击查看更多";
                        }else{
                            Toast(res.message)
                        }
                    })
                }
           },
           search(){

           },
           intelValid () {//清除空格
                this.postData.name = this.postData.name.replace(/\s+/g,"");
                let timer = null,that = this;
                if(this.postData.name.length==0){
                    let _this = this;
                    this.postData.page = 0;
                    this.getAccountList (this.postData);
                }else{
                    if(this.postData.name.length>10){
                         Toast('请输入文字,并且不超过10个字符');
                         return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        that.getAccountList (that.postData);
                    },500)
                }

            },
            displayN () {
                this.tranShowFlag=false;
            },
            goPay() {
                if(this.payMoney == 0){
                    Toast("请选择还款金额！");
                }else{
                   this.tranShowFlag = true; 
                }
                
            },
            postPrama () {
                this.$router.history.push({path:'/insure',query: {total: this.payMoney,overdue:0, id:this.id}});
            },
            detailNew (orderId){
                this.$router.history.push({name:'gatherDetailNew',query:{id:orderId,userType:this.userType}});
            }

            
        },
        computed : {
            setTxt () {
                let id = this.$route.params.id;
                if(id=='2'){
                    this.isPayTxt = '待还';
                    this.postData.user_type = '2';

                }else{
                    this.isPayTxt = '待收';
                    this.postData.user_type = '1';
                }
            },
           
        },
        created () {
            /*this.setTxt;*/
            /*this.getDatas;*/
            /*let _this = this;
            this.listGetData (this.postData);*/
            document.title="待还金额";

        },
        mounted () {
            this.getDatas();
            this.getAccountList(this.postData);
        },
        components : {
            onPay,
            ActionSheet,
            ChartPage,
        }
    }
</script>
<style lang="less" scoped>
    @import '../../css/base';
    @orange-color:#ff9f2d;
    @red-color:#f03232;
    @green-color:#76da74;
    @blue-a:#387bee;
    .clearfix{
      display: block;
      &:before{
        display: block;
        clear: both;
        content: '';
      }
      &:after{
        display: block;
        clear: both;
        content: '';
      }
    }
    .listWrap{
        background: #fff;
        box-sizing: border-box;
        font-size:30px;
        color:#858E9E;
        height: 100%;
        overflow-y: hidden;
    }
    .listWrap *{
        box-sizing: border-box;
    }
    .tabHead{
        display: block;
        padding:0 30px;
        box-shadow: 0 0 4px rgba(187, 187, 187, 0.3);
        margin-bottom: 40px;
       /*  height:100px;
       line-height: 100px; */

        li{
            float: left;
            width:25%;
            padding:24px 0;
            position: relative;
            span{
                display: block;
                text-align: center;
                &.money{
                    display: block;
                    font-size: 26px;
                    color: #252633;
                    text-align: center;
                }
            }
            &.active{
                span{
                    color: #4D7BFF;
                    &.money{
                        color: #4D7BFF;
                    }
                }
            }
        }
        .active{
            color:#252633;
            i{
                display: block;
                position:absolute;
                bottom:0;
                /* width:100px; */
                width:90%;
                height:5px;
                background: #4D7BFF;
                border-radius: 3px;
                left:2%;
                right:2%;
            }
        }
    }
    .num{
        padding:40px 0;
        span{
            display: block;
            text-align: center;
            &.big{
                font-size:72px;
                color:#252633;
                padding:10px 0;
            }
        }
    }
    .search{
        display: block;
        padding:0 30px;
        .inputWrap{
            display: block;
            width:100%;
            height:80px;
            background: #F6F6F6;
            border-radius:5px;
            position: relative;
            input{
                width:100%;
                height:80px;
                display: block;
                background: #F6F6F6;
                border-radius:5px;
                padding:0 20px 0 100px;
            }
            img{
                display:block;
                width:30px;
                height:30px;
                position:absolute;
                top:25px;
                left:30px;
            }
        }
    }
    .accountList{
        /* height:580px; */
        height:calc(~"100% - 380px");
        overflow-y: auto;
        padding:0 30px;
        /* z-index: 1;  */
        a{
            color:#858E9E;
            font-size:28px;
            display: table;
            width:100%;
            padding:36px 0;
            border-bottom: 1PX solid #E6E6E6; 
            .choiceImg{
                display: table-cell;
                vertical-align: middle;
                width:9%;
            }
            .con{
                display: table-cell;
                vertical-align: middle;
            }
            .right{
                display: table-cell;
                vertical-align: middle;
                position: relative;
                text-align: right;
                img{
                    display: inline-block;
                    width:13px;
                    height: 22px;
                    vertical-align: middle;
                    margin-left: 18px;
                }
            }
        }
        .inline-con{
            display: inline-block;
            vertical-align: middle;
            &.today{
                color: #FEBC3D;
            }
            span{
                display: block;
            }
        }
        .red{
            color:#FE6065;
        }
        .orange{
            color: #FEBC3D;
        }
        .choice{
            display: block;
            width:40px;
            height: 40px;
            background: url('../../images/choice.png') no-repeat center center;
            background-size: cover;
        }
        .active{
            .choice{
                background: url('../../images/choice-blue.png') no-repeat center center;
                background-size: cover;
            }
        }
        .con{
            font-size:24px;
            p{
                font-size: 36px;
                color:#252633;
                padding-bottom: 4px;
            }
            .serial{
                display: inline-block;
                vertical-align: middle;
                padding:1PX 6px;
                background: #F6F6F6;
                border-radius:2px;
            }
        }
    }
    .data-tips{
        display: block;
        text-align: center;
        font-size:24px;
        color:#9DA5B3;
        padding:28px 0;
        .alarmImg{
            display: inline-block;
            width:21px;
            height:24px;
        }
    }
    .bottom{
        display: block;
        width:100%;
        position: fixed;
        bottom:0;
        left:0;
        font-size:30px;
        color:#858E9E;
        box-shadow: 0 0 4px rgba(187, 187, 187, 0.3);
        /* z-index:10; */
        background: #fff;
        .blue{
            color:#4D7BFF;
        }
        .payWrap{
            display: block;
            width: 100%;
            height:100px;
        }
        .money{
            display: inline-block;
            vertical-align: middle;
            padding-left: 30px;
            height:100px;
            line-height: 100px;
        }
        .payA{
            display: inline-block;
            float: right;
            background: #4D7BFF;
            font-size: 36px;
            color: #fff;
            text-align: center;
            width:298px;
            height:100px;
            line-height: 100px;
        }
    }
    .no-data{
        display: block;
        text-align: center;
        padding:100px 0;
    }
    /* @media (min-width: 415px) and (max-width: 512px) {
       .accountList{
        height:420px;
       }
    }
     @media (min-width: 513px) and (max-width: 767px) {
       .accountList{
        height:360px;
       }
       }
       @media (min-width: 768px) {
       .accountList{
        height:300px;
       }
       }
    @media (min-height: 800px) and (max-height: 839px){
       .accountList{
        height:60%;
       }
    }
    @media (min-height: 940px) and (max-height: 1000px){
       .accountList{
        height:800px;
       }
    }
    @media (min-height: 1001px){
       .accountList{
        height:840px;
       }
    } */
</style>
