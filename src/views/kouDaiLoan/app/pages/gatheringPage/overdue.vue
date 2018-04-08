<template>
    <div class="detail-m">
        <p class="top">
            <span>逾期日期</span>
            <span>逾期金额</span>
            <span>逾期天数</span>
            <span>状态</span>
        </p>
        <ul>
            <li>
                <span class="graydeep">2017-11-02</span>
                <span class="graydeep">还款人</span>
                <span class="graydeep">12000.00</span>
                <span><button class="uncheckedBtn">逾期中</button></span>
            </li>
            <li>
                <span class="graydeep">2017-11-02</span>
                <span class="graydeep">还款人</span>
                <span class="graydeep">12000.00</span>
                <span class="green">已还清</span>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                user_type:''
            }
        },
        computed : {
        },
        mounted () {

        }
    }
</script>
<style lang="less" scoped>
    .detail-m{
        width:100%;
        height:auto;
        background:#fff;
        .top{
            height:90px;
            border-bottom: 1PX solid #ccc;
            span{
                float:left;
                width:25%;
                line-height: 90px;
                text-align: center;

            }
        }
        ul{
            height:auto;
            padding:20px 0;
            li{
                height:90px;
                line-height:90px;
                span{
                    float:left;
                    width:25%;
                    text-align: center;
                    button{
                        line-height: 70px;
                    }
                }
                .uncheckedBtn{
                    display:inline-block;

                }
            }
        }
    }
</style>