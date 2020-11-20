// pages/user/index.js
import {
  showModal,
  showToast,
} from "../../utils/WxApi.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    collectNum: 0, //收藏商品的数量，在onShow中从缓存数据中获取
    collect: [],
    islogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const userinfo = wx.getStorageSync('userinfo');
    const collect = wx.getStorageSync('collect');
    let collectNum = collect.length;
    this.setData({
      userinfo,
      collectNum
    })
    this.loginuser()
  },

  //退出登录
  async logout(e) {
    //判断对象是否为空
    const res=await showModal({content:"您确定要退出吗？"});
    if(res.confirm){
      this.setData({
        userinfo: {},
        collectNum: 0,
        islogin:false
      })
      wx.setStorageSync('userinfo', {})
    }else{
      console.log("取消退出")
    }
      //wx.setStorageSync('collect', [])
    },
  //收藏页面的跳转
  tiaozhuan() {
    const userinfo = wx.getStorageSync('userinfo');
    var arr = Object.keys(userinfo);
    if (arr.length === 0) {
      wx.navigateTo({
        url: "/pages/login/index"
      })
    } else {
      wx.navigateTo({
        url: "/pages/collect/index"
      })

    }
  },

  //添加地址
  addAddress(){
    const userinfo = wx.getStorageSync('userinfo');
    var arr = Object.keys(userinfo);
    if (arr.length === 0) {
      wx.navigateTo({
        url: "/pages/login/index"
      })
    } else {
      wx.navigateTo({
        url: "/pages/address/address"
      })
    }
  },

  //意见反馈
  feedback(){
    const userinfo = wx.getStorageSync('userinfo');
    var arr = Object.keys(userinfo);
    if (arr.length === 0) {
      wx.navigateTo({
        url: "/pages/login/index"
      })
    } else {
      wx.reLaunch({
        url: "/pages/feedback/index"
      })
    }
  },

  //关于我们
  aboutUs(){
    const userinfo = wx.getStorageSync('userinfo');
    var arr = Object.keys(userinfo);
    if (arr.length === 0) {
      wx.navigateTo({
        url: "/pages/login/index"
      })
    } else {
      wx.reLaunch({
        url: "/pages/about/index"
      })
    }
  },
  //判断用户是否已经登录
  loginuser() {
    const userinfo = wx.getStorageSync('userinfo');
    var arr = Object.keys(userinfo);
    if (arr.length === 0) {
      //用户没有登录
      this.setData({
        islogin:false
      })
    } else {
      this.setData({
        islogin:true
      })
    }
  }
})