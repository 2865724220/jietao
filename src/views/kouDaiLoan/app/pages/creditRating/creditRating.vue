<template>
    <div class="credit-rating">
        <div class="redBg">
            <div>我的信用评级</div>
            <div class="big" v-text="allstate">
                
            </div>
            <a href="javascript:;" v-if="allstate=='良好' " @click="viewreport" class="report-a">我的信用报告</a>
            <a href="javascript:;" v-if="allstate=='未认证'"class="report-a disabled">我的信用报告</a>
        </div>
        <div class="greybg clearfix">
            <span class="fl">查询</span>
        </div>
        <div class="searchCredit" @click="searchCredit">
            <img class="search-icon" src="../../images/searchCredit.png" alt="">
            <div class="searchText">
                <p>查借款记录</p>
                <span>查询对方的借款情况</span>
            </div>
            <img class="search-arrow" src="../../images/next.png" alt="">
        </div>
        <div class="greybg clearfix">
            <span class="fl">认证</span>
            <span class="fr">认证后即可生成个人信用报告</span>
        </div>
        <ul class="platformList">
            <li v-for="(item,index) in platformList" :key="index">
                <a :href="item.auth_url?item.auth_url:'javascript:;'" class="clearfix">
                    <div class="fl">
                        <img class="platformLogo" v-if="item.platform_id!='iou'" :src="item.app_icon" alt="">
                        <img class="platformLogo" v-if="item.platform_id =='iou'" src="../../images/logo-s.png" alt="">
                        <span>{{item.platform_name}}</span>
                    </div>
                    <div class="fr">
                        <span v-if="item.state == '已认证' " class="red">{{item.state}}</span>
                        <span v-if="item.state == '未认证' ">{{item.state}}</span>
                    </div>
                    <img v-if="item.state == '未认证' && item.platform_id !='iou' " class="next-arrow" src="../../images/next.png" alt="">
                </a>
            </li>
        </ul>
    </div>   
</template>
<script>
    //本组件路由需要传递三个参数，total总共还款金额，overdue逾期金额没有就是0，id，多个的id用-拼接
    import Vue from'vue'
    import { Button ,Toast} from 'vant';
    Vue.component(Button.name, Button);
    import PickerRate from '../../components/PickerRate';
    import PasswordInput from '../../components/PasswordInput'
    import dialogPage from '../../components/LoanDialog'
    import configs from '../../common/commonService'
    const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'creditForm',
        data () {
            return {
                rating:false,
                allstate:'',
                platformList:[],
               
            }
        },
        methods : {
            viewreport(){
                this.$router.push({name:'creditList'});
            },
            searchCredit(){
                this.$router.push({name:'creditForm'});
            }
            
        },
        created (){
           document.title="查信用";
        },
        mounted () {
            let that = this;
            myFetch({}, 'api/web/credit/credit-query', function (data) {
            if (data.code == 0) {
                    that.allstate = data.data.allstate;
                    that.platformList = data.data.platformlist;
                    /*console.log(data.data.platformlist)*/
                }
            })
        },
        components : {
            PickerRate,
            PasswordInput,
            dialogPage,
        }
    }
</script>
<style lang="less" scoped>
    @import './creditRating.less';
</style>