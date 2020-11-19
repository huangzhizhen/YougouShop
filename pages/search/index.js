// pages/search/index.js
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
    goods: [],
    inpuValue: "",
    isFouse: false//当文本框获取焦点时，按钮隐藏，反之显示
  },

  //定义全局的定时器id
  TimeId: -1,
  onLoad: function (options) {

  },
  //获取文本框关键字
  handleInput(e) {
    //console.log(e)
    const {value} = e.detail;
    console.log(value)
    //console.log(value.trim());
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFouse:false
      })
      //值不合法，退出
      return;
    }
    this.setData({
      isFouse:true
    })
    //当value不是空窜时，接下来这
    //首先清除定时器，这里传入的是定时器id
    clearTimeout(this.TimeId);
    /**这里表示，当向文本框输入内容时，你每按下一个字符串，它都会触发一个定时器id，即按以上流程固定下来
     * 但是设置的clearTimeout(this.TimeId)会将其清除，即不会指定定时器内的流程，知道你最后一次输入稳定智斗，间隔n时间再触发
     * 这里时间隔1000ms即1s再触发请求获取数据
     * 简而言之：设置定时器解决防抖现象，就是不断的清除又不断的设置的过程，知道你输入稳定间隔指定时间后再触发
     * 这样便可以提高性能，不会重复多次发送请求或执行一些重复性的操作
     */
    this.TimeId=setTimeout(()=>{
      this.getResult(value);
    },1000)
    /*this.getResult(value);*/
   
  },
  //发送请求获取搜索结果数据
  async getResult(query) {
    const res = await request({url: "/goods/qsearch",data: {query}});
    console.log(res);
    this.setData({
      goods:res
    })
  },



  //点击取消按钮
cancleR(){
  //清除页面缓存
  //点击取消时，清除goods，也清除文本框上的value（这里通过再wxml上绑定）
  //同时也隐藏取消按钮
  this.setData({
    goods:[],
    inpuValue:"",
    isFouse:false
  })
}
})