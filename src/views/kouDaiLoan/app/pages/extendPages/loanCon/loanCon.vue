<template>
    <ul class="loan-detail">
        <li class="li">
            <span class="graydeep">借款人：</span>
            <span v-text="getDatas.borrow_user_name"></span>
        </li>
        <li class="li">
            <span class="graydeep">出借人：</span>
            <span  v-text="getDatas.loan_user_name"></span>
        </li>
        <li class="li">
            <span class="graydeep">借款金额：</span>
            <span  v-text="getDatas.loan_money"></span>
        </li>
        <li class="li">
            <span class="graydeep">借款日期：</span>
            <span v-text="getDatas.loan_date"></span>
        </li>
        <li class="li">
            <span class="graydeep">还款日期：</span>
            <span v-text="getDatas.total_repay_date"></span>
        </li>
        <li class="li">
            <span class="graydeep">借款利率：</span>
            <span v-text="getDatas.annual_rate+'%'"></span>
        </li>
        <li class="li">
            <span class="graydeep">借款用途：</span>
            <span v-text="getDatas.loan_for"></span>
        </li>
        <li class="li">
            <span class="graydeep">借款协议：</span>
            <span class=" blue" @click="jumpto">
                点击查看>
            </span>
        </li>
    </ul>
</template>
<script>
import configs from '../../../common/commonService'
const { agreeUrl} =configs;
    export default{
        name:'page',
        data () {
            return {
                id:''
            }
        },
        methods : {
            jumpto(){
                window.location.href=`${agreeUrl}?id=${this.$props.loanId}`;
            },
        },
        props:{
            getDatas : {
                type:Object
            },
            loanId:{

            }
        }
    }
</script>
<style lang="less" scoped>
.loan-detail{
    width:100%;
    height:auto;
    overflow: hidden;
    padding:20px;
    background:#fff;
}
.li{
    float:left;
    width:50%;
    line-height: 60px;
    font-size:28px;
}
</style>
