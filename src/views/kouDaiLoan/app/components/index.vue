<template>
    <div class="contSingleList">
        <div class="tabItem">
            <slot></slot>
        </div>
        <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
            <ul class="listItem">
                <li v-for="(li,index) in listdata">
                    <span>{{li.total_repay_money}}元</span>
                    <span>{{li.loan_user_name}}-{{li.loan_for}}</span>
                    <!--<span :class="{'state0':(item.state===0),'state1':(item.state==1),state2:(item.state===2)}"  >{{ item.id }}</span>-->
                </li>
            </ul>
        </vscroll>
    </div>
</template>

<script>
    import Vscroll from  './loading';
    import configs from '../common/commonService'
    const {myFetch} =configs;
    export default {
        data() {
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
        components: {
            Vscroll,
        },
        mounted: function() {
            this.getList();
        },
        methods: {
            getList() {
                console.log(111)
//                var response = []
//                for(let i = 0; i < 20; i++) {
//                    response.push({
//                        date: "2017-06-1"+i,
//                        portfolio: "1.5195"+i,
//                        drop: i+"+.00 %" ,
//                        state: 1
//                    })
//                };

                let _this = this;
                myFetch(this.postData,'api/web/order/account-list',(res)=>{
                    if(res.code=='0'){
                        let total = res.data.total;
                        _this.totalPages =  Math.floor(total/10);
                        _this.listdata.push(...res.data.list) ;
                        _this.postData.page = res.data.page+1;
                    }else if (res.code=='100005') {
                        _this.$router.history.replace('/login');
                    }else{
                        //Toast(res.message)
                    }
                })
                //this.listdata = response.slice(0, this.num);
            },
            onRefresh(done) {
                console.log(2222)
                let _this = this;
                this.postData.page = 0;
                myFetch(this.postData,'api/web/order/account-list',(res)=>{
                    if(res.code=='0'){
                        let total = res.data.total;
                        _this.totalPages =  Math.floor(total/10);
                        _this.listdata=res.data.list ;
                        _this.postData.page++;
                    }else if (res.code=='100005') {
                        _this.$router.history.replace('/login');
                    }else{
                        //Toast(res.message)
                    }
                })
                done(); // call done
            },
            onInfinite(done) {
                //this.counter++;
                console.log(123)
                let more = this.$el.querySelector('.load-more');
                if(this.postData.page>this.totalPages){
                    more.style.display = 'none'; //隐藏加载条
                    this.scrollData.noFlag = true;
                }else{
                    this.getList();
                    more.style.display = 'none';
                }




                //this.counter++;
                //let end = this.pageEnd = this.num * this.counter;
                //let i = this.pageStart = this.pageEnd - this.num;

                //let more = this.$el.querySelector('.load-more');
                //more.style.display = 'none'; //隐藏加载条
//                for(i; i < end; i++) {
//                    if(i >= 30) {
//                        more.style.display = 'none'; //隐藏加载条
//                        //走完数据调用方法
//                        this.scrollData.noFlag = true;
//
//                        break;
//                    } else {
//                        this.listdata.push({
//                            date: "2017-06-1"+i,
//                            portfolio: "1.5195"+i,
//                            drop: i+"+.00 %" ,
//                            state: 2
//                        })
//                        more.style.display = 'none'; //隐藏加载条
//                    }
//                }
                done();
            }

        }
    }
</script>