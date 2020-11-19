"use strict";

var _index = require("../../request/index.js");

// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    //轮播图数值
    cateList: [],
    //导航轮播图
    floorList: [] //楼层数组

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
  onLoad: function onLoad(options) {
    /*1.获取轮播图数据 */
    this.getSwiperList();
    this.getcateList();
    this.getfloorList();
  },
  //获取轮播图数据
  getSwiperList: function getSwiperList() {
    var _this = this;

    (0, _index.request)({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
    }).then(function (result) {
      /*这里得到的result即是reslove(result) */
      _this.setData({
        swiperList: result.data.message
      });
    });
  },
  //获取导航图数据
  getcateList: function getcateList() {
    var _this2 = this;

    (0, _index.request)({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'
    }).then(function (result) {
      _this2.setData({
        cateList: result.data.message
      });
    });
  },
  //获取楼层数据
  getfloorList: function getfloorList() {
    var _this3 = this;

    (0, _index.request)({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata'
    }).then(function (result) {
      _this3.setData({
        floorList: result.data.message
      });
    });
  }
});