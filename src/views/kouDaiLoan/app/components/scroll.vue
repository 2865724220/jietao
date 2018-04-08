<template>
    <div class="wrapper" ref='wrapper'>
        <div>
            <div class='load down' v-show='load'><img src="../images/load.gif" alt=""></div>
            <slot></slot> 
            <div class='load up' v-show='loadMore'><img src="../images/load.gif" alt=""></div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
    export default {
        name:'scroll',
        data () {
            return {
                load:false,
                loadMore:false,
                no:false
            }
        },
        props:{
            list:{
                type: Array,
                default: []
            }
        },
        methods:{
            _initScroll() {
                 this.scroll = new BScroll(this.$refs.wrapper, {
                    pullDownRefresh:{
                        threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
                        stop: 50 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
                    },
                    pullUpLoad:{
                        threshold: -40 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
                    }
                })
            }
        },
        watch:{
            list(){
                this.$nextTick(()=>{
                    this.load = false;
                    this.loadMore = false;
                    this.scroll.finishPullDown()
                    this.scroll.finishPullUp()
                    this.scroll.refresh()            
                }) 
            }
        },
        mounted () {
            setTimeout(()=>{
                this._initScroll();
                this.scroll.on('pullingDown',()=>{
                    this.load = true;
                    this.$emit('down');
                })
                this.scroll.on('pullingUp',()=>{
                    this.loadMore = true;
                    this.$emit('up');
                })
            },20)
           
        
        }
    }
</script>
<style lang="less" scoped>
   .wrapper{
       height:100%;
       overflow:hidden;
       .load{
           padding:20px 0;
           text-align:center;
           img{
               width:50px;
           }
       }
       .down{
           position: absolute;
           top:0;
           width:100%;

       }
       .up{
           position: absolute;
           bottom:0;
           width:100%;
           
       }
   }
</style>