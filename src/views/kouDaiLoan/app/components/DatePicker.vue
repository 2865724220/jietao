<template>
    <div v-show="dateConfig.show" class="datePicker">
        <van-datetime-picker v-model="currentDate2" type="date" :maxDate="maxDate" :minDate="minDate" @confirm="confirmFn(currentDate2)" @cancel="cancel"/>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { DatetimePicker } from 'vant';
    Vue.component(DatetimePicker.name, DatetimePicker);
    export default {
        name:'date',
        data() {
            return {
                currentDate2:new Date(),
                minDate:new Date(2009, 12, 1),
                maxDate: new Date(2019, 10, 1),
            };
        },
        methods : {
            confirmFn (v) {

                let n = `${v.getFullYear()}-${v.getMonth() + 1 <10?'0'+(v.getMonth() + 1):v.getMonth() + 1}-${v.getDate()<10?'0'+v.getDate():v.getDate()}`;
                // let n = `${v.getFullYear()}-${v.getMonth() + 1}-${v.getDate()}`;
                this.$emit('confirm',n,this.$props.dateConfig.data?this.$props.dateConfig.data:0)
            },
            cancel () {
                this.$props.dateConfig.show=false;
            }
        },
        props : {
            dateConfig : {
                type:Object
            }
        },
        mounted(){
        /*    this.$nextTick(function () {
                let id = this.$props.dateConfig.order_id
                let _this = this;
                this.api.getOrderInfo({id},(res)=>{
                    if(res.code=='0'){
                        let {data} = res,
                            st = data.start_date.split('-'),
                            ent = data.end_date.split('-');
                        st[1] = parseInt(st[1])-1;
                        ent[1] = parseInt(ent[1])-1;
                        _this.minDate = new Date(st[0],st[1],st[2]);
                        _this.maxDate = new Date(ent[0],ent[1],ent[2]);
                    }
                });
            })
*/
        }
    }
</script>