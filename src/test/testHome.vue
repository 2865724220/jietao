<template>
    <div>
        <ul>
            <li @click="prints">首页</li>
            <li v-for="nav in navs" :key="nav.id" >
                <router-link :to="nav.url">{{nav.nav}}</router-link>
                <!--<router-link to='/page1/page2' tag='a' @click.native='jump' >page2</router-link>-->
            </li>

        </ul>
        <ButtonDiv  :setBtnConfig="setBtnConfig" :btnTxt="serach" @click.native="test"></ButtonDiv>
        <!--<div is="Button" @click="test"></div>-->

        <input ref="myInput" type="text" v-model="tests" :id="tests | strReplace" />
        <p>{{tests | strReplace}}</p>
        <van-icon name="success" />
    </div>
</template>
<script>
    import Vue from 'vue'
    import LoginIndex from './activity/App.vue'
    import cs from '../common/commonService.js'
    import ButtonDiv from '../components/formComponent/Buttons'
    import Inputs from '../components/formComponent/Inputs'
    import { Icon } from 'vant';
    Vue.component(Icon.name, Icon);
    const userId = '123';
    export default {
        name : 'home',
        data () {
            //console.log(this)
            return {
                tests : '',
                params:'id',
                navs : [
                    {nav : '个人中心',id:1,url:`/main/1`},
                    {nav : '我们',id:2,url:'/child/2'}
                ],
                serach : '按钮',
                setBtnConfig : {
                    dengersour : 'dengersour',
                    btnSizeS : 'btnSizeS',
                    isL:'isL'
                }
            }
        },
        computed : {

        },
        methods : {
            prints () {
                console.log(this.params)
            },
            test () {
                this.$refs.myInput.style.color = 'red';
                console.log(this.$refs.myInput.id)
            }
        },
        components : {
            ButtonDiv,
            Inputs
        }
    }
</script>
<style module lang="less">
    @import '../css/base.less';
    li{
        float:left;
        margin-right:0.5rem;
        list-style: none;
        font-size:0.5rem;
    }
</style>