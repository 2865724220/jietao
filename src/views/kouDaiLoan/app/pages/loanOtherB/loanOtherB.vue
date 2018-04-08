<template>
    <div class='otherInfo'>
        <h3>借款用途</h3>
        <ul class='loan'>
            <li v-for='(item,index,key) in loan' @click='laonFor(index)' v-bind:class='{"active":isActive==index}'>{{item}}</li>
        </ul>
        <h3>补充说明<small>（不超过200字）</small></h3>
        <textarea name="" v-model='loan_for_remark' @input='fontMuch()'></textarea>
        <h3>图片说明<small>（不超过10张）</small></h3>
        <div class='imgBox' ref='imgbox'>
            <div class='upload'>
                <form  method="post" enctype="multipart/form-data" name='form'>
                <input type="file"  name='pic' id="file" @change='upload()' ref='img'>
                <img src="../../images/add.png" alt="" class='add'>
                </form>
            </div>
            <div v-for="(item,index,key) in picshow" class='imgOn'>
                <img src="../../images/closed.png" alt="" class='close' @click='closepic(index)'>
                <img :src="item" alt="">
            </div>
            <div v-for="(item,index,key) in imgArr" class='imgOn' >
                <img src="../../images/closed.png" alt="" class='close' @click='closeon(index)'>
                <img :src="item" alt="">
                <div class='imgmask' v-show='!pic[index]'><img src="../../images/load.gif" alt=""><br>{{typeof(pic[index])==='boolean'?'上传失败...':'加载中...'}}</div>
            </div>
            
        </div>
        <button @click='save()'>保存</button>
    </div>
</template>
<script>
    // import configs from '../../common/commonService'
    // const {myFetch ,switchErrorMsg,preventFn} =configs
    import axios from 'axios';
    import lrz from 'lrz';
    import Qs from 'qs';
    import { Picker,Toast} from 'vant';

    export default {
        name:'anthear',
        data:function(){
            return{
                loan:['个体经营','消费','助学','创业','租房','旅游','装修','医疗','其他'],
                isActive:8,
                imgArr:[],
                up:"",
                loan_for_remark:'',
                pic:[],
                picshow:[],
                // upstatus:[],
                imgload:true,
                num:0,
            }
        },
        mounted(){
          this.up = 'http://ioubak.xianjinxia.com/order/up-pic';
          /* if(window.location.hostname=='dev-newh5-zuypo3.h5.dev.jisuqianbao.com'){
                this.up = 'http://iou-test.sudaichaoren.com/order/up-pic';
            }else if(window.location.hostname=='h5.koudaijt.com'){
                this.up = 'http://api.koudaijt.com/order/up-pic';
            }*/
            if( window.sessionStorage.getItem('otherloan')){
                this.otherloan = JSON.parse(window.sessionStorage.getItem('otherloan'));
                this.loan_for_remark = this.otherloan['loan_for_remark']
                this.isActive = this.loan.indexOf(this.otherloan['loan_for'])
                this.picshow = this.otherloan['pic']
            } 
        },
        methods:{
            closeon(i){
                this.pic.splice(i,1);
                this.imgArr.splice(i,1);
            },
            closepic(i){
                this.picshow.splice(i,1);
            },
            laonFor(i){
                this.isActive = i;
            },
            getObjectURL(file) {
                let url = null;
                if (window.createObjectURL != undefined) {
                    url = window.createObjectURL(file)
                } else if (window.URL != undefined) {
                    url = window.URL.createObjectURL(file)
                } else if (window.webkitURL != undefined) {
                    url = window.webkitURL.createObjectURL(file)
                }
                return url
            },
            upload(){
                if(this.picshow.length+this.pic.length>=10){
                    Toast('上传图片不能超过10张');
                    return;
                }
                var files = this.$refs.img.files;
                var self = this;
                // this.createImage(files);
                if (!files.length)return; 
                lrz(files[0],{}).then(function(rst){
                    rst.formData.append('pic', rst.base64);
                    let config = {
                        header: {
                            'Access-Control-Allow-Credentials': true,
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true
                    };
                    self.imgArr.push(rst.base64); 
                    // self.upstatus.push('上传中...');
                    // 添加请求头
                    axios.post(self.up, Qs.stringify({pic:rst.base64}), config)
                    .then(function(response){ 
                        if (response.data.code === 0) {
                            self.pic.push(response.data.data);
                            // that.upstatus.push('上传中...');
                        }else{
                            Toast(response.data.message);
                        }
                    }).catch(function(){
                        self.pic.push(false);
                    })
                }).catch(function(){
                    Toast('请上传图片格式');
                })
            },
            fontMuch(){
                if(this.loan_for_remark.length>200){
                    this.loan_for_remark = this.loan_for_remark.substr(0,200)
                }
            },
            // createImage(file){
            //     if(typeof FileReader==='undefined'){
            //         alert('您的浏览器不支持图片上传，请升级您的浏览器');
            //         return false;
            //     }
            //     var image = new Image();         
            //     var that = this;
            //     var leng=file.length;
            //     for(var i=0;i<leng;i++){
            //         var reader = new FileReader();
            //         reader.readAsDataURL(file[i]);
            //         reader.onload =function(e){
            //             that.upstatus.push('上传中...');
            //             that.imgArr.push(e.target.result);                                    
            //         };                 
            //     }      
            // },
            save(){
                this.pic.forEach(element => {
                    if(!element){
                        Toast('等待图片上传成功');
                        return;
                    }
                });
                let obj = {};
                obj.loan_for = this.loan[this.isActive];
                obj.loan_for_remark = this.loan_for_remark;
                obj.pic = this.pic.concat(this.picshow);
                window.sessionStorage.setItem('otherloan',JSON.stringify(obj));
               /* console.log(obj)*/
               /*this.$router.push({name:'addBorrow'})*/
               this.$router.go(-1);
            }
        }
    }
</script>
<style lang="less" scoped>
    .otherInfo{
        background:#fff;
        padding:0 20px;
        h3{
            line-height: 100px;
            font-weight: normal;
            font-size:34px;
            small{
                color:#999;
            }
        }
        .loan{
            overflow:hidden;
            li{
                width:30%;
                float:left;
                margin-right:5%;
                line-height:70px;
                border-radius:8px;
                border:2px solid #999;
                box-sizing: border-box;
                font-size:28px;
                text-align:center;
                margin-top:12px;
                &.active{
                    border-color: #E73D38;
                    color:#E73D38;
                }
            }
            li:nth-child(3n){
                margin-right:0;
            }
        }
        textarea{
            background:#F2F2F2;
            width:100%;
            height:200px;
            font-size:28px;
        }
        .imgBox{
            text-align:center;
            margin-left:10px;
            text-align:left;
            img{
                width:200px;
            }
            .imgOn{
               width:200px; 
               height: 200px;
               margin-right:20px;
               margin-top:20px;
               overflow:hidden;
               float:left;
               position:relative;
               .close{
                   position: absolute;
                   top:0;
                   right:0;
                   width:50px;
                   z-index:100;
               }
            //    background:url('../../images/load.gif') no-repeat center center;
            //    background-size:30% 30%;
               img{
                   width:100%;
               }
               .imgmask{
                   position: absolute;
                   top:0;
                   bottom:0;
                   left: 0;
                   right: 0;
                   background:rgba(0,0,0,.7);
                   text-align:center;
                   color:#ffffff;
                   img{
                       width:50px;
                       margin-top:50px;
                   }
               }
            }
            .upload{
                position: relative;
                input{
                    width:200px;
                    height:200px;
                    position: absolute;
                    top:0;
                    left: 0;
                    opacity:0;
                }
            }
        }
        button{
            background:#E73D38;
            outline: none;
            border:none;
            border-radius:10px;
            text-align:center;
            color:#fff;
            line-height: 100px;
            width:100%;
            margin:20px 0;
            font-size: 34px;
        }
        
    }
</style>