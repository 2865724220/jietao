<template>
    <a class="user" @click="go()">
        <img src="../images/ivo.png" alt="">
    </a>
</template>
<script>
    export default {
        name:'user',
        data () {
            return {
                homeDataUrl:'api/web/order/home',
            }
        },
        methods:{
             go(){
                 this.$router.push({name:'userCenter'})
            }
        },
        mounted () {
           
        }
    }
</script>
<style lang="less" scoped>
   .user{
       box-sizing: border-box;
       position:fixed;
       width:150px;
       right:0;
       bottom:160px;
       img{
           width:100%;
       }
   }
</style>