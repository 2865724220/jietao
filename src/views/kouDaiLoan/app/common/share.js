
import axios from 'axios'
import wx from 'weixin-js-sdk'
let url = window.location.href.split('#')[0];
/*console.log(window.location.href)*/

let wxUrl = 'http://ioubak.xianjinxia.com/web/create-share?url=' + url;
// let shareLink = 'http://ioubak.xianjinxia.com/web/index';
// function host(){
//     let wurl = window.location.href.split('#')[1]?window.location.href.split('#')[1].split('/'):window.location.href.split("/");

//     let jtid = wurl[wurl.length-2];
//     let type = wurl[wurl.length-1] == 1 ? 2 : 1;

//     if(window.location.hostname=='iou-h5.xianjinxia.com'){
//         wxUrl = 'http://ioubak.xianjinxia.com/web/create-share?url='+url;
//         shareLink = 'http://ioubak.xianjinxia.com/web/index?jtid='+jtid+'&type='+type;
//     }else if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
//         wxUrl = 'http://prod-ioubak.xianjinxia.com/web/create-share?url='+url;
//         shareLink = 'http://prod-ioubak.xianjinxia.com/web/index?jtid='+jtid+'&type='+type;
//     }
// }

if(window.location.hostname=='iou-h5.xianjinxia.com'){
    wxUrl = 'http://ioubak.xianjinxia.com/web/create-share?url='+url;
}else if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
    wxUrl = 'http://prod-ioubak.xianjinxia.com/web/create-share?url='+url;
}

import share from './share.json'
export default ({
    share:function(){
        axios.get(wxUrl).then(function(data){
            wx.config({
                debug: false,
                appId: data.data.data.appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
                timestamp:data.data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.data.nonceStr, // 必填，生成签名的随机串
                signature: data.data.data.signature,// 必填，签名，见附录1
                //需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
                jsApiList: [
                 'onMenuShareAppMessage','onMenuShareTimeline',
                 'onMenuShareQQ','onMenuShareQZone'
                ]
            });
            var share_config = {
                "imgUrl": "http://jsqb-attach.oss-cn-shanghai.aliyuncs.com/iou/1711/1014/dc36/1215/5a05466db0838.png?x-oss-process=image%2Fresize%2Cm_fixed%2Ch_160%2Cw_160",
                "desc": window.localStorage.getItem('DESC'),
                /*"desc": "网络借条可以有效解决纸质借条的空间限制、时间限制、易损毁、身份信息不明确、无过程记录等问题。",*/
                "title": window.localStorage.getItem('TITLE'),
                "link": window.localStorage.getItem('SHARE_URL'), 
                "success": function() {
                    //分享成功后的回调函数
                },
                "cancel": function() {
                    //用户取消分享执行的回调函数
                    // alert('分享成功')
                }
            }
            wx.ready(function() {
                wx.onMenuShareAppMessage(share_config);//分享给好友
                wx.onMenuShareTimeline(share_config);//分享到朋友圈
                wx.onMenuShareQQ(share_config);//分享给手机QQ
            });
        })
        
        //处理验证失败的信息
        // wx.error(function (res) {
        //     alert(res);
        // });
        // //处理验证成功的信息
        // wx.ready(function () {
        //     //       alert(window.location.href.split('#')[0]);
        //     //分享到朋友圈
        //     wx.onMenuShareTimeline({
        //         title: share.title, // 分享标题
        //         link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //         imgUrl: share.imgUrl, // 分享图标
        //         success: function (res) {
        //         // 用户确认分享后执行的回调函数
                
        //         },
        //         cancel: function (res) {
        //         // 用户取消分享后执行的回调函数
                
        //         }
        //     });
        //     //分享给朋友
        //     wx.onMenuShareAppMessage({
        //         title: share.title, // 分享标题
        //         desc: share.desc, // 分享描述
        //         link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //         imgUrl: share.imgUrl, // 分享图标
        //         type: '', // 分享类型,music、video或link，不填默认为link
        //         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //         success: function (res) {
        //         // 用户确认分享后执行的回调函数
                
        //         },
        //         cancel: function (res) {
        //         // 用户取消分享后执行的回调函数
                
        //         }
        //     });
        //     //分享到QQ
        //     wx.onMenuShareQQ({
        //         title: share.title, // 分享标题
        //         desc: share.desc, // 分享描述
        //         link: window.location.href.split('#')[0], // 分享链接
        //         imgUrl: share.thu_image, // 分享图标
        //         success: function (res) {
        //         // 用户确认分享后执行的回调函数
                
        //         },
        //         cancel: function (res) {
        //         // 用户取消分享后执行的回调函数
                
        //         }
        //     });
        
        //     //分享到QQ空间
        //     wx.onMenuShareQZone({
        //         title: share.title, // 分享标题
        //         desc: share.desc, // 分享描述
        //         link: window.location.href.split('#')[0], // 分享链接
        //         imgUrl: share.imgUrl, // 分享图标
        //         success: function (res) {
        //         // 用户确认分享后执行的回调函数
                
        //         },
        //         cancel: function (res) {
        //         // 用户取消分享后执行的回调函数
                
        //         }
        //     });
        // })
        //

    }


})
