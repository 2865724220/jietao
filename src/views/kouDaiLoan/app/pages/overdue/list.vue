<template>
    <div id="overdue" >
        <div class='head'>
            <span>逾期日期</span>
            <span>逾期金额</span>
            <span>逾期天数</span>
            <span>状态</span>
        </div>

        <scroller 
            :on-refresh="refresh"
            :on-infinite="infinite" class='box'>
            <div class='content'>
                <div class='item' v-for='item in list'>
                        <span>{{item.overdue_date}}</span>
                        <span>{{item.overdue_interest_money}}</span>
                        <span>{{item.loan_days}}</span>
                        <span class='red'>逾期中</span>
                    </div>
                </div>
        </scroller>
    </div>
</template>
<script>
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg} =configs
    export default {
        name:'none',
        data () {
            return {
                showDialog1:true,
                orderListUrl:'api/web/order/overdue-list',
                page:0,
                list:[],
                total:0,
                page_size:10
            }
        },
        created(){
           this.getdata(); 
        },
        mounted (){
           
        },
        methods:{
            getdata(fn){
                let that = this;
                myFetch({page:that.page,user_type:that.$route.params.type},that.orderListUrl,function(data){console.log(data)
                    if(that.page==0){
                        that.list = data.data.list;
                    }else{
                         that.list = that.list.concat(data.data.list);
                    }
                    that.total = data.data.total;
                    that.page_size = data.data.page_size;
                    fn&&fn();
                })
            },
            refresh(done){  
                this.getdata(done);
            },
            infinite(done){
               let t =  Math.floor(this.total/this.page_size);
               if(this.page<t){
                   this.page++;
                   this.getdata(done);
               }else{
                   done(true)
                   return;
               }
                   
            }
        },
        components:{
            
        }
    }
</script>
<style lang="less" scoped>
#overdue{
    position:fixed;
    top:0;
    left: 0;
    width:100%;
    height:100%;
    padding-top:110px;
}
    .head{
        font-size:0;
        background:#fff;
        border-bottom:1PX solid #afafaf;
        position:absolute;
        top:0;
        left: 0;
        width:100%;
        span{
            display: inline-block;
            width:25%;
            text-align:center;
            font-size:32px;
            line-height: 110px;
        }
    }
    .box{
        position:static;
    }
    .content{
        .item{
            font-size:0px;
            span{
                display: inline-block;
                width:25%;
                text-align:center;
                font-size:30px;
                line-height: 80px;
            }
            background:#fff;
        }
    }
    .li{
        line-height: 100px;
    }
</style>