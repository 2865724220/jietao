<template>
    <div>
        <!--<van-button type="danger" size="large" class="btn" @click="showFn" :btnTxt="maskShow.btnTxt">{{btnTxt}}</van-button>-->
        <div id="mask" v-if="maskShow.show">
            <div class="con">
                <img v-if="defaultShow && !('msgCon' in maskShow)" src="../images/gantanhao.png">
                <p class="title" v-if="defaultShow && ('title' in maskShow)">{{title}}</p>
                <ul v-if="defaultShow">
                    <li v-text="msgCon"></li>
                    <li style="color:#f03232;margin-top:10px;" v-show="maskShow.btnDoub && !('msgCon' in maskShow)">一旦对方确认借条则立即生效。</li>
                </ul>
                <ul v-if="!defaultShow" style="margin-top:10px;">
                    <li>选择借条支付方式</li>
                    <li class="red" style="color:#999;margin-top:10px;" v-show="maskShow.btnDoub">该借条已逾期，根据协议，您需要向本平台支付逾期费用{{overdue}}元</li>
                </ul>
                <div class="foot-btn" v-show="maskShow.btnDoub">
                    <button class="border" @click="closed" v-text="maskShow.cancel"></button>
                    <button @click="triggerPa" class="red" v-text="maskShow.confirmTxt" :class="{green:greenFlag}"></button>
                </div>
                <div class="foot-btn" v-show="!maskShow.btnDoub">
                    <button class="sizeBtn" @click="closed" v-text="maskShow.cancel"></button>
                </div>
                <span class="closeIcon" @click="closed">
                    <img src="../images/closed.png">
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from'vue'
    import { Button } from 'vant';
    Vue.component(Button.name, Button);
    let txt ='你我信条是为已完成的借贷行为提供电子凭证，请确保你们线下已完成交易。';
    export default {
        data () {
            return {
                btnTxt:'btnTxt' in this.$props.maskShow ? this.$props.maskShow.btnTxt : '发送借条给对方',
                msgCon: '',
                greenFlag:'greenFlag'  in this.$props.maskShow ?  this.$props.maskShow.greenFlag : false,
                btnDoub: 'btnDoub'  in this.$props.maskShow ? this.$props.maskShow.btnDoub : true ,//显示一个按钮
                defaultShow: 'defaultShow' in this.$props.maskShow ? this.$props.maskShow.defaultShow :true,//如果外部传入不显示，否则默认显示
                overdue: 'overdue' in this.$props.maskShow ?  this.$props.maskShow.overdue : 0,
                title:''
            }
        },
        beforeUpdate(){
            this.msgCon = 'msgCon' in this.$props.maskShow ? this.$props.maskShow.msgCon : txt;
            this.title = 'title' in this.$props.maskShow ? this.$props.maskShow.title : '';
        },
        methods : {
            closed (e) { //点击取消
                let ev = e || window.event;
                //console.log(ev.srcElement.nodeName)
                if(ev.srcElement.nodeName=='BUTTON'){//判断点击关闭的是取消按钮还是img叉号
                    this.$emit('closed',this.$props.maskShow.cancel) //点击按钮的txt传回父组件。借款人还款时候需要用
                }else{
                    this.$emit('closed','')
                }
            },
            triggerPa () { // 出发父组件方法
                this.$emit('triggerPa',this.$props.maskShow.confirmTxt)
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.msgCon = 'msgCon' in this.$props.maskShow ? this.$props.maskShow.msgCon : txt;
                this.title = 'title' in this.$props.maskShow ? this.$props.maskShow.title : '';
               let str = this.$props.maskShow.confirmTxt;
               if(str =='微信支付'){
                   this.greenFlag = '123'
               }
            })
        },
        computed : {

        },
        props : {
            maskShow : {
                type: Object,
                default: () => {
                    return {
                        confirmTxt:'发起', //确认文案
                        cancel : '不发起', //取消文案  当只有一个按钮的时候的文案
                        show:false,    //对话框是否显示
                        btnDoub:true , // 是否显示两个按钮
                        defaultShow:true,//只有在使用微信支付对话框的时候值为false
                        msgCon:'' //只显示一条信息的时候传入文案
                    }
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    #mask{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.4);
        z-index:300;
        .title{
            line-height: 80px;
            font-size:36px;
        }
        .con{
            width:85%;
            height:auto;
            background:#fff;
            margin:auto;
            margin-top:35%;
            padding-top:30px;
            text-align: center;
            border-radius: 10px;
            padding-bottom:10px;
            position: relative;
            .closeIcon{
                float:left;
                position: fixed;
                right:80px;
                top:280px;
                width:50px;
                height:50px;
                img{
                    width:100%;
                    height:auto;
                }
            }
            ul{
                padding:30px;
                box-sizing: border-box;
                li{
                    line-height: 55px;
                    font-size: 34px;
                }
            }
            img{
                width:25%;
                height:auto;
            }
        }
    }
    .foot-btn{
        width:100%;
        height:80px;
        border-top:2px solid #ccc;
        background:#fff;
        margin-top:20px;
        .border{
            border-right:1PX solid #ccc;
        }
        .green{
            color:#76da74
        }
        button{
            float:left;
            width:50%;
            line-height: 80px;
            background:#fff;
            font-size: 34px;
        }
        .sizeBtn{
            width:100%;
            text-align: center;
            color:#f03232;
        }
    }
    .btn{
        font-size:36px;
        width: 100%;
        text-align: center;
        display: block;
        margin:auto;
    }
    .van-button--large{
        height:100px;
    }
</style>