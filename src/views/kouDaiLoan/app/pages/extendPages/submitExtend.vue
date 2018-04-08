<template>
    <div id="extend">
        <p class="topIcon">
            借条详情
        </p>
        <input type="hidden" v-model="this.extendNum"/>
        <input type="hidden" v-model="this.hadExtend"/>
        <DetailLoan :getDatas = "getDatas" :loanId="post.order_id"></DetailLoan>
        <div class="tabsList">
            <van-tabs class="custom-tabwrap" :active="active" navclass="custom-tabwrap" @click="handleTabClick" >
                <van-tab title="发起展期" class="custom-pane">
                    <div class="input-ex">
                        <p v-on:click.stop.prevent="pickerDate">
                            <span class="fl graydeep">延后到期日</span>
                            <span class="fr arrow">{{postData.repay_date | dateType}}</span>
                        </p>
                        <p v-on:click.stop.prevent="pickerConfigshow">
                            <span class="fl graydeep">展期利率</span>
                            <span class="fr arrow">{{postData.annual_rate+'%'}}</span>
                        </p>
                    </div>
                    <p class="gray txtp">
                        展期期间，将按该年利率计算利息
                    </p>
                </van-tab>
                <van-tab title="展期记录" class="custom-pane">

                </van-tab>
            </van-tabs>
            <div class="detail-m" v-show="active==1">
                <p class="top">
                    <span>金额</span>
                    <span>利率</span>
                    <span>展期时间</span>
                    <span>状态</span>
                </p>
            </div>
            <div class="refresh" v-show="active==1">
                <scroller class="b" :on-refresh="onRefresh" :on-infinite="onInfinite" ref='myscroller'>
                    <ExtendList :datas="datas" :isS="post.user_type"></ExtendList>
                </scroller>
            </div>
        </div>
        <p class="pbtn">
            <van-button type="danger" size="large" class="btn" @click="maskShow">发起展期</van-button>
        </p>
        <div v-show="showMask" class="popBox">
        	<div class="popTitle" style="padding: 30px 0;font-size: 18px; color: #333333;">您目前只能发起一次展期</div>
        	<div @click="popBoxChangeO" class="popSure">我知道了</div>
        </div>
        
        <div v-show="secondShow" class="popBox">
        	<div class="popTitle" style="font-size: 18px; color: #333333;margin-top: 30px;"><div>已经发起过一次展期</div><div>您暂不能再次发起</div></div>
        	<div @click="popBoxChangeT" class="popSure">我知道了</div>
        </div>
        
        <div v-show="showPopMask" class="popBoxMask"></div>
        <picker-rate :pickerConfig="pickerConfig" @getPickerValue="getPickerValue"></picker-rate>
        <date-picker :dateConfig ="dateConfig" @confirm = "dateShoose"></date-picker>
        <dialog-page :maskShow="confirmS" @closed="closed('confirmS')" @triggerPa="submitEx"></dialog-page>
    </div>
</template>
<script>
import configs from '../../common/commonService'
import PickerRate from '../../components/PickerRate';
import DatePicker from '../../components/DatePicker';
import dialogPage from '../../components/LoanDialog'
import DetailLoan from './loanCon/loanCon';
import ExtendList from './loanCon/extendList';
import { Tab, Tabs,Toast ,Button} from 'vant';
import Vue from 'vue';
Vue.component(Tab.name, Tab);
Vue.component(Tabs.name, Tabs);
Vue.component(Button.name, Button);
const {myFetch,switchErrorMsg ,agreeUrl,preventFn} =configs;
const rateArr = ()=> {
    let arr = [];
    for(let i=0;i<=24;i++){
        arr.push(i)
    }
    return arr
}
    export default{
        name:'submit',
        data () {
            return {
                loanId:this.$route.query.id,
                active:Reflect.has(this.$route.query, 'active')?this.$route.query.active:0,
                disabled:false,
                getDatas:{
                    annual_rate:0
                },
                pickerConfig : {
                    show:false,
                    arrData : rateArr(),
                },
                confirmS:{
                    show:false,
                    btnDoub:true,
                    defaultShow:true,
                    msgCon:'',
                    cancel:'取消',
                    confirmTxt:'确认',
                    greenFlag:true,
                    title:'提交展期'
                },
                dateConfig:{
                    show:false,
                    data:0,
                    order_id:this.$route.query.id,
                },
                postData:{
                    annual_rate:'',
                    repay_date:''
                },
                post : {
                    order_id:this.$route.query.id,
                    page:'0',
                    user_type:'1',//1:待收，2：代还
                },
                datas:[],
                num: 10, // 一页显示多少条
                totalPages:0,
                extendNum:'',
                showMask:false,
                showPopMask:false,
                secondShow:false,
                popNone:0,
                hadExtend:''

            }
        },
        components : {
            PickerRate,DatePicker,DetailLoan,ExtendList,dialogPage,
        },
        computed : {
            setMsg () {
                this.confirmS.msgCon = `展期到${this.postData.repay_date} 利率为 ${this.postData.annual_rate}%`
            },
            setBtn(){
                this.datas.map(item=>{
                    if(item.state=='待确认'){
                        _this.disabled = true;
                    }
                })
            }
        },
        methods : {
            closed(flag){
                this[flag].show = false;
            },
            submitEx(){
                /*if(this.disabled){
                    return ;
                }*/
                this.postData.order_id = this.$route.query.id;
                this.api.extendSave(this.postData,res=>{
                    this.closed('confirmS')
                    if(res.code==0){
                        Toast('发起展期成功');
                        this.post.page = 0;
                        this.listGetData(this.post)
                        this.active = 1;
                        this.disabled = true;
                        this.hadExtend = 1;

                    }else{
                        Toast(res.message);
                    }
                })

            },
            maskShow() {
                /*if(this.disabled){
                    Toast('存在未确认展期，无法发起');
                    return ;
                }*/
               let that = this;
                if(this.extendNum == '0'){
                	that.showMask = true;
                	that.showPopMask = true;
                }
                if(that.hadExtend == '0' && this.extendNum != '0'){
                	that.setMsg
        			that.confirmS.show = true;
                }
                if(that.hadExtend == '1'){
                	that.secondShow = true;
            		that.showPopMask = true;
                }
                
            },
            handleTabClick (index,e) {
                this.active = index;
                console.log(this)
            },
            listGetData (obj) {
                let _this = this;
                this.api.extendList(obj,(res)=>{
                    let total = res.data.total;
                    this.totalPages =  Math.floor(total/10);
                    this.datas = res.data.list;
                    this.hadExtend = res.data.had_extend;
                    if(res.data.list.length<1){
                        this.$el.querySelector('.no-data-text').style.display = 'none';
                    }else{
                        for(let k =0;k<=res.data.list.length;k++){
                            let flag = Object.values(res.data.list[k]).find(n=>n=='待确认');
                            if(flag){
                                _this.disabled = true;
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
                done();
            },
            
            onInfinite(done){
                this.post.page++;
                let _this = this;
                if(this.post.page>this.totalPages){
                    this.post.page--;
                    setTimeout(()=>{
                        this.$refs.myscroller.finishInfinite(2);
                    });
                    return;
               }else{
                   this.api.extendList(this.post,(res)=>{
                       let total = res.data.total;
                       _this.totalPages =  Math.floor(total/10);
                       _this.datas.push(...res.data.list);
                       this.setBtn;
                       done();
                       if(_this.post.page+1>_this.totalPages){
                           _this.$refs.myscroller.finishInfinite(2);
                           return;
                       }
                   })
               }

            },
            getPickerValue (v) {//还款方式回调
                this.postData.annual_rate = v;
            },
            pickerConfigshow () {//显示还款方式列表
                preventFn(this.$el.querySelector('.pickerP'));
                this.pickerConfig.show=true;
            },
            pickerDate() {
                preventFn(this.$el.querySelector('.datePicker'));
                this.dateConfig.show=true;
            },
            dateShoose(v) {
                this.dateConfig.show=false;
                this.postData.repay_date = v;
            },
            popBoxChangeO(){
            	let that = this;
            	this.extendNum = 1;
            	that.showMask = false;
                that.showPopMask = false;
                that.setMsg
        		that.confirmS.show = true;
            },
            popBoxChangeT(){
            	let that = this;
            	that.secondShow = false;
            	that.showPopMask = false;
            	
            	if(that.hadExtend == '1'){
                	that.setMsg
        			that.confirmS.show = false;
                }
            }

        },
        created () {
            document.title="你我信条";
        },
        mounted () {
            /*console.log(window.localStorage)*/
            let obj = {
                id:this.$route.query.id
            };
            let _this = this;
            this.api.getOrderInfo(obj,(res)=>{
            	console.log(res);
                if(res.code=='0'){
                    _this.getDatas = res.data;
                    _this.postData.repay_date = _this.dateConfig.start_date=_this.getDatas.start_date;
                    _this.dateConfig.end_date = _this.getDatas.end_date;
                    _this.getDatas.annual_rate = res.data.annual_rate;
                    _this.postData.annual_rate = res.data.annual_rate;
                    _this.extendNum = res.data.extend_num;
                    _this.hadExtend = res.data.had_extend;
                    window.localStorage.setItem("ANNUALRATE",res.data.annual_rate);
                }else{
                    Toast(res.message);
                }
            });
            this.post.page = 0;
            this.listGetData(this.post)
        },
        destory (){
            window.localStorage.removeItem("ANNUALRATE");
        }
    }
</script>
<style lang="less" scoped>
    @import './less/extendLess.less';
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
</style>
