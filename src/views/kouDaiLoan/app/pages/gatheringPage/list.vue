<template>
    <div id="gatherPage">
        <div class="tabsList">
            <van-tabs class="custom-tabwrap" navclass="custom-tabwrap" @click="handleTabClick" >
                <van-tab :title="`今日${isPayTxt}`" class="custom-pane">
                </van-tab>
                <van-tab :title="`全部${isPayTxt}`" class="custom-pane">
                </van-tab>
                <van-tab :title="`7天${isPayTxt}`" class="custom-pane">
                </van-tab>
                <van-tab :title="`逾期${isPayTxt}`" class="custom-pane">
                </van-tab>
            </van-tabs>
          
            <div class="ser">
                <input class= "ser-in" type="text" maxlength="10" @input="intelValid" placeholder="搜索姓名" v-model="postData.name">
                <img src="../../images/serIcon.png" class="ser-img"  @click="onSearch">
                <img src="../../images/closed.png"  class="ser-icon" @click="onclosed" >
            </div>
            <div class="tabmoney-wrap">
               <span class="num">金额</span>
               <span class="tabmoney">{{currentMoney}}</span>
            </div>
            <div :class="{outAre:isPayTxt=='待还',outAreBig:isPayTxt!='待还'}">
                <scroller class="b" :on-refresh="onRefresh" :on-infinite="onInfinite" ref='myscroller'>
                    <on-pay :detailCon="detailCon" :postData="postData" @backTotal="backTotal"></on-pay>
                </scroller>
            </div>
        </div>
        <div class="foot"  v-if="isPayTxt=='待还'">
            <div class="footer">
                <p class="f-l">待还款<span class="font-red">{{allMoney | zeroDot }}</span>元</p>
                <p class="f-r">
                    <button @click = "huanKuan">还款</button>
                </p>
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
                isPayTxt:'',//显示待收还是待还
                index:'0', //tab点击的索引
                allMoney:'0',//选中的钱
                overdue:0,//是否有逾期费
                id:'',//选中的id
                dataChart:[],
                currentMoney:'',
                tranShowFlag:false,//还款操作
                isRen:true,//判断是否实名认证
                postData : {//点击tab提交的参数
                    user_type:1,
                    page:0,
                    days:'1',
                    name:''
                },
                detailCon :[],//子组件详细数据
                isNone:false,//子组件是否有数据
                topData : {},//页面头部数据

                num: 10, // 一页显示多少条
                totalPages:0
            }
        },
        methods : {
            huanKuan () {
                if (!this.isRen) {
                    Toast('您还未实名认证，请先认证');
                    this.$router.push({path:'/certification'})
                }else if(this.allMoney !='0'){
                    this.tranShowFlag=true;
                }else{
                    Toast('请选择还款金额');
                }
            },
            displayN () {
                this.tranShowFlag=false;
            },
            onclosed() {
                let _this = this;
                this.postData.page = 0;
                this.postData.name = '';
                this.listGetData (this.postData);
            },
            getData (obj,url,callback) {
                let _this = this;
                myFetch(obj,url,(res)=>{
                    if(res.code=='0'){
                        callback(res)
                    }
                    // else if (res.code=='100005') {
                    //     let str = encodeURIComponent(host+'#'+this.$router.history.current.path)
                    //     window.location.href = `http://iou.sudaichaoren.com/web/auth-login?back_url=${str}`;
                    // }
                    else{
                        Toast(res.message)
                    }
                })
            },
            listGetData (obj) {
                let _this = this;
                this.getData(obj,'api/web/order/account-list',(res)=>{
                    let lis = res.data.list;
                    this.currentMoney = res.data.total_money;
                    this.allMoney = 0;
                    _this.detailCon=lis ;
                    if(lis.length<1){
                        this.$el.querySelector('.no-data-text').style.display = 'none';
                        this.isNone=true;

                    }else{
                        this.$el.querySelector('.no-data-text').style.display = 'block';
                        this.isNone=false;
                        let total = res.data.total;
                        _this.totalPages =  Math.floor(total/10);
                    }

                })
            },
            handleTabClick (index,e) {
                let ev = e || window.event;
                if(ev.srcElement.nodeName =='DIV'){//判断是不是点击的tab,设置请求的day
                    this.postData.name=''
                }
                this.index = index;
                this.postData.days = type[this.index];//3  7  yuqi  或者全部
                this.postData.page = 0;  //设置默认点击请求第一页
                let obj = this.postData;
                this.listGetData (obj)
            },
            onRefresh(done) {
                let _this = this;
                this.postData.page = 0;
                this.listGetData (this.postData);
                done();

            },
            onInfinite(done){
                let _this = this;
                if(this.postData.page+1>this.totalPages){
                    setTimeout(()=>{
                        this.$refs.myscroller.finishInfinite(2);
                    });
                    return;
               }else{
                    this.postData.page++;
                   _this.getData(this.postData,'api/web/order/account-list',(res)=>{
                       let total = res.data.total;
                       //_this.totalPages =  Math.floor(total/10);
                       _this.detailCon.push(...res.data.list);
                       done();
                       if(this.postData.page+1>_this.totalPages){
                           _this.$refs.myscroller.finishInfinite(2);
                       }
                   })
               }


            },

            postPrama () {
                this.$router.history.push({path:'/insure',query: {total: this.allMoney,overdue:0, id:this.id}});
            },
            intelValid () {//清楚空格
                this.postData.name = this.postData.name.replace(/\s+/g,"");
                let timer = null,that = this;
                if(this.postData.name.length==0){
                    let _this = this;
                    this.postData.page = 0;
                    this.listGetData (this.postData);
                }else{
                    if(this.postData.name.length>10){
                         Toast('请输入文字,并且不超过10个字符');
                         return;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        that.listGetData (that.postData);
                    },500)
                }

            },
            onSearch () {
                let flag = wenzi.test(this.postData.name);
                if(flag && this.postData.name.length<=10){
                    this.handleTabClick(this.index);
                }else{
                    Toast('请输入文字,并且不超过10个字符');
                }

            },
            backTotal (m,id,yuqifee) {
                this.allMoney = m;
                this.id = id;
                /*this.overdue= yuqifee;*/
                this.overdue= 0;

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
            getDatas () {
                let {user_type} = this.postData;
                let obj = {user_type};
                let _this = this;
                this.getData(obj,'api/web/order/account',(res)=>{
                    _this.topData = res.data;
                });
            }
        },
        created () {
            this.setTxt;
            this.getDatas;
            let _this = this;
            this.listGetData (this.postData);
            document.title="待收金额";

        },
        mounted () {
            this.$nextTick(function () {
                this.$el.querySelector('.no-data-text').style.display = 'none';
                let _this = this;
                myFetch({},'api/web/user/user-info',res=>{
                    if(res.data.id_card ==""){
                        _this.isRen = false;
                    }
                })
            })
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
    #gatherPage{
        width:100%;
        height:auto;
        background:#fff;
    }
    .ser{
        width:100%;
        margin:auto;
        margin-top:20px;
        overflow: hidden;
        position: relative;
        padding-bottom: 20px;
        /* border-bottom: 1PX solid #ccc; */
        .ser-img{
            position: absolute;
            width:40px;
            height:40px;
            left:50px;
            top:20px;
        }
        .ser-icon{
            position: absolute;
            width:40px;
            height:40px;
            right:50px;
            top:20px;
        }
    }
    .ser-in{
        box-sizing: border-box;
        height:75px;
        width:90%;
        background:#f2f2f2;
        padding-left:80px;
        font-size:30px;
        float: left;
        margin-left:5%;
    }
    .outAre{
        overflow-y: auto;
        height:900px;
    }
    .outAreBig{
        overflow-y: auto;
        height:900px;
    }
    .list-top{
        padding:40px 30px;
        height:auto;
        width:100%;
        padding-bottom:0;
        overflow: hidden;
        .top-r{
            float:right;
            margin-right:20px;
        }
        .top-r{
            width:50%;
        }
        .top-l{
            float:left;
            width:43%;
            li{
                line-height: 60px;
            }
            span {
                font-size:28px;
                margin-right:10px;
            }
            .maney{
                font-size:40px;
                line-height:80px;
            }
            .dot{
                float:left;
                width:30px;
                height:30px;
                border-radius: 8px;
                margin-right:20px;
                margin-top:15px;
            }
            .orange-dot{
                background:@orange-color;
            }
            .blue-dot{
                background:@blue-a;
            }
            .green-dot{
                background:@green-color;
            }
            .red-dot{
                background:@red-color;
            }
        }
    }
    .tabsList{
        clear: both;
    }
    .foot{
        position: fixed;
        z-index: 300;
        width:100%;
        left:0;
        bottom:0;
        height:130px;
        background:#f2f2f2;
    }
    .footer{
        height:110px;
        background:#fff;
        margin-top:20px;
        .f-l{
            float:left;
            width:60%;
            padding-left: 20px;
            .font-red{
                color:@red-color;
                margin:0 10px;
            }
        }
        .f-r{
            float:right;
            width:30%;
            text-align: right;
            height:110px;
            button {
                padding-left:60px;
                padding-right:60px;
                background:@red-color;
                color:#fff;
            };

        }
        p{
            font-size: 36px;
            line-height: 110px;
        }
    }
    .b{
        position:static;
    }

    .tabmoney-wrap{
        padding:32px 0;
        background:#f2f2f2;
        span{
            display: block;
            text-align: center;
            color:#000;
            font-size:36px;
            &.num{
                font-size: 32px;
            }
        }
    }
    @media (min-height: 769px) {
        .outAreBig{
            overflow-y: auto;
            height:1200px;
        }
    }
</style>
