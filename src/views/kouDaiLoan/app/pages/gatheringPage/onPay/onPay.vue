<template>
    <div class="onpay">
        <div class="onpay-none" v-show="isNone">
            <img src="../../../images/noneLoanCon.png" v-if="postData.user_type=='1'">
            <img src="../../../images/noneBackM.png" v-else>
        </div>
        <div class="onpay-detail">
            <ul>
                 <li v-for="(li ,index) in detailCon" :key="li.id">
                     <div class="chenck-l">
                         <p class="checkS">
                             <span class="check" v-if="postData.user_type=='2'">
                        　　　　<input type="radio" :id="'check'+li.id" name="1" v-model="flag['check'+index]" @click="checkFn(index)">
                        　　　　<label :for="'check'+li.id"></label>
                        　　</span>
                            <label :for="'check'+li.id"></label>
                       </p>
                         <p>
                             <span>{{li.total_repay_money}}元</span>
                             <span class="gray">{{postData.user_type!='1' ?  li.loan_user_name :  li.borrow_user_name}}-{{li.loan_for}}</span>
                         </p>
                     </div>
                     <div class="chenck-r">
                         <router-link :to="{path:'/gather-detail-newL',query: {id: li.id,isS:postData.user_type}}" tag="div" :class="{lineH:!(li.state_code=='5'), twoLine:(li.state_code=='5')}">
                             <p :class="{red:li.surplus_days.substr(0,2)==yuqi,orange:li.surplus_days.substr(0,2)!=yuqi}">{{li.surplus_days}}</p>
                             <!-- <p class="font-orag" v-if="postData.user_type=='1' &&li.state=='待确认'">{{postData.user_type=='1' &&li.state=='待确认'  ? surplus_days : nosurplus_days}}</p> -->
                             <p class="font-orag" v-if="li.state_code=='5'">{{li.state_code=='5' ? (postData.user_type=='1'? surplus_days: nosurplus_days)  : ''}}</p>
                         </router-link>
                     </div>
                 </li>

            </ul>
        </div>
    </div>
</template>
<script>
    import { Search } from 'vant';
    import Vue from 'vue' ;
    Vue.component(Search.name, Search);
    //li.surplus_days.substr(0,2)==yuqi
//    const removeByValue = (arr , val)=> {
//        for(var i=0; i<arr.length; i++) {
//            if(arr[i] == val) {
//                arr.splice(i, 1);
//                break;
//            }
//        }
//    }
    export default {
        name:'m',
        data () {
            return {
                value : '',
                surplus_days:'有线下还款待处理',//出借方
                nosurplus_days : '线下还款确认中',//借款人
                yuqi:'逾期',
                overdue:0,
                isNone:false,
                flag:{},
                total :'0',
                id:''
            }
        },
        methods : {
            checkFn (i) {
               if(!this.flag['check'+i]){
                    this.flag['check'+i] = !this.flag['check'+i];
                }

                if(this.flag['check'+i]){
                    this.total = this.$props.detailCon[i].total_repay_money;
                    this.overdue = parseFloat(this.$props.detailCon[i].overdue_fee);
                    this.id=this.$props.detailCon[i].id;
                }else{
                    this.total = 0.00;
                    this.overdue = 0;
                    this.id='';
                }
                this.$emit('backTotal',this.total,this.id ,this.overdue);
            }

        },
        props : {
            postData : {
                type:Object
            },
            detailCon : {
                type:Array
            }
        },
        computed : {
            setfalg  () {
                this.isNone = this.$props.detailCon.length<1 ? true : false;
                this.$emit('backTotal',this.total,this.id ,this.overdue);
            }
        },
        beforeUpdate() {
            this.isNone = this.$props.detailCon.length<1 ? true : false;
            //console.log(this.$props.detailCon.length)
            for(let i = 0;i<=this.$props.detailCon.length;i++){
                this.flag['check'+i] =false;
               // this.$emit('displayNone')
            }
        },
        mounted () {
            this.setfalg;
            //console.log(this.$props.detailCon.length)
        }
    }

</script>
<style lang="less">
    @import '../../../css/base';
    .onpay{
        height:84.3%;
    }
    .onpay-none{
        width:100%;
        height:100%;
        text-align:center;
        /*background:#f2f2f2;*/
        margin-top:30px;
        img{
            width:40%;
            height:auto;
            margin-top:80px;
        }
    }
    .onpay-detail{
        width:100%;
        height:auto;
        background:#fff;
        ul{
            width:100%;
            margin:auto;
            padding-top:10px;
            padding-bottom:20px;
        }
        li{
            height:140px;
            width:100%;
            padding:20px;
            box-sizing: border-box;
            border-bottom:1PX solid #ccc;

            .chenck-l{
                width:35%;
                float:left;
                .checkS{
                    width:18%;
                    margin-right:10px;
                }
                p{
                    float:left;
                    height:100%;
                    width:75%;
                    line-height: 120px;
                    margin-right:0;
                    span{
                        line-height: 50px;
                        display: block;
                        font-size:28px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
                .checkS{
                    input {
                        height:40px;
                        width:40px;
                        background:#fff;
                        border-radius:40px;
                    }
                }
            }
            .chenck-r{
                float:right;
                text-align: right;
                width:63%;
                height:100px;
                .lineH{
                    background:url("../../../images/arrowRight.png")right center no-repeat ;
                    background-size:9%;
                    padding-right:50px;
                    height:100px;
                    p{
                        line-height: 100px;
                        font-size:28px;
                        text-align: right;
                    }
                }
                .twoLine{
                    background:url("../../../images/arrowRight.png")right center no-repeat ;
                    background-size:9%;
                    padding-right:50px;
                    p{
                        line-height: 50px;
                        font-size:28px;
                        text-align: right;
                    }
                }

                .font-red {
                    color: @red-color;
                }
                .font-orag{
                    color:@orange-color
                }

            }
        }
    }
    * { margin: 0; padding: 0; };
    /*现将input和label放在一个盒子中，使用定位将input放在label下隐藏*/
    .check { position: relative; margin-top:30px; display: inline-block; width: 50px; height: 50px; margin-right: 5px; };
    .check input { display: none; };
    .check label { position: absolute; width: 40px; height: 40px; top: 0; left: 0; border: 2px solid #cacaca; border-radius: 50%; background: #fff; }

    .check label:after {
        position: absolute;
        content: "";
        width: 35px;
        height: 15px;
        border: 2px solid #cacaca;
        border-top: none;
        border-right: none;
        opacity: 0.4;
        transform: rotate(-45deg);
        top: 4px; left: 3px;
    }
    .check input:checked+label { border: 2px solid #f78642; };
    .check input:checked+label:after {
        opacity: 1; border: 2px solid #f78642;
        border-top: none; border-right: none;
    }
</style>