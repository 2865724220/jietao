<template>
    <div class="echarts">
        <!-- <IEcharts :option="bar" @ready="onReady" @click="onClick"></IEcharts> -->
    </div>
</template>

<script>
    /*import IEcharts from 'vue-echarts-v3/src/full.vue';*/
    import configs from '../common/commonService'
    const {myFetch } =configs;
    export default {
        name: 'view',
        components: {
            /*IEcharts*/
        },
        data () {
            return {
                bar: {
                    tooltip: {
                       // formatter: "{a} <br/>{b} : {c} ({d})"
                    },
                    color:['#ccc','#ccc','#ccc','#ccc'],
                    calculable : true,
                    series: [{
                        name: '',
                        type: 'pie',
                        radius : ['50%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '30',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:  [0.00,0.00,0.00,0.00]
                    }]
                }

            }
        },
        methods: {
            onReady(instance) {

            },
            onClick(event, instance, echarts) {

            }
        },
        props:{
            data:{

            }
        },
        mounted () {
            this.$nextTick(function () {
                let user_type = this.$props.data;
                let obj = {user_type};
                let _this = this;
                myFetch(obj,'api/web/order/account',(res)=>{
                    let n = 0;
                    _this.bar.series[0].data = [res.data.amount_no_all,res.data.amount_no_7,res.data.amount_no_30,res.data.amount_no_overdue];
                    Object.values(res.data).map((node)=>{
                        n = n+parseFloat(node);
                    });
                    console.log(n);
                    if(n>0){
                        _this.bar.color=['#ff9f2d' , '#387bee' ,'#76da74', '#f03232'];
                    }

                });
            })

        }
    };
</script>

<style scoped>
    .echarts {
        width: 400px;
        height: 380px;
    }
</style>