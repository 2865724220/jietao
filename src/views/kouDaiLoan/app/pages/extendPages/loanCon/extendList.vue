<template>
    <div class="list">
        <ul>
            <li v-for="(li,i) in datas" :key="i">
                <span class="graydeep">{{li.loan_money}}元</span>
                <span class="graydeep">{{li.annual_rate}}%</span>
                <span class="graydeep">{{li.repay_date}}</span>
                <span  class="unchecked" v-if="li.state=='待确认'">{{li.state}}</span>
                <span class="green" v-else-if="li.state=='已驳回'">{{li.state}}</span>
                <span class="jiekuanS" v-else>{{li.state}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
//2是借款
//1是出借
    export default{
        name:'list',
        data () {
            return {
                id:''
            }
        },
        methods:{

        },
        props:{
            datas:{
                type:Array,
                default:[]
            },
            isS : {

            }
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
    .list{
        background:#fff;
        ul{
            height:80%;
            li{
                height:100px;
                line-height:100px;
                font-size:28px;
                span{
                    float:left;
                    width:25%;
                    text-align: center;
                    button{
                        line-height: 70px;
                    }
                    .unfn{
                        display: inline-block;
                        width:100%;
                    }
                }
                .unchecked{
                    color:@red-color;
                }
                .jiekuanS{
                    color:#666;
                }
            }
        }
    }
</style>
