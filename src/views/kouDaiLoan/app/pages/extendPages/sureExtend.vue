<template>
    <div id="extend">
        <p class="topIcon">
            借条详情
        </p>
        <DetailLoan :getDatas = "getDatas" :loanId="post.order_id"></DetailLoan>
        <p class="loan-list">
            展期记录
        </p>
        <div class="detail-m">
            <p class="top">
                <span>金额</span>
                <span>利率</span>
                <span>展期时间</span>
                <span>状态</span>
            </p>
        </div>
        <div class="refresh">
            <scroller class="b" :on-refresh="onRefresh" :on-infinite="onInfinite" ref='myscroller'>
                <ExtendList :datas="datas" :isS="post.user_type"></ExtendList>
            </scroller>
        </div>

        <div class="btnP" v-if="state" >
            <van-button type="danger" size="large" class="btns" @click="makeSure">确认展期</van-button>
            <p class="btnDel gray" @click="rejectS.show=true">拒绝展期</p>
        </div>
        <div id="mask" v-if="maskLoading">
            <img src="../../images/load.gif" />
            <p>
                请等待
            </p>
        </div>

        <dialog-page :maskShow="confirmS" class="singleBtn" @closed="weixinPay" @triggerPa="weixinPay"></dialog-page>
        <dialog-page :maskShow="rejectS" @closed="rejectS.show=false" @triggerPa="reject"></dialog-page>
        <password-input :isSucess="isSucess" :isDisplay="isDisplay" @tranFn="disnone" @getValue="getValue"></password-input>
    </div>
</template>
<script>
import configs from '../../common/commonService'
import DetailLoan from './loanCon/loanCon';
import ExtendList from './loanCon/extendList';
import PasswordInput from '../../components/PasswordInput'
import dialogPage from '../../components/LoanDialog'
import { Button ,Toast } from 'vant';
import Vue from 'vue';
Vue.component(Button.name, Button);
const {agreeUrl,preventFn,ip} =configs;
    export default{
        name:'sure',
        data () {
            return {
                isSucess:false,
                isDisplay:false,//输入支付密码框默认不显示
                maskLoading:false,
                overduePayType:'',
                overdue_fee:0,//借条是否有逾期费
                state:'',//判断确认展期按钮是否显示
                confirmS:{
                    show:false,
                    btnDoub:true,
                    defaultShow:true,
                    msgCon:'确认展期需支付5元',
                    /*cancel:'扫码支付',*/
                    confirmTxt:'微信支付',
                    greenFlag:true,
                    title:'选择支付方式',
                },
                rejectS:{
                    show:false,
                    btnDoub:true,
                    defaultShow:true,
                    msgCon:'拒绝展期后，展期驳回不再生效',
                    cancel:'取消',
                    confirmTxt:'确认',
                    greenFlag:true,
                    title:'提示'
                },
                loanId:'',
                getDatas:{},
                post : {
                    order_id:this.$route.query.id,
                    page:'0',
                    user_type:'2',//1:待收，2：代还
                },
                datas:[],
                num: 10, // 一页显示多少条
                totalPages:0
            }
        },
        methods:{
            makeSure () {//弹出输入密码
                this.confirmS.show = true;
            },
            disnone(){
                this.rejectS.show = false;
                this.isDisplay = false
            },
            reject(){
                this.rejectS.show = false;
                this.isDisplay = true

            },
            //两种支付逾期费的回调函数，通用
            weixinPay (type) {
                if(type=='微信支付'){
                    this.overduePayType =type//支付方式
                    this.confirmS.show = false;
                    this.maskLoading = true;
                    this.extendFn()
                }else if(type=='扫码支付') {
                    Toast('暂不支持扫码支付')
                }
                else{
                    this.confirmS.show = false;//点击关闭符号，隐藏该对话框
                }

            },
            getValue(v){
                if(v.length==6){
                    let obj = {
                        id:this.loanId,
                        pwd:v
                    }
                    this.api.extendRefuse(obj,res=>{//驳回展期
                        if(res.code=='0'){
                            this.isSucess = true;
                            this.isDisplay = false;
                            this.state ='';
                            let fn = ()=>{
                                this.isSucess = false;
                                this.post.page = 0;
                                return this.listGetData(this.post)
                            }
                            setTimeout(fn,800)
                            Toast('展期已驳回')
                        }else{
                            Toast(res.message)
                        }
                    })
                }

            },
            extendFn () {
                let obj = {
                    id:this.post.order_id,
                    charge_pay_type:this.overduePayType.substr(0,2),
                    type:'2',
                    charge_type:'1',
                    url:`${ip}extend-sure?id=${this.$route.query.id}`
                }
                if(this.overdue_fee>0){
                    this.api.overExtendPay(obj,res=>{
                        if(res.code==0){
                            this.maskLoading = false;
                            window.location.href = res.data.redirect_url;
                        }else{
                            this.maskLoading = false;
                            Toast(res.message)
                        }
                    })
                }else{
                    this.api.servicePay(obj,res=>{
                        if(res.code==0){
                            this.maskLoading = false;
                            this.listGetData(this.post);
                            window.location.href = res.data.redirect_url;

                        }else{
                            this.maskLoading = false;
                            Toast(res.message)
                        }

                    })
                }
            },
            listGetData (obj) {
                let _this = this;
                this.api.extendList(obj,(res)=>{
                    let total = res.data.total;
                    _this.totalPages =  Math.floor(total/10);
                    _this.datas = res.data.list;

                    if(res.data.list.length<1){
                        this.$el.querySelector('.no-data-text').style.display = 'none';

                    }else{
                        this.getExtendId;
                        for(let k =0;k<=res.data.list.length;k++){
                            let flag = Object.values(res.data.list[k]).find(n=>n=='待确认');
                            if(flag){
                                _this.state = "待确认";
                            }
                        }
                        this.$el.querySelector('.no-data-text').style.display = 'block';
                        _this.totalPages =  Math.floor(total/10);
                    }

                })
            },
            onRefresh(done) {
                this.post.page = 0;
                this.listGetData(this.post)
                done()
            },
            onInfinite(done){
                this.post.page++;
                let _this = this;
                if(this.post.page>this.totalPages){
                    this.post.page--;
                    setTimeout(()=>{
                        _this.$refs.myscroller.finishInfinite(2);
                    });
                    return;
               }else{
                   this.api.extendList(this.post,(res)=>{
                       let total = res.data.total;
                       _this.totalPages =  Math.floor(total/10);
                       _this.datas.push(...res.data.list);
                       this.getExtendId;
                       done();
                       if(_this.post.page+1>_this.totalPages){
                           _this.$refs.myscroller.finishInfinite(2);
                           return;
                       }
                   })
               }

            },
        },
        computed : {
            setMsg () {
                if(this.overdue_fee>0){
                    this.confirmS.msgCon = `展期费：5元 ，逾期费：${this.overdue_fee}元`
                }

            },
            getExtendId(){
                this.datas.map(item=>{
                    if(item.state=='待确认'){
                        this.loanId = item.id;
                        this.state = "待确认";//控制确认展期按钮显示不显示
                    }
                })
            }
        },
        created () {
            document.title="你我信条";
        },
        mounted () {
            let obj = {
                id:this.$route.query.id
            };
            let _this = this;
            this.api.getOrderInfo(obj,(res)=>{
                if(res.code=='0'){
                    _this.getDatas = res.data;
                    _this.overdue_fee = res.data.overdue_fee;
                    _this.setMsg
                }else{
                    Toast(res.message);
                }
            });
            this.post.page = 0;
            this.listGetData(this.post)

        },
        components : {
            DetailLoan,
            ExtendList,
            PasswordInput,
            dialogPage,
        },
    }
</script>
<style lang="less" scoped>
    @import './less/extendLess.less';
</style>
