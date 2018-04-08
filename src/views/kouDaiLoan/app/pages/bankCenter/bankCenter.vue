<template>
    <div class="ban-center" style="height: 100%;">
        <ul>
            <li class="cards" v-for="(li , i) in list" :key="i">
                <div class="c-img">
                    <img :src="li.bank_logo" class="cimg fl">
                    <p  class="fl txt">
                        <span class="p1">{{li.bank_name}}</span>
                        <span class="p2">储蓄卡</span>
                    </p>
                    <button class="fr uncheckedBtn" v-if="list.length>1" @click="unBind(li.card)">解除绑定</button>
                </div>
                <p class="cardCode">{{li.card | bankCard(li.card)}}</p>
            </li>
        </ul>
        <p class="add-bank" @click="addCard">
            <span>添加新卡</span>
            <img src="~assets/kouDaiLoan/app/images/whiteRight.png">
        </p>
        <dialog-page :maskShow="maskShow" @closed="closed" @triggerPa="triggerPa"></dialog-page>
    </div>
</template>
<script>
    import { Toast } from 'vant';
    import configs from '../../common/commonService'
    import dialogPage from '../../components/LoanDialog'
    const {myFetch ,switchErrorMsg} =configs;
    export default {
        name:'bank',
        data () {
            return {
                list:[],
                maskShow:{
                    show:false,
                    btnDoub:true,
                    defaultShow:true,
                    cancel:'不解绑',
                    confirmTxt:'解绑',
                    msgCon:'确认解绑银行卡？'
                },
                card:''
            }
        },
        methods : {
            closed(){
                this.maskShow.show = false;
            },
            unBind (card) {
                this.card = card;
                this.maskShow.show = true;
            },
            triggerPa(){
                let _this = this;
                let card = this.card;
                _this.closed();
                myFetch({card},'api/web/user-card/card-del',res=>{
                    _this.closed();
                    if(res.code=='0'){
                        myFetch({},'api/web/user-card/card-list',res=>{//重新拉取数据
                            if(res.code=='0'){
                                _this.list = res.data;
                            }else{
                                Toast(switchErrorMsg(res.code))
                            }
                        })
                    }else{
                        Toast(switchErrorMsg(res.code))
                    }
                })
            },
            addCard () {
                this.$router.push({path:'/bind-card'})
            }
        },
        computed : {
            getBankList () {
                console.log(12)
                let _this = this;
                myFetch({},'api/web/user-card/card-list',res=>{
                    if(res.code=='0'){
                        _this.list = res.data;
                        _this.isSetPsw = res.data.length>0 ? '1' : '0'
                    }else{
                        Toast(switchErrorMsg(res.code))
                    }
                })
            }
        },
        created () {
            document.title="我的银行卡";
        },
        mounted () {
            this.getBankList;
        },
        components : {
            dialogPage,
        }
    }
</script>
<style lang="less" scoped>
    @import './bankCenter.less';
</style>