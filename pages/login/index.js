// pages/login/index.js
Page({


  bindGetUserInfo(e){
    const {userInfo}=e.detail;
    console.log(userInfo);
    wx.setStorageSync('userinfo', userInfo);
    wx.navigateBack({
      delta:1
    })
  }
})