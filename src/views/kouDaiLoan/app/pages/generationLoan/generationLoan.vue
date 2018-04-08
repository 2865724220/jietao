<template>
    <div id="loanInfo" class="loanInfo">
        <div class='header'><img src='../../images/loan.png' />借款内容</div>
        <div class='content'>
            <div class='item'><span class='left'>借款人</span><span class='right'>{{data.borrow_user_name}}</span></div>
            <div class='item clearfix sig' >
                <span class='left'>借款人签名</span>
                <div class="signWrap fr">
                    <div class="signImg" v-if="isLoad && data.flow =='B' && data.hand_write_name_b.length>0" @click="signB">
                        <img :src="data.hand_write_name_b" alt="">
                    </div>
                    <div class="signImg" v-if="isLoad && data.flow =='L' && data.hand_write_name_b.length>0" @click="showUserSignL">
                        <img :src="data.hand_write_name_b" alt="">
                    </div>
                    <span class="redS" v-if="isLoad && data.hand_write_name_b.length == 0 && data.flow =='L' "  @click="showUserSignL">未签署</span>
                    <span class="arrow"><img src="../../images/arrowRight.png"></span>
                </div>
            </div>
            <!--<span v-if="data.is_regis == '1'">(已注册)</span><span v-if="data.is_regis == '0'">(未注册)</span>-->
            <div class='item'><span class='left'>出借人</span><span class='right'>{{data.loan_user_name}}</span></div>
            <div class='item clearfix sig' >
                <span class='left'>出借人签名</span>
                <div class="signWrap fr">
                    <div class="signImg" v-if="isLoad && data.flow =='B' && data.hand_write_name_l.length>0" @click="showUserSignL">
                        <img :src="data.hand_write_name_l"  v-if="" alt="">
                    </div>
                    <div class="signImg" v-if="isLoad && data.flow =='L' && data.hand_write_name_l.length>0" @click="signB">
                        <img :src="data.hand_write_name_l"  v-if="" alt="">
                    </div>
                    <span class="redS" v-if="isLoad && data.flow =='B' && data.hand_write_name_l.length == 0 && data.flow =='B' " @click="showUserSignL">未签署</span>
                    <span class="arrow"><img src="../../images/arrowRight.png"></span>
                </div>
            </div>
            <div class='item'><span class='left'>借款金额</span><span class='right'>{{data.loan_money}}元</span></div>
            <div class='item' v-if="data.flow == 'B' "><span class='left'>信用报告</span><span class='right' @click="viewReport(data.borrow_user_id)"><a href="javascript:;">点击查看></a></span></div>
             <div class='item' v-if="data.flow == 'L' && data.state_code !='1'"><span class='left'>信用报告</span><span class='right' @click="viewReport(data.borrow_user_id)"><a href="javascript:;">点击查看></a></span></div>
            <div class='item'><span class='left'>借款日期</span><span class='right'>{{data.loan_date}}</span></div>
            <div class='item'><span class='left'>还款日期</span><span class='right'>{{data.total_repay_date}}</span></div>
            <!-- <div class='item'  v-if='data.flow == "B"'><span class='left'>借款时间</span><span class='right'>{{data.loan_day}}天</span></div> -->
            <!-- <div class='item'  v-if='data.flow == "L"'><span class='left'>借款利率</span><span class='right'>{{data.annual_rate}}%</span></div> -->
            <div class='item'><span class='left'>年化利率</span><span class='right'>{{data.annual_rate}}%</span></div>
            <div class='item'  v-if='data.flow == "B"'><span class='left'>还款金额</span><span class='right'>{{data.total_repay_money}}</span></div>
            <!-- <div class='item'  v-if='data.flow == "B"'><span class='left'>还款日期</span><span class='right'>{{data.total_repay_date}}</span></div> -->
            <div class='item'><span class='left'>借款用途</span><span class='right'>{{data.loan_for}}</span></div>
            <!-- <div class='item'><span class='left' style='vertical-align:middle'>补充说明</span><span class='right'  style='vertical-align:middle;overflow:hidden' :style='seeMore' @click='more()'>{{data.loan_for_remark}}</span></div> -->
            <div class='item'><span class='left'>借款协议</span><span class='right'><a href="http://static-page.xianjinxia.com/static-page/loanAgreement.html">点击查看></a></span></div>
            <div class='online'></div>
            <div class='item'><span class='left'>借条编号</span><span class='right'>{{data.order_no}}</span></div>
            <div class='item'><span class='left'>创建时间</span><span class='right'>{{data.created_time}}</span></div>
            <div class='item'  v-if='data.flow == "B"'><span class='left'>借条费用</span><span class='right'>5元</span></div>
            <div class='item'><span class='left'>借条状态</span><span class='right gray'>{{data.state}}</span></div>
            <div class='online' v-if='data.pic'></div>
            <div class='pic' v-if='data.pic'>
                <h3>图片说明</h3>
                <div class='img' v-for='item in data.pic'>
                     <img  :src="item" alt="" >
                </div>
            </div>
            <div class="fixButton">
                <div class='on'>
                    <button class='button ' v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="10" ' @click='pay(3)' >支付借条费用</button>
                    <button class='button ' v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="2" ' @click='pay(3)' >支付借条费用</button>
                    <button class='button ' v-if='data.flow == "L" && this.$route.params.type==2 && data.state_code=="10" ' @click='pay(3)' >支付借条费用</button>
                    <button class='button ' v-if='data.flow == "L" && this.$route.params.type==2 && data.state_code=="2" ' @click='pay(3)' >支付借条费用</button>
                    <button class='button ' v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="11"'   @click='send()'>发送借条给对方</button>
                    <button class='button' v-if='data.flow == "L" && this.$route.params.type==2 && data.state_code=="1"' @click='ok()'>确认借条</button>
                    <button class='button' v-if='data.flow == "L" && this.$route.params.type==1 && data.state_code=="10"' @click='borrowConfirm()'>确认借条</button>
                    <button class='button' v-if='data.flow == "B" && this.$route.params.type==1 && data.state_code=="11"' @click='borrowConfirm()'>确认借条</button>
                    <button class='button ' v-if='data.flow == "L" && this.$route.params.type==1 && data.state_code=="1"'  @click='send()'>发送借条给对方</button>
                    <button class='button' v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="8" && resend == "0"' @click='edit()'>再次编辑</button>
                    <button class='button' v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="8" && resend == "1"' @click='send()'>再次发送</button>
                    <button class='button' v-if='data.flow == "L" && this.$route.params.type==1 && data.state_code=="8" && resend == "0" ' @click='editLoan()'>再次编辑</button>
                    <button class='button' v-if='data.flow == "L" && this.$route.params.type==1 && data.state_code=="8" && resend == "1" ' @click='send()'>再次发送</button>
                </div>
                <p class="btnDel gray"  v-if='data.flow == "L" && this.$route.params.type==2 && data.state_code=="1"'  @click='rcode()'>驳回借条</p>
                <!-- <p class="btnDel gray"  v-if='data.flow == "B" && this.$route.params.type==1 && data.state_code=="1"'  @click='rcode()'>驳回借条</p>  -->
                <p class="btnDel gray"  v-if='data.flow == "B" && this.$route.params.type==1 && data.state_code=="11"'  @click='rcode()'>驳回借条</p>
                <!-- <p class="btnDel gray"  v-if='this.$route.params.type==2'  @click='remove()'>删除借条</p>  -->
                <p class="btnDel gray" v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="10" ' @click='remove()'>删除借条</p>
                <p class="btnDel gray" v-if='data.flow == "L" && this.$route.params.type==1 && data.state_code=="1" '  @click='remove()'>删除借条</p>
                <p class="btnDel gray" v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="11"'  @click='remove()'>删除借条</p>
                <p class="btnDel gray" v-if='data.flow == "B" && this.$route.params.type==2 && data.state_code=="8"'  @click='remove()'>删除借条</p>
                <p class="btnDel gray" v-if='data.flow == "L" && this.$route.params.type==1 && data.state_code=="8"'  @click='remove()'>删除借条</p>
            </div>
            <!-- 弹出框 -->
            <div class='mask' v-show='showDialog1'>
                <div class='pop-content'>
                    <div class='header1'>
                        <img src="../../images/gantanhao.png" alt="">
                    </div>
                    <p>你我信条是为已完成的借贷行为提供电子凭证，请确保你们线下已完成交易。</p>
                    <div class='footer' @click='know()'>
                    <span class='red'>知道了</span>
                    </div>
                </div>
            </div>
            <!-- 逾期弹框 -->
           <!--  <div class='mask' v-show='showDialog6'>
               <div class='pop-content'>
                   <div class='header1'>
                       <img src="../../images/gantanhao.png" alt="">
                       <h4 class='red' v-if='this.$route.params.type==2'>该用户存在逾期风险</h4>
                       <h4 class='red' v-if='this.$route.params.type==1'>该用户存在逾期风险</h4>
                   </div>
                   <p v-if='this.$route.params.type==2'>你我信条是为已完成的借贷行为提供电子凭证，请确保你们线下已完成交易。</p>
                   <p v-if='this.$route.params.type==1'>你我信条是为已完成的借贷行为提供电子凭证，请确保你们线下已完成交易。</p>
                   <div class='footer' >
                   <span @click='know1()'>知道了</span><span @click='goyuqi()' class='bor red'>查看逾期</span>
                   </div>
               </div>
           </div> -->
            <div class='mask' v-show='showDialog5'>
                <div class='pop-content'>
                    <div class='header1'>
                        <img src="../../images/gantanhao.png" alt="">
                    </div>
                    <p>你我信条是为已完成的借贷行为提供电子凭证，请确保你们线下已完成交易。</p>
                    <p class='red'>一旦对方确认借条则立即生效</p>
                    <div class='footer' >
                    <span @click='sendon(1)'>不发起</span><span @click='sendon(2)' class='bor'>发起</span>
                    </div>
                </div>
            </div>
            <div class='mask' v-show='showDialog2'>
                <div class='pop-content'>
                    <img src="../../images/closed.png" alt="" class='close' @click='clo'>
                    <div class='header1'>
                        选择支付方式
                    </div>
                    <p>确认借条需支付5元</p>
                    <div class='footer'>
                        <!-- 去掉扫码支付 -->
                        <!--  <span @click='pay(1)'>扫码支付</span> -->
                        <span @click='pay(2)' class='green'>微信支付</span>
                    </div>
                </div>
            </div>
            <div class='mask' v-show='showDialog3'>
                <div class='pop-content'>
                    <img src="../../images/closed.png" alt="" class='close' @click='cloRefuse'>
                    <div class='header1'>
                        提示
                    </div>
                    <p>驳回后，对方可修改借条再发出或删除。确认驳回借条吗？</p>
                    <div class='footer'>
                        <span @click='returnok(1)'>驳回</span><span @click='returnok(2)' class='bor'>不驳回</span>
                    </div>
                </div>
            </div>
            <div class='mask' v-show='showDialog4'>
                <div class='pop-content'>
                    <p>借条删除后,所有记录全部清除，对方不能确认,借条不会生效,您确定删除借条吗？</p>
                    <div class='footer'>
                        <span @click='removeok(1)'>删除</span><span @click='removeok(2)' class='bor'>不删除</span>
                    </div>
                </div>
            </div>
            <div class='mask' v-show='setcard'>
                <div class='pop-content'>
                    <p>您还未实名绑卡，请先去绑卡</p>
                    <div class='footer'>
                        <span @click='set(1)'>确认</span><span @click='set(2)' class='bor'>取消</span>
                    </div>
                </div>
            </div>
            <div class='mask' v-show='setpwd'>
                <div class='pop-content'>
                    <p>您还未设置交易密码，请先设置交易密码</p>
                    <div class='footer'>
                        <span @click='seton(1)'>确认</span><span @click='seton(2)' class='bor'>取消</span>
                    </div>
                </div>
            </div>
            <!-- <div class='mask' v-show='success'>
                <div class='success'>
                    <h3>输入交易密码</h3>
                    <div>
                        <img src="../../images/registerSuc.png" alt="">
                    </div>
                </div>
            </div> -->

            <div class='paying' v-show='paying'>
                <img src="../../images/load.gif" alt="">
                <p>请等待...</p>
            </div>

        </div>
        <password :isDisplay='isDisplay' :isSucess='isSucess' v-on:getValue='getValue'  @tranFn="makeSure"></password>
        <!--微信推送提示框-->
    	<!--<div class="box"  v-show="bombBoxShow">
			<div class="bombBox">
				<div class="bombBox-send">已发送</div>
				<div class="bombBox-top">已通过公众号消息告知借款人</div>
				<div class="bombBox-bottom">
					<div class="b-common" @click="leftClick">返回首页</div>
					<div class="b-common b-right" @click="rightClick">再打一条</div>
				</div>
			</div>
			<div class="bombMask"></div>
    	</div>-->
        <div class="signCanvas" v-if="showSignB">
            <div class="signCon" >
                <div class="headCanvas clearfix">
                    <span class="fl">电子签名预览</span>
                    <span class="fr closed" @click="closeCanvasB"></span>
                </div>
                <div class="imgSinCon" v-if="data.flow == 'B' && data.hand_write_name_b.length > 0">
                    <img :src="data.hand_write_name_b" alt="">
                </div>
                <div class="imgSinCon" v-if="data.flow == 'L' && data.hand_write_name_l.length > 0">
                    <img :src="data.hand_write_name_l" alt="">
                </div>
            </div>
        </div>
        <div class="signCanvas" v-if="showSignL">
            <div class="signCon" >
                <div class="headCanvas clearfix">
                    <span class="fl">电子签名预览</span>
                    <span class="fr closed" @click="closeCanvasL"></span>
                </div>
                <div class="imgSinCon" v-if="data.hand_write_name_L.length > 0">
                    <img :src="data.hand_write_name_L" alt="">
                </div>
            </div>
        </div>
        <div class="signCanvas" v-if="showSignUserL">
            <div class="signCon" >
                <div class="headCanvas clearfix">
                    <span class="fl">请在以下区域手写签名</span>
                    <span class="fr closed" @click="closeCanvas"></span>
                </div>
                <vueSignature v-if="data.flow == 'B' && data.hand_write_name_l.length == 0 " class="canvasArea" ref="signature" :sigOption="option" :w="'100%'" :h="'300px'">></vueSignature>
                <vueSignature v-if="data.flow == 'L' && data.hand_write_name_b.length == 0 " class="canvasArea" ref="signature" :sigOption="option" :w="'100%'" :h="'300px'">></vueSignature>
                <div class="imgSinCon" v-if="data.flow == 'B' && data.hand_write_name_l.length > 0">
                    <img :src="data.hand_write_name_l" alt="">
                </div>
                <div class="imgSinCon" v-if="data.flow == 'L' && data.hand_write_name_b.length > 0">
                    <img :src="data.hand_write_name_b" alt="">
                </div>
                <p v-if="data.flow=='B' &&  data.hand_write_name_l.length > 0" class="pTis">是否要用当前的电子签名签署？</p>
                <p v-if="data.flow=='L' &&  data.hand_write_name_b.length > 0" class="pTis">是否要用当前的电子签名签署？</p>
                <div class="footSign clearfix">
                    <button v-if="data.flow=='B' && data.hand_write_name_l.length == 0" @click="clearS" class="clearCanvas">清屏</button>
                    <button v-if="data.flow=='B' && data.hand_write_name_l.length > 0"  @click="resetS"  class="resetCanvas">不，我要重签</button>
                    <button v-if="data.flow=='B' && data.hand_write_name_l.length == 0"  @click="saveS" class="saveCanvas">确认</button>
                    <button v-if="data.flow=='B' && data.hand_write_name_l.length > 0" @click="saveSR" class="saveCanvas">确认</button>

                    <button v-if="data.flow=='L' && data.hand_write_name_b.length == 0" @click="clearS" class="clearCanvas">清屏</button>
                    <button v-if="data.flow=='L' && data.hand_write_name_b.length > 0"  @click="resetS"  class="resetCanvas">不，我要重签</button>
                    <button v-if="data.flow=='L' && data.hand_write_name_b.length == 0"  @click="saveS" class="saveCanvas">确认</button>
                    <button v-if="data.flow=='L' && data.hand_write_name_b.length > 0" @click="saveSR" class="saveCanvas">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from'vue'
    import { NumberKeyboard } from 'vant'
    Vue.component(NumberKeyboard.name, NumberKeyboard)
    import { PasswordInput,Toast} from 'vant'
    import Clipboard from 'clipboard'
    Vue.component(PasswordInput.name, PasswordInput)
    import password from '../../components/PasswordInput'
    import configs from '../../common/commonService'
    import filter from '../../common/filter';
    import vueSignature from "vue-signature";
    Vue.use(vueSignature);
    const {myFetch ,switchErrorMsg} =configs
    const setCookie = (name , value)=>
    {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    };
    export default {
        name:'loan',
        data () {
            return {
                txt:new Date(),
                url:'api/web/order/order-info',
                returnUrl:'api/web/order/order-refuse',
                deleteUrl:'api/web/order/order-del',
                userInfo:'api/web/user/user-info',
                comfrimurl:'api/web/order/borrow-confirm',
                senturl:'api/web/order/send-order',
                borrowurl:'api/web/order/send-order-borrow',
                payurl:'api/web/pay/service-pay',
                overdueUrl:'api/web/order/overdue-ing',
                loanconfirmurl:'api/web/order/loan-confirm-borrow',
                data:{},
                isLoad:false,
                showSignB:false,
                showSignL:false,
                showSignUserL:false,
                userSign:'',
                userName:'',
                option:{
                    backgroundColor:'transparent'
                },
                resend: this.$route.query.resend?this.$route.query.resend:'0',
                searchParms:{},
                jtId:this.$route.params.id,
                showKeyboard:false,
                showDialog1:false,
                showDialog2:false,
                showDialog3:false,
                showDialog4:false,
                showDialog5:false,
                showDialog6:false,
                isDisplay:false,
                isSucess:false,
                setcard:false,
                setpwd:false,
                paying:false,
                pwdIndex:1,//1 确定借条 2 驳回借条 3 发送借条  4 删除借条
                value:'',
                errorMeg:'',
                pwd:'',
                height:'0.9333rem',
                bombBoxShow:false,
                clickOnce:true,
            }
        },
        components : {
            password
        },
        computed:{
            seeMore(){
                return{
                    height:this.height
                }
            }
        },
        created(){
            document.title="你我信条";
        },
        mounted(){
            let id = this.$route.params.id;
            let type = this.$route.params.type;
            let copyUrl = '';
            this.getData(id);

            let host = window.location.host;
            let protocol = window.location.protocol;
            if(type == '1'){
            	copyUrl = protocol + '//' + host + '/#/loan/' + id +'/'+ 2;
            }
            if(type == '2'){
            	copyUrl = protocol + '//' + host + '/#/loan/' + id +'/'+ 1;
            }
            setCookie('copyUrl',copyUrl);
            this.getUserInfo();
            /*this.getData(type);*/
            setTimeout(()=>{
                this.yuqi(this.$route.params.type);
            })
            window.sessionStorage.removeItem('loanInfo');

           let sStr= window.location.search;
           let params = this.searchParms;
            if(sStr && sStr.length > 1){
              sStr = sStr.substring(1, sStr.length);
              var arr = sStr.split('&');
              for(var i = 0; i < arr.length; i++){
                var kv = arr[i].split('=');
                params[kv[0]] = kv[1];
              }
            }
            if(params.jtid && params.type){
               this.$router.push({name:'generationLoan',params:{id:params.jtid,type:params.type}});
                params = {};
               /* console.log(params);
                console.log(params.length);*/
            }

        },
        methods : {
            more(){
                if(this.height=='0.9333rem'){
                    this.height = 'auto';
                }else{
                    this.height = '0.9333rem'
                }

            },
            clo(){
                this.showDialog2 = false;
            },
            cloRefuse(){
                this.showDialog3 = false;
            },
            yuqi(type){//是否存在逾期
                let that = this;
                /*alert(that.borrowUserId)*/
                myFetch({page:0,user_type:type,order_id:that.$route.params.id},that.overdueUrl,function(data){
                    if(data.data.total>0){
                        that.showDialog6 = true;
                    }
                })
            },
            getData(id){//获取页面信息
                let that = this;
                myFetch({id:id},that.url,function(data){
                    if(data.code==0){
                        that.isLoad = true;
                        that.data = data.data;
                        that.borrowUserId = data.data.borrow_user_id;
                        if(data.data.surplus_state==3 &&data.data.loan_user_id != 0){
                            that.showDialog6 = true;
                        }
                    }
                })
            },
            makeSure () {//弹出输入密码
                this.isDisplay = false;
            },
            ok(){//确定借条
                let that = this;
                if(that.data.hand_write_name_b.length == 0){
                    Toast("签署电子签名后才能确认借条")
                }else{
                    this.getUserInfo(function(card,pwd){
                        if(!card){
                            that.setcard = true;
                            return;
                        }
                        if(pwd==2){
                            that.setpwd = true;
                            return;
                        }
                        that.pwdIndex = 1;
                        that.isDisplay = true;
                        // that.showDialog1 = true;
                    })
                }

            },
            send(){//发送借条
                //this.showDialog5 = true;
                //let that = this;
                this.pwdIndex=3;
                this.sentLoan(this.$route.params.id,this.$route.params.type);

		            /*clipboard.on('success',function(e){
		                 Toast('复制成功');
		                 console.info('Text:', e.text);
		         })  */
            },
            remove(){//删除借条
                this.pwdIndex=4;
                this.showDialog4 = true;
            },
            set(way){//设置绑卡弹出框
                if(way==1){
                    this.$router.push({name:'certification'});
                }
                if(way==2){
                    this.setcard = false;

                }
            },
            seton(way){
                if(way==1){
                    this.$router.push({name:'traderPsw'});
                }
                if(way==2){
                    this.setpwd = false;
                }
            },
            sendon(way){
                if(way==1){
                    this.showDialog5 = false;
                }
                if(way==2){
                    this.showDialog5 = false;
                    this.sentLoan(this.$route.params.id,this.$route.params.type);
                    // this.isDisplay = true;
                    // this.$router.push({path: '/share-loan'});
                }
            },
            getValue(val){
                //1 确定借条 2 驳回借条 3 发送借条  4 删除借条
                if(val.length>=6){
                    this.pwd = val;
                    if(this.pwdIndex==1){
                        // this.isDisplay = false;
                        this.comfrimLoan(this.$route.params.id,this.pwd) ;
                    }
                    if(this.pwdIndex==2){
                        // this.isDisplay = false;
                        this.returnLoan(this.$route.params.id,this.pwd) ;
                    }
                    // if(this.pwdIndex==3){
                    //     this.sentLoan(this.$route.params.id,this.pwd) ;
                    // }
                    if(this.pwdIndex==4){
                        // this.isDisplay = false;
                        this.deleteLoan(this.$route.params.id,this.pwd) ;
                    }
                }
            },
            getUserInfo(fn){
                let that = this;
                myFetch({},that.userInfo,function(data){
                    fn&&fn(data.data.id_card,data.data.set_pay_pwd);
                    that.userSign = data.data.write_name;
                    that.userName = data.data.name;
                })
            },
            goyuqi(){
                this.$router.push({name: 'yuqi',params:{type:this.$route.params.type}});
            },
            know(){
                this.showDialog1 = false;
                this.showDialog2 = true;
            },
            know1(){
                this.showDialog6 = false;
            },
            rcode(){//驳回借条弹框
                let that = this;
                this.getUserInfo(function(card,pwd){
                    if(!card){
                        that.setcard = true;
                        return;
                    }
                    if(pwd==2){
                        that.setpwd = true;
                        return;
                    }
                    that.showDialog3 = true;
                })
            },
            pay(way){
                if(way==1){
                    // console.log('扫码')
                    // this.showDialog2 = false;
                    // this.isDisplay = true;
                    // this.payMoney(this.$route.params.id,this.pwd,'微信',1);
                    Toast('暂不支持扫码支付');
                }
                if(way==2){
                    // console.log('微信')
                    this.showDialog2 = false;
                    this.paying = true;
                    // this.isDisplay = true;
                    this.payMoney(this.$route.params.id,this.pwd,'微信',1);
                }
                if(way == 3){
                     this.showDialog2 = true;
		            /*clipboard.on('success',function(e){
		                 Toast('复制成功');
		                 console.info('Text:', e.text);
		         	})*/
                    /*this.paying = true;
                    // this.isDisplay = true;
                    this.payMoney(this.$route.params.id,this.pwd,'微信',1);*/
                }
            },
            payMoney(id,pwd,way,type){
                let that = this,homeUrl;
                // id 订单id  pwd 确认密码 way支付方式 type 费用类型
               if(window.location.hostname=='prod-iou-h5.xianjinxia.com'){
                   /* homeUrl = encodeURI('http://localhost:3000/#/payend/?id='+id); */
                   homeUrl = encodeURI('http://prod-iou-h5.xianjinxia.com/#/payend/?id='+id);
                }else{
                   /* homeUrl = encodeURI('http://localhost:3000/#/payend/?id='+id); */
                   homeUrl = encodeURI('http://iou-h5.xianjinxia.com/#/payend/?id='+id);
                }
                 myFetch({id:id,password:pwd,charge_pay_type:way,charge_type:type,url:homeUrl},that.payurl,function(data){
                    that.paying = false;
                    if(data.code==0){
                        //Toast('支付成功');
                        /*console.log(data.data.redirect_url)*/
                        window.location.href = data.data.redirect_url+'&type='+that.$route.params.type+'&flow='+that.data.flow;
                       /* alert(data.data.redirect_url);*/

                    }else{
                        Toast(data.message);
                    }
                })
            },
            returnok(way){
                if(way==1){
                    this.isDisplay = true;
                    this.showDialog3 = false;
                    this.pwdIndex = 2;
                }
                if(way==2){
                    this.showDialog3 = false;
                }
            },
            returnLoan(id,pwd){//驳回借条
                let that = this;
                if(!that.clickOnce){
                    return;
                }else{
                    that.clickOnce = false;
                    setTimeout(()=>{
                            that.isDisplay = false;
                    },500);
                    myFetch({id:id,pwd:pwd},that.returnUrl,function(data){
                        if(data.code==0){
                           /* that.isDisplay = false;*/
                            that.isSucess = true;
                            that.clickOnce = true;
                            setTimeout(function(){
                                that.isSucess = false;
                                Toast('借条驳回成功');
                                that.$router.push({path: '/'});
                            },1000)

                        }else{
                            that.clickOnce = true;
                            if(data.code==100012){
                                Toast('密码不正确');
                                that.isDisplay = true;
                                return;
                            }
                            Toast(data.message)
                            /*that.isDisplay = false;*/
                        }
                    })
                }


            },
            comfrimLoan(id,pwd){//确认借条
                let that = this;
                myFetch({id:id,pwd:pwd},that.comfrimurl,function(data){
                    if(data.code==0){
                        that.isDisplay = false;
                        that.isSucess = true;
                       setTimeout(function(){
                            that.isSucess = false;
                            that.showDialog1 = true;
                        },1000)
                    }else{
                        if(data.code==100012){
                            Toast('密码不正确');
                            that.isDisplay = true;
                            return;
                        }
                        Toast(data.message)
                        that.isDisplay = false;
                    }
                })

            },
            borrowConfirm(){
                if(this.data.hand_write_name_l.length == 0){
                    Toast("签署电子签名后才能确认借条")
                }else if(this.data.hand_write_name_b.length == 0){
                    Toast("签署电子签名后才能确认借条")
                }else{
                    this.loanconfirmborrow(this.$route.params.id);
                }
                /*this.comfrimLoan(this.$router.params.id,);*/
            },
            loanconfirmborrow(id){
                let that = this;

                myFetch({id:id},that.loanconfirmurl,function(data){
                    if(data.code==0){
                        that.$router.push({path: '/'});

                      /*  that.isDisplay = false;
                        that.isSucess = true;
                       setTimeout(function(){
                            that.isSucess = false;
                            that.showDialog1 = true;
                        },1000)*/
                        Toast("借条确认成功！");

                        /*setTimeout(function(){
                            that.$router.push({path: '/'});
                            console.log("aaaa")
                        },1000); */


                    }else{
                        if(data.code==100111){
                           /* setTimeout(function(){
                                that.$router.push({path: '/certification'});
                            },1000);*/
                            that.setcard = true;
                        }else{
                            Toast(data.message);
                        }
                    }
                })
            },

            sentLoan(id,type){//发送借条
                let that = this;
                if(type == 1){
                    myFetch({id:id},that.senturl,function(data){
                        if(data.code==0){
                            /*Toast('借条发送成功');*/
                            /*that.$router.push({path: '/'});*/
                          /* if(that.data.is_regis == '0'){
			                	that.$router.push({name: 'shareLoan',params:{id:that.$route.params.id,type:that.$route.params.type}});
			                }*/
                            that.$router.push({name: 'shareLoan',params:{id:that.$route.params.id,type:that.$route.params.type}});
                           //微信推送已发送弹框
                           /*if(that.data.is_regis == '1'){
			                	that.bombBoxShow = true;
			                }*/

                        }else if(data.code==100020){
                            /*Toast(data.message);*/
                            /*that.$router.push({path: '/share-loan'});*/
                            /*window.location.href="http://static-page.xianjinxia.com/static-page/share-loan.html";*/
                           that.$router.push({name: 'shareLoan',params:{id:that.$route.params.id,type:that.$route.params.type}});
                        }else{
                            if(data.code==100012){
                                Toast('密码不正确');
                                that.isDisplay = true;
                                return;
                            }
                            Toast(data.message)
                            that.isDisplay = false;
                        }
                    })
                }else{
                    if(!that.clickOnce){
                        return
                    }else{
                        that.clickOnce = false;
                        myFetch({id:id},that.borrowurl,function(data){
                            if(data.code==0){
                                /*Toast('借条发送成功');*/
                                /*that.$router.push({path: '/'});*/
                                that.clickOnce = true;
                                that.$router.push({name: 'shareLoan',params:{id:that.$route.params.id,type:that.$route.params.type}});
                            }else if(data.code==100020){
                               /* Toast(data.message);*/
                               /* that.$router.push({path: '/share-loan'});*/
                               /* window.location.href="http://static-page.xianjinxia.com/static-page/share-loan.html";*/
                               that.$router.push({name: 'shareLoan',params:{id:that.$route.params.id,type:that.$route.params.type}});
                               that.clickOnce = true;
                            }else{
                                if(data.code==100012){
                                    Toast('密码不正确');
                                    that.isDisplay = true;
                                    return;
                                }
                                Toast(data.message)
                                that.isDisplay = false;
                                that.clickOnce = true;
                            }
                        })
                    }

                }


            },
            deleteLoan(id,pwd){//删除借条
                let that = this;
                setTimeout(()=>{
                            that.isDisplay = false;
                },500);
                myFetch({id:id,pwd:pwd},that.deleteUrl,function(data){
                    if(data.code==0){
                        /*that.isDisplay = false;*/
                       /* that.isSucess = true;*/
                        setTimeout(function(){
                            /*that.isSucess = false;*/
                            Toast('借条删除成功')
                            that.$router.push({path: '/'});
                        },1000)
                    }else{
                        if(data.code==100012){
                            Toast('密码不正确');
                            that.isDisplay = true;
                            return;
                        }
                        Toast(data.message)
                        that.isDisplay = false;
                    }
                })

            },
            removeok(way){
                if(way==1){
                    this.showDialog4 = false;
                    this.isDisplay = true;
                }
                if(way==2){
                    this.showDialog4 = false;
                }
            },
            edit(){
                this.$router.push({name:'addBorrow',query:{id:this.jtId}});
            },
            editLoan(){
                this.$router.push({name:'addLoan',query:{id:this.jtId}});
            },
            //查看信用报告
            viewReport (userId){
                this.$router.push({name:'creditList',query:{id:userId}});

            },
            signB(){
                this.showSignB = true;
            },
            closeCanvasB(){
                this.showSignB = false;
            },
            closeCanvasL(){
                this.showSignL = false;
            },
            showUserSignL(){
                if(this.data.flow == 'B' && this.data.state_code != 3){
                    if(this.data.loan_user_name != this.userName){
                        Toast("您现在没有权限进行此操作！")
                        }else{
                            this.showSignUserL = true;
                    }
                }else if(this.data.flow == 'L' && this.data.state_code != 11){
                    if(this.data.borrow_user_name != this.userName){
                        Toast("您现在没有权限进行此操作！")
                        }else{
                        this.showSignUserL = true;
                    }
                }

            },
            closeCanvas(){
                let that = this;
                that.showSignUserL = false;
                if(that.data.flow =='B'){
                    myFetch({},that.userInfo,function(data){
                        that.data.hand_write_name_l = data.data.write_name?data.data.write_name:'';
                    })
                }else{
                    myFetch({},that.userInfo,function(data){
                        that.data.hand_write_name_b = data.data.write_name?data.data.write_name:'';
                    })
                }

            },
            saveS(){
                var _this = this;
                if(_this.$refs.signature.sig._lastVelocity == 0){
                    Toast("请签署姓名！");
                     _this.showSignUserL = true;
                }else{
                    var png = _this.$refs.signature.save()
                    _this.showSignUserL = false;
                    if(_this.data.flow =='B'){
                      _this.data.hand_write_name_l = png;
                      }else{
                        _this.data.hand_write_name_b = png;
                      }
                    _this.userSign = png;
                    myFetch({write_name:_this.data.flow=='B'?_this.data.hand_write_name_l:_this.data.hand_write_name_b},'user/save-writename',function(data){
                        if(data.code==0){
                           Toast(data.message);
                        }
                    })
                }

            },
            saveSR(){
                this.showSignUserL = false;
            },
            clearS(){
                var _this = this;
                _this.$refs.signature.clear();
            },
            resetS(){
                if(this.data.flow=='B'){
                    this.data.hand_write_name_l ='';
                }else{
                    this.data.hand_write_name_b ='';
                }

            }
            //微信推送已发送弹框,选择返回首页还是再下一单
            /*leftClick(){
            	this.$router.push({name:'homeApp'});
            },
            rightClick(){
            	this.$router.push({name:'addLoan'});
            }*/

            // 全屏展示
            // getreqfullscreen () {
            //     var root = document.documentElement
            //     return root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen
            // },
            // getfullscreenelement(){
            //     return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
            // },
            // getexitfullscreen(){
            //     return document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
            // },
            // imgShow(e){
            //     let that = this;
            //     let globalreqfullscreen = that.getreqfullscreen();
            //     globalreqfullscreen.call(e.target);
            // }
        },
        destroyed () {
          /* setTimeout(()=>{
            window.location.search ='';
           },1000)*/
          /* console.log(window.location.search);*/
        }
    }
</script>
<style lang="less" scoped>
    .loanInfo{
        padding-bottom: 110px;
    }
    .header{
        background:#fff;
        line-height:120px;
        padding:0 40px;
        font-size:36px;
        border-bottom:1PX solid #efefef;
        img{
            width:50px;
            vertical-align: middle;
        }
    }
   .pic{
       padding:0 40px;
       padding-bottom:20px;
       overflow:hidden;
       h3{
           line-height:60px;
           font-weight: normal;
           font-size: 32px;
       }
       .img{
           width:30%;
           height:200px;
           overflow:hidden;
           float:left;
           position:relative;
           border:2px solid #fff;
           margin-right:2%;
           img{
               width:100%;
               position: absolute;
               top:50%;
               left: 50%;
               transform:translate(-50%,-50%);
               -webkit-transform:translate(-50%,-50%);
               float:left;
           }
       }
   }
   .content{
       padding:20px 0;
       background:#fff;
       box-sizing: border-box;
       .item{
           padding:0 40px;
           font-size:0;
           line-height:70px;
           position:relative;
           .left{
               font-size: 32px;
                text-align:left;
                display:inline-block;
                width:40%;
           }
           .right{
               font-size: 32px;
                text-align:right;
                display:inline-block;
                width:60%;
           }
       }
       .online{
           height:20px;
           background:#F2F2F2;
       }
       .button{
            background:#f03232;
            color:#fff;
            font-size:32px;
            height:90px;
            width:100%;
            border-radius:8px;
        }
        .on{
           padding:0 40px;
        }
        .btnDel{
            font-size:32px;
            height:90px;
            width:100%;
            line-height:90px;
            text-align:center;
        }
   }
   .mask{
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.6)
    }
    // .success{
    //     position: absolute;
    //     width:100%;
    //     bottom:0;

    // }
    .paying{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        padding-top:20px;
        width:160px;
        height: 180px;
        background:rgba(0,0,0,.8);
        border-radius:10px;
        text-align:center;
        img{
            width:80px;
        }
        p{
            margin-top:20px;
            color:#fff;
            font-size:30px;
        }
    }
    .pop-content{
        text-align:center;
        background:#fff;
        width:580px;
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        border-radius:12px;
        padding:50px 0;
        padding-bottom:0px;
        font-size:32px;
        .close{
            position: absolute;
            top:15px;
            right: 15px;
            width:40px;
        }
        .header1{
            img{
                width:120px;
            }
            font-size:36px;
        }
        p{
            margin:50px 0;
            padding:0 50px;
            color:#666;
            &.red{
                color:#f03232;
            }
        }
        .footer{
            border-top:1PX solid #efefef;
            line-height: 90px;
            font-size:0;
            span{
                box-sizing: border-box;
                width:50%;
                display: inline-block;
                font-size:34px;
            }
            .bor{
                border-left:1PX solid #efefef;
            }
        }
    }
    .fixButton {
        position: fixed;
        width: 100%;
        left:0;
        bottom: 0;
        background: #fff;
        /* padding: 10px 0; */
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
        .on{
            margin:10px 0;
            .button{
                width:50%;
                float:right;
            }

        }
        .btnDel{
            margin:10px 0;
            width:38%;
            float: left;
        }
    }
.box{
    width: 100%;
    height: 100%;
    .bombMask{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background:rgba(0,0,0,1);
        opacity:0.4;
    }
    .bombBox{
        width: 80%;
        background:rgba(247,247,247,1);
        position: fixed;
        left: 10%;
        top: 30%;
        z-index: 9;
        border-radius: 28px;
        .bombBox-top{
            width: 100%;
            text-align: center;
            font-size:24px;
            margin:60px 0 60px 0;
        }
        .bombBox-send{
        	width: 100%;
            text-align: center;
            font-size:30px;
            margin:30px 0 30px 0;
        }
        .bombBox-bottom{
            overflow: hidden;
            border-top: 1px solid rgba(9,20,31,0.13);
        }
        .b-common{
            float: left;
            width: 49.5%;
            text-align: center;
            font-size:30px;
            font-family:PingFang-SC-Medium;
            line-height:80px;
        }
        .b-right{
        	border-left: .5px solid rgba(9,20,31,0.13);
        	color: #4D7BFF;
        }
    }
}
.clearfix{
    display: block;
    &:before{
      display: block;
      clear: both;
      content: '';
    }
    &:after{
      display: block;
      clear: both;
      content: '';
    }
}
.signWrap{
  padding:0;
  display: inline-block;
  vertical-align: middle;
  .redS{
    display: inline-block;
    vertical-align: middle;
    font-size: 32px;
    color: #F03232;
  }
}
.signImg{
  display: inline-block;
  vertical-align: middle;
  width:130px;
  height:60px;
  background: #d8d8d8;
  img{
    display: block;
    width: 100%;
    height: 100%;
  }

}
.arrow{
    display: inline-block;
    vertical-align: middle;
    img {
        display: block;
       width:36px;
       height:36px;
      // margin-top:10px;
      vertical-align: middle;
    }
}
.content{
    .item{
        &.sig{
            padding:0 36px 0 40px;
        }
    }
}
.canvasArea{
  cursor: crosshair;
  overflow: hidden;
  background: #f1f1f1;
}
.signCon{
  background: #fff;
  border-radius: 8px;
  width:96%;
  margin:0 auto;
}
.signCanvas {
    position: fixed;
    left: 0%;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 500;
    padding-top: 30%;
}
.headCanvas {
  height:120px;
  line-height: 120px;
  font-size:36px;
  color:#333;
  padding:0 32px;
}
.headCanvas .closed{
  width:40px;
  height:40px;
  background: url('../../images/closed.png') no-repeat center center;
  background-size:cover;
  margin:40px 0 0;
}

.saveCanvas{
  font-size:36px;
  color:#F03232;
  text-align:center;
  padding:30px 0;
  width:50%;
  display: block;
  float: right;
  margin:0 auto;
  background: transparent;
}
.clearCanvas{
  color:#999;
  font-size:36px;
  text-align:center;
  padding:30px 0;
  width:50%;
  display: block;
  float: left;
  border-right:1PX solid #d8d8d8;
  background: transparent;
}
.resetCanvas{
  color:#999;
  font-size:36px;
  text-align:center;
  padding:30px 0;
  width:50%;
  display: block;
  float: left;
  border-right:1PX solid #d8d8d8;
  background: transparent;
}
.footSign{
  text-align: center;
}
.imgSinCon{
  width:100%;
  height:400px;
  padding-bottom: 2px;
  background: #f1f1f1;
}
.imgSinCon img{
  display: block;
  width:100%;
  height:100%;
}
.pTis{
  font-size: 24px;
  color: #999;
  padding:20px 24px;
  margin:0 16px;
  border-bottom: 1PX solid #d8d8d8;
}
@media (min-width:500px) and (min-height: 600px){
    .signCanvas{
        padding-top: 3%;
    }
}
</style>
