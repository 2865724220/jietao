<template>
    <div id='share'>
       <!--  <p>
           分享给微信好友<img src="../../images/arrow.png" alt="" class='arrow'>
       </p>
       <div>
           <h5>邀请对方关注微信公众号<br>继续完成借条</h5>
           <img src="../../images/ti.png" alt="" class='hao'>
           <div class='d'>对方关注“你我信条”公众号后继续操作</div>
       </div>
       <button class='button'  data-clipboard-action="copy" data-clipboard-text="你我信条" id='copy'>复制公众号</button> -->
       <!--<div class="share-aw">
           <img class="share-arrow" src="../../images/share-arrow.png" alt="">
       </div>-->
       <div class="share-text share-text1">可以通过以下方式，将借条发送给对方：</div>
       <div class="share-text">1、让对方扫描下方二维码</div>
       <img v-if="imgSrc" class="share-qr" :src="imgSrc" alt="">
       <div class="share-text ">2、生成借条链接，将链接发送给对方</div>
       <button class="back-home" data-clipboard-action="copy" data-clipboard-text="">生成并复制链接</button>
       <div class="oImg"><img src="../../images/backHome.png"  v-on:click.once="backHome()"/></div>
    </div>
</template>
<script>
import Vue from'vue'
import configs from '../../common/commonService';
import wxShare from '../../common/share'
import {Toast} from 'vant'
import Clipboard from 'clipboard'

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
            let copyUrl = unescape(this.getCookie('copyUrl'));
            let generateLink = document.getElementsByClassName("back-home")[0];
            generateLink.setAttribute("data-clipboard-text",copyUrl);
	        let clipboard = new Clipboard('.back-home'); 
	        clipboard.on('success',function(){
                Toast('链接已复制');
           });
           
            myFetch({id:id,user_type:type},'order/create-qrcode',data=>{
               if(data.code ==0){
                    /*console.log(data.data);*/
                    this.imgSrc = data.data;
                    window.localStorage.setItem('SHARE_URL', data.link);
                    window.localStorage.setItem('DESC', data.desc);
                    window.localStorage.setItem('TITLE', data.title);
                    //wxShare.share();
                    /*console.log(data.link, 'data.link')*/
                }else{
                    Toast(data.message);
                }
            });

        },
        methods:{
          backHome(){
            this.$router.history.replace('/');
          },
          getCookie(cname) {
                let name = cname + "=";
                let ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "";
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
        background:#F2F2F2;
        height:100%;
        overflow-y: auto;
       /*  p{
           text-align:right;
           font-size: 36px;
       }
       .arrow{
           width:150px;
       }
       .button{
           background:#f03232;
           color:#fff;
           font-size:32px;
           height:90px;
           width:100%;
           border-radius:8px;
       }
       h5{
           margin:40px 0;
           font-size: 40px;
       }
       .d{
           margin:40px 0;
           font-size: 34px;
       }
       .hao{
           width:250px;
       } */
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
        color:#333;
        padding:10px 0;
    }
    .share-text1{
    	margin-top: 63px;
    	margin-bottom: 65px;
    }
    .share-qr{
        display: block;
        margin:40px auto 70px;
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
      margin:50px auto 0;
      border-radius: 6px;
    }
    .oImg{
    	width: 100%;
    	text-align: right;
    	img{
    		width: 90px;
    		height: 90px;
    		margin-top: 52px;
    	}
    }
</style>