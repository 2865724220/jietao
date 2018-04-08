<template>
    <div id="con" ref='box' >
            <ul class="list">
                <li class="list-detail" v-for='item in data'>
                    <div class="top">
                        <div class="top-l">
                            <i><img :src="item.loan_headimgurl?item.loan_headimgurl:'../../images/user.png'"></i>
                            <p>
                                <span class="l-name" v-if='type==2'>{{item.loan_user_name}}</span>
                                <span class="l-name" v-if='type==1'>{{item.borrow_user_name}}</span>
                                <span class="l-desp">
                                    {{item.surplus_days}}
                                </span>
                            </p>
                            <p>
                                <button class="orangeBtn" v-if='type==2'>出借人</button>
                                <button class="orangeBtn" v-if='type==1'>借款人</button>
                            </p>
                        </div>
                        <p class="top-r"><button class="checkedBtn" v-if='item.state=="支付中"'>{{item.state}}</button><button class="uncheckedBtn" v-if='item.state=="待确认"' @click='comfrim(item.id,type)'>{{item.state}}</button></p>
                    </div>
                    <div class="bottom">
                        <p class="bt-l">
                            <span >{{item.loan_money}}元</span>
                            <span class="hui">借款金额</span>
                        </p>
                        <p class="bt-c">
                            <span class="">{{item.loan_days}}</span>
                            <span class="hui">借款时长</span>
                        </p>
                        <p class="bt-r">
                            <span class="rota">{{item.annual_rate}}%</span>
                            <span class="hui">年利率</span>
                        </p>
                    </div>
                </li>
            </ul>
    </div>

</template>
<script>
    export default {
        name:'none',
        data () {
            return {
                num: 10, // 一页显示多少条
                totalPages:0,
                listdata: [], // 下拉更新数据存放数组
                scrollData: {
                    noFlag: false //暂无更多数据显示
                },
                postData : {
                    user_type:2,
                    page:0,
                    days:'',
                    name:''
                }
            }
        },
        mounted (){
            
        },
        props:['data','type'],
        methods:{
           comfrim(id,type){
                this.$router.push({name:'generationLoan',params:{id:id,type:type}})
            },
        },
        components: {
        }
    }
</script>
<style lang="less" scoped>
    @import './homeCon.less';
</style>