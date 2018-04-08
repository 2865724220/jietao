<template>
	<div id="con" ref='box'>
		<scroller :on-refresh="refresh" :on-infinite="infinite"  class='b'  ref='myscroller'>
			<div class="contentBox" v-for="(item,index) in listData" :key="index">
				<div class="detail-top">
					<div class="detail-left"><span>出借人:</span><span>{{item.loan_name}}</span></div>
					<div class="detail-right"><span>创建时间:</span><span>{{item.loan_time}}</span></div>
				</div>
				<div class="detail-bot">
					<div class="detail-money">
						<div>{{item.loan_amount}}</div>
						<div>借款金额</div>
					</div>
					<div class="detail-time">
						<div>{{item.repayment_time}}</div>
						<div>还款时间</div>
					</div>
					<div class="detail-status">
						<div v-if="item.status_desc == '未还款'" style="color: #FE6065;">{{item.status_desc}}</div>
						<div v-if="item.status_desc == '已还款'" style="color: #4D7BFF;">{{item.status_desc}}</div>
						<div v-else>{{item.status_desc}}</div>
					</div>
				</div>
			</div>
		</scroller>
		<van-loading type="gradient-circle" v-if="loading" color="black" />
	</div>
</template>

<script>
	import Vue from'vue'
    import {Toast ,Loading} from 'vant';
    Vue.component(Loading.name, Loading);
	import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    
	export default{
		data () {
			return {
				listData:[],
				total:'',
				page:0,
				loading:true,
				pageSize:10,
				wColor:'',
				yColor:''
			}
		},
		mounted () {
			this.getData(0);
		},
		created (){
			document.title = "订单详情";
		},
		methods : {
			getData (page,done){
				let that = this;
				let code = this.$route.query.platform_code;
				let id = this.$route.query.id;
				let type = this.$route.query.type;
				myFetch({platform_code:code,id:id,type:type,page:page},'/credit/order-query-by-type',function(data){
					if(data.code == 0){
						if(page == 0){
							if(type == 1){
								that.listData = data.data.b;
								that.total = data.data.b_total;
							}
							if(type == 2){
								that.listData = data.data.l;
								that.total = data.data.l_total;
							}
							if(type == 3){
								that.listData = data.data.o;
								that.total = data.data.o_total;
							}
							that.loading = false;
							
						}else{
							if(type == 1){
								that.listData = that.listData.concat(data.data.b);
								that.total = data.data.b_total;
							}
							if(type == 2){
								that.listData = that.listData.concat(data.data.l);
								that.total = data.data.l_total;
							}
							if(type == 3){
								that.listData = that.listData.concat(data.data.o);
								that.total = data.data.o_total;
							}
						}
						fn&&fn();
					}else{
						Toast(data.message);
					}
				})
			},
			refresh(done){
				let that = this;
				that.page = 0;
				this.getData(0,done);
				setTimeout(()=>{
                        done();
                    },3000);
			},
			infinite(done){
				let that = this;
				let paging = Math.floor(parseInt(that.total)/parseInt(that.pageSize));
				if(that.page<=paging){
					that.page++;
					setTimeout(()=>{
                        this.$refs.myscroller.finishInfinite?this.$refs.myscroller.finishInfinite(2):'';
                    },3000);
                    that.getData(that.page,done);
				}else{
                   done(true)
                   return;
               }
			}
		}
	}
</script>

<style lang="less" scoped>
    @import './creditDetailPage.less';
</style>