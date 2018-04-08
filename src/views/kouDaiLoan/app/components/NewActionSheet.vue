<template>
    <div v-if="tranShowFlag" class="aaa">
        <van-actionsheet v-model="tranShows=tranShowFlag" :actions="actions" :close-on-click-overlay = false></van-actionsheet>
    </div>
</template>
<script>
    import { Actionsheet ,Button } from 'vant';
    import Vue from 'vue';
    Vue.component(Actionsheet.name, Actionsheet);
    Vue.component(Button.name, Button);
    export default {
        name:'action',
        data () {
            return {
                tranShows:false,
                actions: [
                    {
                        name: '我已线下还款(还需要对方确认)',
                        className:'liS',
                        callback: this.onClick
                    },
                    {
                        name: '取消',
                        className:'',
                        callback: this.displayN
                    }
                ]
            }
        },
        props : {
            tranShowFlag : {
                type:Boolean
            }
        },
        computed : {
        },
        methods : {
            onClick () {
                this.$emit('postPrama');
            },
            displayN() {
                this.$emit('displayN');
            }
        },

    }
</script>
<style lang="less" scoped>
    .aaa{
        position: fixed;
        left: 0;
        top:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.3);
        z-index: 500;
    }
</style>