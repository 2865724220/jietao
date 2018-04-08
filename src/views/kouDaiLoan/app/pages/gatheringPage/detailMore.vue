<template>
    <div class="detail-m">
        <p class="top">
            <span>还款日期</span>
            <span>还款人姓名</span>
            <span>应还金额</span>
            <span>已还金额</span>
            <span>状态</span>
        </p>
        <!--<p :style="{lineHeight:'60px'}" v-if="datas.length==0">暂无记录</p>-->
        <div class="outAre">
            <scroller class="b" :on-refresh="onRefresh"  ref='myscroller'>
                <ul>
                    <li v-for="(li,i) in datas" :key="i">
                        <span class="graydeep">{{li.total_repay_date}}</span>
                        <span class="graydeep">{{li.borrow_user_name}}</span>
                        <span class="graydeep">{{li.count_total_repay_money}}</span>
                        <span class="graydeep">{{li.true_repay_money}}</span>
                        <span>
                            <button :id="li.id" @click = "moneySure" :class="{uncheckedBtn:chujie, jiekuanS:jiekuan}" v-if="li.state=='待确认'">
                               {{li.state}}
                            </button>
                            <span class="green unfn" v-else>{{li.state}}</span>
                        </span>
                    </li>
                </ul>
            </scroller>
        </div>

        <!--<van-actionsheet v-model="showActive" :actions="actions" cancel-text="取消"/>-->
    </div>
</template>
<script>
    import Vue from 'vue'
    import configs from '../../common/commonService'
    import LoadingPage from '../../components/loading'
    import { Actionsheet } from 'vant';
    Vue.component(Actionsheet.name, Actionsheet);
    const {myFetch} =configs;
    export default {
        namr:'more',
        data () {
            return {
                chujie:'',
                jiekuan:'',
                listId:'',
                showActive:false,
                actions: [
                    {
                        name: '我已线下还款(还需要对方确认)',
                        className:'liS',
                        callback: this.onClick
                    }
                ],
                post : {
                    user_type:'2',//1待还，2待收
                    page:0
                },
                datas:[],
                num: 10, // 一页显示多少条
                totalPages:0
            }
        },
        methods : {
            moneySure (e) {
                let ev= e || window.event;
                let {id} = ev.srcElement;//该借条id
                if(this.chujie =='1'){
                    this.$router.history.push({path:'/pay-money-sure',query: {id: id,isS:this.chujie}})
                }
            },
            onRefresh (done) {
                let _this = this;
                _this.post.page = 0;
                myFetch(_this.post,'api/web/order/repay-list',(res)=>{
                    let total = res.data.total;
                    _this.totalPages =  Math.floor(total/10);
                    /*alert(_this.totalPages)*/
                    _this.datas = res.data.list;
                });

                done(true)
            },
            onInfinite(done){
                this.post.page++;
                 let _this = this;
                 /*alert(this.post.page);*/
                myFetch(_this.post,'api/web/order/repay-list',(res)=>{
                    let total = res.data.total;
                    _this.totalPages =  Math.floor(total/10);
                    _this.datas.push(...res.data.list);
                    done();
                    if(_this.post.page+1>_this.totalPages){
                        _this.$refs.myscroller.finishInfinite(2)
                        return;
                    }
                });
                
            },
        },
        computed : {
            setIspay () {
                let str = this.$route.query.isS;
                if (str =='1') {
                    this.post.user_type = '1';
                    this.chujie = '1';
                    this.jiekuan = ''
                }else if(str =='2') {
                    this.post.user_type = '2';
                    this.chujie = '';
                    this.jiekuan = '2'
                }
            }
        },
        mounted () {
            this.setIspay;
            let _this = this;
            myFetch(_this.post,'api/web/order/repay-list',(res)=>{
                let total = res.data.total;
                _this.totalPages =  Math.floor(total/10);
                _this.datas = res.data.list;
                if(res.data.list.length<1){
                    _this.$el.querySelector('.no-data-text').style.display = 'none';
                }else{
                    _this.$el.querySelector('.no-data-text').style.display = 'block';
                }
            })
        },
        components:{
            LoadingPage,
        }
    }
</script>
<style lang="less" scoped>
    @orange-color:#ff9f2d;
    @orange-bg:#fffaea;
    @red-color:#f03232;
    @red-bg:#ffeaea;
    @gray-bottom:#ccc;
    @gray-color:#b2b2b2;
    @green-color:#76da74;
    @blue-a:#387bee;
    #loading{
        height:50px;
    }
    .detail-m{
        width:100%;
        height:100%;
        background:#fff;
        overflow-y: auto;
        .top{
            /* height:120px; */
            border-bottom: 1PX solid #ccc;
            position: relative;
            z-index: 40;
            display: table;
            width:100%;
            span{
                display: table-cell;
                width:20%;
                /* line-height: 120px; */
                padding: 40px 0;
                text-align: center;
                font-size:28px;
                word-break: break-word;
            }
        }
        ul{
            height:80%;
            padding:20px 0;
            li{
               /*  height:100px;
               line-height:100px; */
                font-size:24px;
                display: table;
                width:100%;
                margin-bottom: 20px;
                span{
                    /* float:left; */
                    display:table-cell;
                    width:20%;
                    text-align: center;
                    word-break: break-word;
                    button{
                        line-height: 70px;
                    }
                    .unfn{
                        display: inline-block;
                        width:100%;
                    }
                }
                .uncheckedBtn{
                    display:inline-block;
                    border:2px solid @red-color;
                    background:#fff;
                    /* width:140px; */
                    padding:0 10px;
                    height:70px;
                    border-radius:10px;
                    font-size:28px;
                    color:@red-color;
                }
                .jiekuanS{
                    border:0;
                    background:#fff;
                    color:#666;
                }
            }
        }
    }
    .b{
        position: relative;
        /* top: 10%; */
        width: 100%;
        background: #fff;
    }
    .outAre{
        overflow-y: auto;
        height:100%;
    }
</style>