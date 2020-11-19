// pages/index/index.js
import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],//轮播图数值
    cateList:[],//导航轮播图
    floorList:[],//楼层数组
  },

  /*页面开始加载时就会触发*/ 
   /*
   1.发送异步请求
   */
   /*var reqTask = wx.request({
   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    /*data: {},不用发送数据给后台*/
   /* header: {'content-type':'application/json'},请求头暂时不用加，有默认值*/
    /*method: 'GET',
    dataType: 'json',
    responseType: 'text',
    这三个均可以不要，因为都是默认值，且此处的请求都符合
    
    success: (result) => {
      /*console.log(result);
      this.setData({
        swiperList:result.data.message
      })
    },*/
  onLoad: function (options) {
  /*1.获取轮播图数据 */
    this.getSwiperList();
    this.getcateList();
    this.getfloorList();
  },

  //获取轮播图数据
  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then((result)=>{
      /*这里得到的result即是reslove(result) */
      this.setData({
        swiperList:result
      })
    });
  },
  //获取导航图数据
  getcateList(){
    request({url:'/home/catitems'})
    .then((result)=>{
      this.setData({
        cateList:result
    })
  })
},

  //获取楼层数据
  getfloorList(){
    request({url:'/home/floordata'})
    .then((result)=>{
      this.setData({
        floorList:result
    })
  })
}
});
