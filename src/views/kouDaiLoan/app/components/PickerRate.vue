<template>
    <div v-show="pickerConfig.show" class="pickerP">
        <van-picker
                show-toolbar
                :title="title"
                :columns="pickerColumns"
                v-model="vl"
                @change="handlePickerChange"
                @cancel="handlePickerCancel"
                @confirm="handlePickerConfirm"
        ></van-picker>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { Picker } from 'vant';
    Vue.component(Picker.name, Picker);
    import configs from '../common/commonService'
    const {myFetch ,switchErrorMsg} =configs;
    export default {
        name:'picker',
        data () {
            return {
                title: '',
                vl:'',
                arr:[],
                pickerColumns: [
                    {
                        values: this.$props.pickerConfig.arrData,
                        className: 'column1'
                    }
                ]
            }
        },
        methods: {
            handlePickerChange(picker, values) {

                //console.log(values);
            },
            handlePickerCancel() {
                this.$props.pickerConfig.show=false;
            },
            handlePickerConfirm(picker) {
                let n = picker[0];
                this.$emit('getPickerValue',n,this.arr);
                this.handlePickerCancel();
            }
        },
        props : {
            pickerConfig : {
                type:Object
            }
        },

        mounted () {
            let _this = this;

            myFetch ({},'api/web/user-card/bank-list',(res)=>{
                if(this.$props.pickerConfig.arrData.length =='0'){
                    for (let [key, value] of Object.entries(res.data.bank_list)) {
                        this.arr.push({[value]:key})
                    }
                    _this.pickerColumns[0].values=Object.values(res.data.bank_list);
                }
            })
        }

    }
</script>