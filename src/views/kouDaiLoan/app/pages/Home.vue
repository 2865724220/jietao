<template>
    <div id="home">
        <dl class="header">
            <dt class="h_l" @click='g(1)'>
                <div class='h-left'>
                    <dd>待收金额</dd>
                   <!-- 去掉 monenyStyle -->
                    <dd class="value">{{data.loan_amount_no?data.loan_amount_no:'0.00'}}元</dd>
                </div>
            </dt>
            <dt class="h_l" @click='gPay(2)'>
                <div class='h-right'>
                    <dd>待还金额</dd>
                    <!-- 去掉 monenyStyle -->
                    <dd class="value">{{data.borrow_amount_no?data.borrow_amount_no:'0.00'}}元</dd>
                </div>
            </dt>
        </dl>
        <div class="tabsHome">
            <van-tabs class="custom-tabwrap" navclass="custom-tabwrap" @click="handleTabClick">
                <van-tab title="待确认借款" class="custom-pane" >
                </van-tab>
                <van-tab title="待确认出借" class="custom-pane" >
                </van-tab>
            </van-tabs>
        </div>
        <div id="con" ref='box'>
            <scroller
                :on-refresh="refresh"
                :on-infinite="infinite"  class='b'  ref='myscroller'>
                    <div v-if='datalist.length==0&&user_type==2' style='text-align:center;margin-top:100px'>
                        <img src='../images/on.png'>
                    </div>
                    <div v-if='datalist.length==0&&user_type==1' style='text-align:center;margin-top:100px'>
                        <img src='../images/on.png'>
                    </div>
                    <ul class="list" v-if='datalist.length>0'>
                        <li class="list-detail" v-for='(item,k) in datalist' :key="k">
                            <div class="top" @click='comfrim(item.id,user_type,item.state_code)'>
                                <div class="top-l">
                                    <i>
                                        <img v-if='user_type==1' :src="item.borrow_headimgurl?item.borrow_headimgurl:require('../images/user.png')" >
                                        <img v-if='user_type==2 &&item.state_code==10' :src="item.borrow_headimgurl?item.borrow_headimgurl:require('../images/user.png')" >
                                        <img v-if='user_type==2 &&item.state_code==11' :src="item.loan_headimgurl?item.loan_headimgurl:require('../images/user.png')" >
	                                    <img v-if='user_type==2 &&item.state_code==8' :src="item.loan_headimgurl?item.loan_headimgurl:require('../images/user.png')" >
	                                    <img v-if='user_type==2 &&item.state_code==1' :src="item.loan_headimgurl?item.loan_headimgurl:require('../images/user.png')" >

                                    </i>
                                    <p>
                                        <span class="l-name" v-if='user_type==2'>{{item.state_code == '10'? item.borrow_user_name:item.loan_user_name}}</span>
                                        <span class="l-name" v-if='user_type==1'>{{item.borrow_user_name}}</span>
                                       <!--  <span class="l-desp">
                                           {{item.surplus_days}}
                                       </span> -->
                                    </p>
                                    <p>
                                        <button class="orangeBtn" v-if='user_type==2'>{{item.state_code == '10'? "借款人":"出借人"}}</button>
                                        <button class="orangeBtn" v-if='user_type==1'>借款人</button>
                                    </p>
                                </div>
                                <p class="top-r"><button :class="item.state=='支付中'?'checkedBtn':'uncheckedBtn'" >{{item.state}}</button></p>
                            </div>
                            <div class="bottom">
                                <p class="bt-l">
                                    <span >{{item.loan_money}}元</span>
                                    <span class="hui">借款金额</span>
                                </p>
                                <p class="bt-c">
                                    <span class="">{{item.total_repay_date}}</span>
                                    <span class="hui">还款日期</span>
                                </p>
                                <p class="bt-r">
                                    <span class="rota">{{item.annual_rate}}%</span>
                                    <span class="hui">年利率</span>
                                </p>
                            </div>
                        </li>
                    </ul>
            </scroller>

        </div>
        <footer id="foot">
            <dl class="foot-l">
                <dt>
                    <dd class="loan" :class="{loanShoose:change}" @click='onTap(1)'></dd>
                </dt>
            </dl>
            <dl class="foot-l">
                <dt>
                    <dd class="loaned" :class="{loanedShoose:change}" @click='onTap(2)'></dd>
                </dt>
            </dl>
            <dl class="foot-l">
                <dt>
                    <dd class="searchCredit" :class="{loanedShoose:change}" @click='onTap(3)'></dd>
                </dt>
            </dl>
        </footer>
        <user-icon></user-icon>
        <div v-show="showMask" class="popBox">
        	<div class="popImg"><img src="../images/systemMaintenance.png" /></div>
        	<div class="popTitle"><div>系统维护中，暂时不能打借条</div><div style="margin-top: 8px;">敬请见谅</div></div>
        	<div @click="popBoxChange" class="popSure">我知道了</div>
        </div>
        <div v-show="showMask" class="popBoxMask"></div>
    </div>

</template>
<script>
    import { Tab, Tabs,Toast} from 'vant'
    import configs from '../common/commonService'
    const {myFetch ,switchErrorMsg} =configs
    import vScroll from  '../components/loading'
    import userIcon from  '../components/user'
    import Vue from 'vue'
    Vue.component(Tab.name, Tab);
    Vue.component(Tabs.name, Tabs);
    export default {
        name:'home',
        data () {
            return {
                change:true,
                dataInfo:true,// 个人信息是否获取
                data :{},// 获取个人信息
                user_type:2,
                borrowId:'',
                page:0,
                is_reg:'',
                pwd:'',
                is_card:'',
                datalist:[],
                datapage:{
                	page_size:'',
            		total:''
                },
                scrollData: {
                    noFlag: false //暂无更多数据显示
                },
                orderListUrl:'api/web/order/order-list',
                homeDataUrl:'api/web/order/home',
                userInfo:'api/web/user/user-info',
                showMask:false
            }
        },
        mounted () {
            this.getData();
            this.getList(0,2);
            this.$nextTick(function(){
                document.querySelector('.no-data-text').style.display='none';
            })
            let sStr= window.location.search;
            let params = {};
            if(sStr && sStr.length > 1){
              sStr = sStr.substring(1, sStr.length);
              var arr = sStr.split('&');
              for(var i = 0; i < arr.length; i++){
                var kv = arr[i].split('=');
                params[kv[0]] = kv[1];
              }
            }
            if(params.jtid && params.type){
               this.$router.push({name:'generationLoan',params:{id:params.jtid,type:params.type}});
                params = {};
                /*console.log(params);
                console.log(params.length);*/
            }


        },
        created (){
             document.title="你我信条";
             this.getUserInfo();
        },
        methods : {
            handleTabClick (index){
                if(index==0){
                    this.user_type=2;
                    this.datalist = [];
                    this.page = 0;
                    this.scrollData.noFlag = false;
                    document.querySelector('.no-data-text').style.display='none';
                    this.getList(0,2);
                }else if(index==1){
                    this.user_type=1;
                    this.datalist = [];
                    this.page = 0;
                    this.scrollData.noFlag = false;
                    document.querySelector('.no-data-text').style.display='none';
                    this.getList(0,1)
                }
            },
            getUserInfo (){
                let that = this;
                myFetch({},that.userInfo,function(data){
                    if(data.code==0){
                        that.pwd = data.data.set_pay_pwd;
                        that.is_card = data.data.id_card;
                    }
                })
            },
            comfrim(id,type,state){
                /*if(state == 8){
                    this.$router.push({name:'generationLoan',params:{id:id,type:type},query:{state:state}});
                }else{
                    this.$router.push({name:'generationLoan',params:{id:id,type:type}})
                }*/
                this.$router.push({name:'generationLoan',params:{id:id,type:type}})
                
            },
            getData (){//获取页面的数据
                let that = this;
                myFetch({},that.homeDataUrl,function(data){
                    if(data.code==0){
                        that.data = data.data;
                        that.is_reg = data.data.is_reg;
                    }else if(data.code==100005){
                        // that.$router.push({name:'register'})
                        that.is_reg = 2;
                    }
                })
            },
            getList (page,user_type,borrowId,fn){//获取借款信息列表
                let that = this;
                myFetch({page:page,user_type:user_type,borrowId:borrowId},that.orderListUrl,function(data){
                    if(data.code==0){
                        if(page==0){
                        	/*console.log(data.data.list);*/
                        that.datalist = data.data.list;
                        if(that.datalist.length==0){
                            document.querySelector('.no-data-text').style.display='none';
                        }else{
                            document.querySelector('.no-data-text').style.display='block';
                        }
                        }else{
                            that.datalist = that.datalist.concat(data.data.list);
                        }
                        that.datapage.page_size = data.data.page_size;
                        that.datapage.total = data.data.total;
                        fn&&fn();
                    }else if(data.code == 100005){
                        /*if(window.location.hostname=='iou-h5.xianjinxia.com'){
                            window.location.href = 'http://ioubak.xianjinxia.com/web/index';
                        }else if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
                            window.location.href = 'http://prod-ioubak.xianjinxia.com/web/index';
                        }*/
                    }else{
                        that.datalist = [];
                        fn&&fn();
                    }

                })
            },
            refresh(done){
                let that = this;
                that.page = 0;
                this.getList(0,that.user_type,done);
                setTimeout(()=>{
                        done();
                    },2000);
                
            },
            infinite(done){
               let that = this,t =  Math.floor(parseInt(that.datapage.total)/parseInt(that.datapage.page_size));
               if(this.page<=t){
                   this.page++;
                   setTimeout(()=>{
                        this.$refs.myscroller.finishInfinite?this.$refs.myscroller.finishInfinite(2):'';
                    },2000);
                   this.getList(that.page,that.user_type,done);
               }else{
                   done(true)
                   return;
               }

            },
            onTap(way){
                if(way==1){
                    // this.change = true;
                   /* if(this.is_reg==2){
                        this.$router.push({name:'register'});
                        return;
                    }*/
                   
                    if(!this.is_card){
                        Toast('请实名绑卡')
                        this.$router.push({name:'certification'});
                        return;
                    }
                    if(this.pwd==2){
                        Toast('请设置交易密码')
                        this.$router.push({name:'traderPsw'});
                        return;
                    }
                    this.$router.push({name:'addBorrow',query:{cliclkFrom:'home'}})
                   //this.showMask = true;
                }
                if(way==2){
                    //  this.change = false;
                   /* if(this.is_reg==2){
                        this.$router.push({name:'register'});
                        return;
                    }*/
                   
                    this.$router.push({name:'addLoan',query:{cliclkFrom:'home'}})
                   //this.showMask = true;
                }
                if(way ==3){
                   // this.change = true;
                    /*if(this.is_reg==2){
                        this.$router.push({name:'register'});
                        return;
                    }*/
                    if(!this.is_card){
                        Toast('请实名绑卡')
                        this.$router.push({name:'certification'});
                        return;
                    }
                    if(this.pwd==2){
                        Toast('请设置交易密码')
                        this.$router.push({name:'traderPsw'});
                        return;
                    }
                    this.$router.push({name:'creditRating'})
                }
            },
            g(way){
               /* if(this.is_reg==2){
                    this.$router.push({name:'register'});
                    return;
                }*/
                this.$router.push({name:'gatheringPageL',params:{id:way}})
            },
            gPay(way){
              /*if(this.is_reg==2){
                    this.$router.push({name:'register'});
                    return;
                }*/
                this.$router.push({name:'gatheringPageB',params:{id:way}})  
            },
            popBoxChange(){
            	this.showMask = false;
            }

        },
        components:{
            vScroll,
            userIcon
        },
        destroyed () {
            /*window.location.search="";*/
            let sStr= window.location.search;
            let params = {};
            if(sStr && sStr.length > 1){
              sStr = sStr.substring(1, sStr.length);
              var arr = sStr.split('&');
              for(var i = 0; i < arr.length; i++){
                var kv = arr[i].split('=');
                params[kv[0]] = kv[1];
              }
            }
            params = {};
        }
    }
</script>

<style lang="less" scoped>
    #home{
        width:100%;
        height:100%;
        background:#f2f2f2;
    }
    .header{
        width:100%;
        height:190px;
        background:#fff;
        margin-bottom:20px;
        color:#fff;
        .h_l{
            float:left;
            width:50%;
            padding-top:25px;
        }
        dd{
            text-align: center;
            font-size:30px;
            color:#fff;
            line-height:40px;
            text-align:left;
        }
        .value{
            line-height: 80px;
            font-size:40px;
            color:#fff;
        }
        .h-left{
            width:90%;
            background:url(../images/left.png) no-repeat 0 0;
            background-size:100% 100%;
            margin-left:8%;
            padding-left:20px;
            padding-top:20px;
        }
        .h-right{
            width:90%;
            background:url(../images/right.png) no-repeat 0 0;
            background-size:100% 100%;
            margin-left:2%;
            padding-left:20px;
            padding-top:20px;
        }
    }
    .tabsHome{
        background:#fff;
        height:auto;
    }
    #foot{
        position: fixed;
        bottom:0;
        left:0;
        width:100%;
        height:130px;
        background:#fff;
        z-index: 900;
        .foot-l{
            margin-top:15px;
            float:left;
            width:33.33%;
            text-align: center;
            height:100%;
            dt{
                height:100%;
            }
            dd{
                height:100%;
            }
            .loan{
                background:url("../images/loanMan.png") no-repeat top center;
                background-size:50%;

            }
            .loaned{
                background:url("../images/loanedMan.png") no-repeat top center;
                background-size:50%;
            }
            .loanShoose{
                background:url("../images/loanMan-red.png") no-repeat top center;
                background-size:50%;

            }
            .loanedShoose{
                background:url("../images/loanedMan-red.png") no-repeat top center;
                background-size:50%;
            }
            .searchCredit{
                background:url("../images/credit-red.png") no-repeat top center;
                background-size: 50%;
            }
        }

    }
*{
  box-sizing: border-box;
}
@red-color:#f03232;
#con{
  height:80%;
  width:100%;
  overflow:hidden;
  img{
      width:300px;
  }
.b{
    position:static;
}
.list{
  width:100%;
  height:auto;
  margin:auto;
  background:#fff;
  .list-detail{
    height:auto;
    padding:20px;
    width:100%;
    overflow: hidden;
    border-bottom:1PX solid #ccc;
    margin-top:15px;
  }
  .top{
    height:auto;
    overflow: hidden;
  }
  .top-l{
    float: left;
    i{
      float: left;
      width:70px;
      height:70px;
      img{
        width:100%;
        border-radius:50%;
      }
    }
    p{
      float:left;
      margin-left:30px;
      .l-name,.l-desp{
        display: block;
        text-align: left;
      }
      .l-name{
        font-size:42px;
        max-width:140px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .l-desp{
        font-size:22px;
        color:#999;
      }
    }
  }
  .top-r{
    float:right;
    margin-right:10px;

  }
  .bottom{
    width:100%;
    margin-top:20px;
    .hui{
      color:#999;
    }
    .bt-l,.bt-c{
      width:33%;
      float:left;
      span{
        display: block;
        font-size:30px;
        text-align: left;
      }
    }
    .bt-c{
      span{
        text-align: center;
        font-size: 30px;
      }
    }
    .bt-r{
      width:30%;
      float:right;
      margin-right:10px;
      span{
        text-align: right;
        display: block;
        font-size:26px;
      }
      .rota{
        font-size:34px;
        color:@red-color;
      }
    }
  }
}
}
.popBox{
	position: absolute;
	left: 15%;
	top: 30%;
	z-index: 9999999;
	width: 70%;
	background:#fff;
	border-radius: 14px;
	text-align: center;
	padding-top: 10px ;
}
.popImg{
	width: 100%;
	padding: 16px 0 20px;
}
.popImg img{
	width: 90px;
}
.popTitle{
	font-size: 30px;
	font-family:PingFang-SC-Medium;
	color:rgba(83,83,83,1);
	padding-bottom: 26px;
	border-bottom: 1px solid #e6e6e6;
}
.popSure{
	font-size: 34px;
	font-family:PingFangSC-Medium;
	color:rgba(77,123,255,1);
	line-height:36px;
	margin: 20px 0;
}
.popBoxMask{
	position:absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background:#000;
	opacity: .5;
	z-index: 999999;
}
@media (min-width: 413px) {
    #foot .foot-l{
        margin-top:4px;
    }
    #foot .foot-l .loanShoose{
        background:url("../images/loanMan-red.png") no-repeat top center;
        background-size:contain;
    }
    #foot .foot-l .loanedShoose{
        background:url("../images/loanedMan-red.png") no-repeat top center;
        background-size:contain;
    }
    #foot .foot-l .searchCredit{
        background:url("../images/credit-red.png") no-repeat top center;
        background-size:contain;
    }
}
</style>
