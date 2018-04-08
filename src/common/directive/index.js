import Vue from 'vue';

const foucs = Vue.directive('definedFocus',{
    inserted (el) {
        el.focus()
    }
})
//在图片未完成加载前，用随机的背景色占位，图片加载完成后才直接渲染出来。
const img = Vue.directive('img',{
    inserted (el,binding) {
        var color = Math.floor(Math.random()*1000000); //设置随机背景颜色
        el.style.backgroundColor = `#${color}`;
        var img = new Image();
        img.src = binding.value;  //获得传给指令的值
        img.onload = function () {
            el.style.backgroundImage = `url(${binding.value})`
        }
    }
});
/**
 * [subInput description]
 * @type {[type]} len字符串的最大长度
 */
const subInput =Vue.directive('subInput',{
    update (el,binding,oldVnode) {
        let {len} = binding.value
        console.log(el.value+',d')
        console.log(binding)
        console.log(oldVnode)
        //console.log(len+';len')
      if(el.value>len){
         // console.log(12333)
        el.value = el.value.substr(0,len);
      }
    }
});

//使用<div v-img="val.url" v-for="val in list"></div>
//list = [url:'http://xxxxx.jpg']
export {foucs , img ,subInput }
