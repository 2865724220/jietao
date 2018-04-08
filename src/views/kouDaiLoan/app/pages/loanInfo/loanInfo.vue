<template>
    <div id="loanInfo" >
        <div class='header'><img src='../../images/loan.png' />借款内容</div>
        <div class='content'>
            <div class='item'><span class='left'>借款人</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>出借人</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>借款金额</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>借款日期</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>还款日期</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>借款利率</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>借款用途</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>补充说明</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>借款协议</span><span class='right'><a href="">点击查看></a></span></div>
            <div class='online'></div>
            <div class='item'><span class='left'>借条编号</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>创建时间</span><span class='right'>13213</span></div>
            <div class='item'><span class='left'>借条状态</span><span class='right'>未生效，待确认</span></div>
            <div class='on'>
                <button class='button' @click='send()'>发送借条给对方</button>
            </div>
            <!-- 弹出框 -->
            <div class='mask' v-show='showDialog1'>
                <div class='pop-content'>
                    <div class='header1'>
                        <img src="../../images/gantanhao.png" alt="">
                    </div>
                    <p>你我信条是为已完成的借贷行为提供电子凭证，请确保你们线下已完成交易。</p>
                    <p class='red'>一旦对方确认借条则立即生效</p>
                    <div class='footer' >
                    <span @click='no()'>不发起</span><span @click='yes()'>发起</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'none',
        data () {
            return {
                showDialog1:false,
            }
        },
        mounted (){
             
        },
        methods:{
            send(){
                this.showDialog1 = true;
            },
            no(){
                this.showDialog1=false;
            },
            yes(){

            }    
        }
    }
</script>
<style lang="less" scoped>
    .header{
        background:#fff;
        line-height:120px;
        padding:0 40px;
        font-size:36px;
        border-bottom:1PX solid #efefef;
        img{
            width:50px;
            vertical-align: middle;
        }
    }
   
   .content{
       padding:20px 0;
       background:#fff;
       .item{
           padding:0 40px;
           font-size:0;
           line-height:70px;
           .left{
               font-size: 32px;
                text-align:left;
                display:inline-block;
                width:40%;
           }
           .right{
               font-size: 32px;
                text-align:right;
                display:inline-block;
                width:60%;
           }
       }
       .online{
           height:20px;
           background:#F2F2F2;
       }
       .button{
            background:#f03232;
            color:#fff;
            font-size:32px;
            height:90px;
            width:100%;
            border-radius:8px;
        }
        .on{
           padding:0 40px; 
        }
   }
   .mask{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.6)
    }
    .pop-content{
        text-align:center;
        background:#fff;
        width:580px;
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        border-radius:12px;
        padding:50px 0;
        padding-bottom:0px;
        .header1{
            img{
                width:120px;
            }
            font-size:36px;
        }
        p{
            margin:50px 0;
            padding:0 50px;
        }
        .footer{
            border-top:1PX solid #efefef;
            line-height: 90px;
            font-size:0;
            span{
                width:50%;
                display: inline-block;
                font-size:34px;
            }
        }
    }
</style>