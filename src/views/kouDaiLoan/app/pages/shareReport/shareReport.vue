<template>
    <div id='share'>
       <div class="share-aw">
           <img class="share-arrow" src="../../images/share-arrow.png" alt="">
       </div>
       <div class="share-text">发送给微信好友或朋友圈</div>
       <div class="share-text">或者</div>
       <div class="share-text">让对方扫一扫二维码</div>
       <img v-if="imgSrc" class="share-qr" :src="imgSrc" alt="">
       <a href="javascript:;" class="back-home" @click="backHome">返回首页</a>
    </div>
</template>
<script>
import Vue from'vue'
import configs from '../../common/commonService';
import wxShare from '../../common/share'

const {myFetch ,switchErrorMsg ,preventFn} =configs;
    export default {
        name:'anthear',
        data () {
            return {
               imgSrc : '',
            }
        },
        mounted(){
            /*var btns = document.querySelectorAll('#copy');
            var clipboard = new Clipboard(btns); 
            clipboard.on('success',function(){
                Toast('复制成功');
            }) */ 
            let id = this.$route.params.id;
            let type = this.$route.params.type ==1?2:1;
            myFetch({id:''},'credit/create-qrcode',data=>{
               if(data.code ==0){
                    /*console.log(data.data);*/
                    this.imgSrc = data.data;
                    window.localStorage.setItem('SHARE_URL', data.link);
                    window.localStorage.setItem('DESC', data.desc);
                    window.localStorage.setItem('TITLE', data.title);
                    //wxShare.share();
                }else{
                    Toast(data.message);
                }
            });

        },
        methods:{
          backHome(){
            this.$router.push({name:'homeApp'});
          }
        },
        destroyed () {
            window.localStorage.removeItem('SHARE_URL');
            window.localStorage.removeItem('DESC');
            window.localStorage.removeItem('TITLE');
        }
    }
</script>
<style lang="less" scoped>
    #share{
        text-align:center;
        padding:40px 50px;
        position: absolute;
        top:0;
        left: 0;
        bottom:0;
        right:0;
        background:#333;
    }
    .share-aw{
        text-align: right;
        padding:20px 0 50px;
    }
    .share-arrow{
        display: inline-block;
        width:118px;
        height:102px;
    }
    .share-text{
        text-align:center;
        font-size: 32px;
        color:#fff;
        padding:10px 0;
    }
    .share-qr{
        display: block;
        margin:60px auto;
        width:300px;
        height:300px;
        padding:20px;
        background:#fff;
    }
    .back-home{
      display: block;
      color:#fff;
      font-size:38px;
      background:#F03232;
      height: 90px;
      line-height: 90px;
      width:48%;
      margin:100px auto 0;
      border-radius: 6px;
    }
</style>