<template>
    <div id="loan-con">
        <p class="top">
            <span>借款内容</span>
        </p>
        <ul class="ul-con" style="margin-top:0">
            <li class="li">
                <span class="fl">借款人</span>
                <span class="fr" v-text="getDatas.borrow_user_name"></span>
            </li>
             <li class="li"  v-if="getDatas.hand_write_name_b">
                <span class="fl">借款人签名</span>
                <div class="signWrap fr">
                    <div class="signImg" @click="showSignC(1)" v-if="getDatas.hand_write_name_b && getDatas.hand_write_name_b.length >0">
                        <img :src="getDatas.hand_write_name_b" alt="">
                    </div>
                    <span class="arrow"><img src="../../images/arrowRight.png"></span>
                </div>
            </li>
            <li class="li">
                <span class="fl">出借人</span>
                <span class="fr" v-text="getDatas.loan_user_name"></span>
            </li>
            <li class="li" v-if="getDatas.hand_write_name_l">
                <span class="fl">出借人签名</span>
                <div class="signWrap fr">
                    <div class="signImg" @click="showSignC()" v-if="getDatas.hand_write_name_l && getDatas.hand_write_name_l.length >0">
                        <img :src="getDatas.hand_write_name_l" alt="">
                    </div>
                    <span class="arrow"><img src="../../images/arrowRight.png"></span>
                </div>
            </li>
            <li class="li">
                <span class="fl">借款金额</span>
                <span class="fr" v-text="getDatas.loan_money"></span>
            </li>
           <!--   <li class="li">
              <span class="fl">信用报告</span>
              <span class="fr blue" @click="viewReport(getDatas.borrow_user_id)">点击查看 ></span>
                       </li> -->
            <li class="li">
                <span class="fl">借款日期</span>
                <span class="fr" v-text="getDatas.loan_date"></span>
            </li>
            <li class="li">
                <span class="fl">还款日期</span>
                <span class="fr" v-text="getDatas.total_repay_date"></span>
            </li>
            <li class="li">
                <span class="fl">借款利率</span>
                <span class="fr" v-text="getDatas.annual_rate+'%'"></span>
            </li>
            <li class="li">
                <span class="fl">借款用途</span>
                <span class="fr" v-text="getDatas.loan_for"></span>
            </li>

           <!--  <li class="li">
               <span class="fl">补充说明</span>
               <span class="fr" v-text="getDatas.loan_for_remark"></span>
           </li> -->
            <li class="li">
                <span class="fl">借款协议</span>
                <span class="fr blue" @click="jumpto">点击查看 ></span>
            </li>
        </ul>
        <ul class="ul-con" style="margin-bottom: 10px;">
            <li class="li">
                <span class="fl">借款编号</span>
                <span class="fr" v-text="getDatas.order_no"></span>
            </li>
            <li class="li">
                <span class="fl">创建时间</span>
                <span class="fr" v-text="getDatas.created_time"></span>
            </li>
            <li class="li">
                <span class="fl">借条状态</span>
                <span class="fr red">{{getDatas.state}}</span>
            </li>
        </ul>
        <div class="img-list" v-if="getDatas.pic" >
            <p class="graydeep">图片说明</p>
            <div class='pic'>
                 <img class="img" v-for='(item ,i) in getDatas.pic' :src="item" alt="" :key="i" >
            </div>
        </div>
        <div class="signCanvas" v-if="showSign">
            <div class="signCon" >
                <div class="headCanvas clearfix">
                    <span class="fl">电子签名预览</span>
                    <span class="fr closed" @click="closeCanvas"></span>
                </div>
                <div class="imgSinCon">
                    <img :src="imgSrc" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import configs from '../../common/commonService'
    const {myFetch,switchErrorMsg ,agreeUrl} =configs;
    export default {
        data () {
            return {
                isImg:'',
                getDatas:{},
                url:'',
                showSign:false,
                imgSrc:''
            }
        },
        methods : {
            jumpto(){
                window.location.href=`${agreeUrl}?id=${this.$route.query.id}`;
            },
            viewReport(userId) {
                this.$router.push({name:'creditList',query:{id:userId}});
            },
            showSignC(index){
                this.showSign = true;
                if(index == 1){
                    this.imgSrc  = this.getDatas.hand_write_name_b;
                }else{
                    this.imgSrc  = this.getDatas.hand_write_name_l;
                }
            },
            closeCanvas(){
                this.showSign = false;
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
            myFetch(obj,'api/web/order/order-info',(res)=>{
                /*console.log(this)*/
                if(res.code=='0'){
                    _this.getDatas = res.data;
                    _this.url = res.data.agreement_url;
                }else{
                    Toast(switchErrorMsg(res.message));
                }
            })
        }
    }
</script>
<style lang="less" scoped>
    @import '../generationLoan/generationLoan.less';
    #loan-con{
        height:100%;
        overflow-y: auto;
    }
    .marg{
        margin-top:50px;
    }
    .img-list{
        width:100%;
        height:auto;
        background:#fff;
        padding-left:30px;
        padding-top:10px;
        margin-top: 20px;
        p{
            line-height:60px;
            font-weight: normal;
            font-size: 30px;
        }
    }
    .pic{
        padding-bottom:20px;
        overflow:hidden;

        .img{
            width:30%;
            height:200px;
            overflow:hidden;
            position:relative;
            border:2px solid #fff;
            margin-right:2%;
            img{
                width:100%;
                position: absolute;
                top:50%;
                left: 50%;
                transform:translate(-50%,-50%);
                -webkit-transform:translate(-50%,-50%);
                float:left;
            }
        }
    }
    .signImg{
      display: inline-block;
      vertical-align: middle;
      width:130px;
      height:60px;
      background: #d8d8d8;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .signWrap  .arrow{
      display: inline-block;
      width:34px;
      height: 34px;
      vertical-align: middle;
    }
    .signWrap  .arrow img{
      display: block;
      width:100%;
    }

    .signCon{
      background: #fff;
      border-radius: 8px;
      width:96%;
      margin:0 auto;
    }
    .signCanvas {
        position: fixed;
        left: 0%;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 500;
        padding-top: 30%;
    }
    .headCanvas {
      height:120px;
      line-height: 120px;
      font-size:36px;
      color:#333;
      padding:0 32px;
    }
    .headCanvas .closed{
      width:40px;
      height:40px;
      background: url('../../images/closed.png') no-repeat center center;
      background-size:cover;
      margin:40px 0 0;
    }
    .footSign{
      text-align: center;
    }
    .imgSinCon{
      width:100%;
      height:600px;
      background: #f1f1f1;
    }
    .imgSinCon img{
      display: block;
      width:100%;
      height:100%;
    }
    @media (min-width:500px) and (min-height: 600px){
        .signCanvas{
            padding-top: 3%;
        }
    }
</style>