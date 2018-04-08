<template>
    <div class="loan-agree">
        <p class="title">关于我们-你我信条</p>
        <div class="con">
            <ul>
                <li>
                    <span class="space"></span>
                    你我信条是<!-- 由“杭州融斗信息服务有限公司”推出的 -->国内领先的网络借条管理平台，网络借条是纸质借条的替代品，网络借条可以有效解决纸质借条的空间限制、时间限制、易损毁、身份信息不明确、无过程记录等问题。
                </li>
                <li>
                    <span class="space"></span>
                    你我信条的所有用户都必须进行实名认证，保证借贷双方的身份唯一性和合法性。借款人和出借人双方私下约定借还款时间、借款金额以及借款利率后，都可以主动将借条发给对方确认，对方确认后借条即可生效。
                </li>
                <li>
                    <span class="space"></span>
                    你我信条致力于成为国内领先的互联网金融入口，我们坚信每一个有信用的个人和企业都是创造价值的主体，我们永不放贷，因为总有出借人比我们更能识别借款人的信用！
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        name:'txt',
        data () {
            return {

            }
        }
    }
</script>
<style lang="less" scoped>
    .loan-agree{
        width:100%;
        height:100%;
        background:#fff;
        box-sizing: border-box;
        padding:20px 30px;
        .title{
            line-height: 80px;
            font-size:40px;
            text-align: center;
        }
        .space{
            display: inline-block;
            width:50px;
        }
        .con{
            height:auto;
            margin-top:20px;
            li{
                line-height: 50px;
            }
            .weight{
                line-height: 56px;
                font-weight:bold;
            }
            .ag-img{
                width:40%;
                margin-left:30%;
            }
        }
    }
</style>