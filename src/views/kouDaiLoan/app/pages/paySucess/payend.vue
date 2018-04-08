<template>
    <div id="payend" >
        <img v-if="resultTxt !='借条支付失败'" src="../../images/registerSuc.png" alt="">
        <img v-else src="../../images/gantanhao.png" alt="">
        <h3>{{resultTxt}}</h3>
        <div class='check' @click='go()'>查看借条明细</div>
        <div class='return'>{{time}}秒后返回</div>
        <p class='logn-foot'>你我信条--您身边的借条管理专家</p>
    </div>
</template>
<script>
    import Vue from'vue'
    import configs from '../../common/commonService';
    export default {
        name:'none',

        data () {
            return {
                time:2,
                timer:null,
                resultTxt:'',
                overdue:0,
            }
        },
        mounted (){
            let that = this;
            let order_pay_no = this.$route.query.order_pay_no;
            let is_report = this.$route.query.is_report?this.$route.query.is_report:'';
            this.api.queryResult({order_pay_no,is_report},res=>{
                if(res.code==0){
                    let {data,flow,cost_type, total,id,user_id,uri} = res;
                    if(data==1){
                        that.resultTxt = '借条支付成功';
                        // that.$router.push({name: 'shareLoan',params:{id:that.$route.params.id,type:that.$route.params.type}});
                       if(flow=='B') {
                          if(user_id&&uri&&uri =="credit_report"){
                            setTimeout(()=>{
                              that.$router.push({name:'creditList',query:{id:user_id}});
                            },1000);
                            }else{
                               setTimeout(()=>{
                                that.$router.push({name: 'shareLoan',params:{id:that.$route.query.id,type:that.$route.query.type}});
                              },1000);
                            }
                           
                       }else{
                          if(user_id&&uri&&uri =="credit_report"){
                            setTimeout(()=>{
                              that.$router.push({name:'creditList',query:{id:user_id}});
                            },1000);
                          }else{
                            setTimeout(()=>{
                                that.$router.replace({name:'homeApp'})
                            },1000);
                          }
                       }


                    }else{
                        that.resultTxt = '借条支付失败';
                        setTimeout(()=>{
                                that.$router.replace({name:'homeApp'})
                        },1000);
                    }
                    that.timer = setInterval(function(){
                       that.time--;
                       if(that.time<1){
                           clearInterval(that.timer);
                           /*that.$router.replace({name:'homeApp'})*/
                       }
                   },1000)
                }
            })

        },
        methods:{
           go(){
               var that = this;
               clearInterval(that.timer);
               let id = this.$route.query.id;
               if(this.resultTxt != '借条支付失败'){
                   this.$router.push({path:'/gather-loan-con',query:{id:id}})
               }else{
                   this.$router.push({path:`/loan/${id}/2`})
               }

           }
        },
        components:{

        }
    }
</script>
<style lang="less" scoped>
    #payend{
        position: fixed;
        top:0;
        left: 0;
        width:100%;
        height:100%;
        background:#fff;
        text-align:center;
        img{
            margin-top:150px;
            width:120px;
        }
        h3{
            font-size: 34px;
            margin-top:50px;
        }
        .check{
            width:220px;
            display:inline-block;
            line-height:74px;
            height:74px;
            border-radius:12px;
            border:2px solid #D55C33;
            color:#D55C33;
            margin-top:150px;
        }
        .logn-foot{
            position:absolute;
            bottom:50px;
            width:100%;
            left:0;
            color:#666;
        }
        .return {
            margin-top:50px;
        }
    }
</style>
