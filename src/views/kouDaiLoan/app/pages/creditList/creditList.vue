<template>
    <div class="credit-list" >
       <div class="credit-top">
       		<div class="credit-name">{{userInfo.name}}</div>
       		<div class="credit-message">
       			<span>{{userInfo.sex}}</span><span class="credit-line"></span><span class="credit-age">{{userInfo.age}}岁</span>
       			<span>手机:{{userInfo.phone}}</span>
       		</div>
       </div>
       <div class="credit-platform"  v-for="(item,index) in platFormList" :key="index">
       		<div class="platform-name">
       			<span class="platform">借贷数据分析-{{item.platform}}</span>
       			<span class="platform-bg" @click="authInfo(item.platform_code,userInfo.id,item.platform)" v-if ="item.platform_status !='0' "></span>
       		</div>
       		<ul class="credit-loanList">
       			<li class="credit-num" v-if="item.borrowCount == 0">
       				<span>借入总额</span>
       				<span>{{item.borrowCount}}次</span>
       				<span>{{item.borrowSum}}元</span>
       			</li>
       			<li class="credit-num" v-if="item.borrowCount > 0" @click="creditDetailPage(item.platform_code,userInfo.id,1)">
       				<span>借入总额</span>
       				<span>{{item.borrowCount}}次</span>
       				<span>{{item.borrowSum}}元</span>
       				<img src="../../images/arrowRight.png">
       			</li>
       			<li class="credit-num" v-if="item.loanCount == 0">
       				<span>借出总额</span>
       				<span>{{item.loanCount}}次</span>
       				<span>{{item.loanSum}}元</span>
       			</li>
       			<li class="credit-num" v-if="item.loanCount > 0" @click="creditDetailPage(item.platform_code,userInfo.id,2)">
       				<span>借出总额</span>
       				<span>{{item.loanCount}}次</span>
       				<span>{{item.loanSum}}元</span>
       				<img src="../../images/arrowRight.png">
       			</li>
       			<li class="credit-num" v-if="item.overdueCount == 0" >
       				<span>逾期总额</span>
       				<span>{{item.overdueCount}}次</span>
       				<span>{{item.overdueSum}}元</span>
       			</li>
       			<li class="credit-num" v-if="item.overdueCount > 0" @click="creditDetailPage(item.platform_code,userInfo.id,3)">
       				<span>逾期总额</span>
       				<span>{{item.overdueCount}}次</span>
       				<span>{{item.overdueSum}}元</span>
       				<img src="../../images/arrowRight.png">
       			</li>
       		</ul>
       </div>
       <div class="share-btn clearfix">
        <span class="btn-span" @click="shareSpan">分享我的信用报告</span>
       </div>
       <van-loading type="gradient-circle" v-if="loading" color="black" />
    </div>   
</template>
<script>
    //本组件路由需要传递三个参数，total总共还款金额，overdue逾期金额没有就是0，id，多个的id用-拼接
    import Vue from'vue'
    import {Toast ,Loading} from 'vant';
    Vue.component(Loading.name, Loading);
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'creditForm',
        data () {
            return {
                userInfo:{},
                loading:true,
                search:this.$route.query.search,
                name:this.$route.query.name,
                phone:this.$route.query.phone,
                platFormList:[],
                userid:this.$route.query.id?this.$route.query.id:''
            }
        },
        methods : {
          authInfo(code,otherid,platformName){
            let id= otherid?otherid:'';
            this.$router.push({name:'creditDetail',query:{platformName:platformName,platform:code,id:id,name:this.userInfo.name,age:this.userInfo.age,sex:this.userInfo.sex,phone:this.userInfo.phone}});
          },
          shareSpan(){
            this.$router.push({name:'shareReport'});
          },
          creditDetailPage (code,id,type){
        	this.$router.push({name:'creditDetailPage',query:{platform_code:code,id:id,type:type}});
          }
            
        },
        created (){
           document.title="信用报告";
        },
        mounted () {
        let that = this;
        let id = that.$route.query.id ? that.$route.query.id:'';
        myFetch({id:id,name:that.name,phone:that.phone},'credit/credit-report',function(data){
            if(data.code == 0){
               that.userInfo = data.data.info;
               that.loading = false;
               that.platFormList = data.data.platform_data;
               that.total =data.data.total;
               that.pageNum = Math.floor(data.data.total/that.page_size);
               that.page == that.pageNum?that.moreInfo="没有更多数据了~":that.moreInfo="点击查看更多";
            }else{
                that.loading = false;
                Toast(data.message);
            }
       
        })
    },
       
    }
</script>
<style lang="less" scoped>
    @import './creditList.less';
</style>