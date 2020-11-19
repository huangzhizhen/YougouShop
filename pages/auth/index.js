/**授权页面
 *1.给button绑定open-type=“getUserInfo” bindgetUserInfo="bindGetUserInfo"
 *2.获取的用户相关授权信息主要通过回调函数bindGetUserInfo
 *3.获取到用户相关的信息、以及登录信息code后，再进行发送请求获取用户token
 * 
 */

import {
  login,
} from "../../utils/WxApi.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async bindGetUserInfo(e){
    try {
      //获取用户的信息
      const {encryptedData,rawData,iv,signature}=e.detail;
      //获取小程序登录成功后的code
      const {code}=await login();
      const loginParams={encryptedData,rawData,iv,signature}
      //获取用户授权token
      const token=await request({url:"/users/wxlogin",data:loginParams,method:"post"})
      console.log("auth获取token")
      //获取到token之后，存储到本地缓存数据，并返回pay页面
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta:1  //数字表示返回第几层
      })
    } catch (error) {
      console.log(error);
    }
  
  }

})