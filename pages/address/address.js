// pages/address/address.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/WxApi.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {

  },
  //地址的显示
  async handleChooseAddress() {
    try {
      //将数据存到缓存页面中，方便该页面或者其他页面使用
      // const userAddress = wx.getStorage("address") || [];
      const result1 = await getSetting();
      const scope = result1.authSetting["scope.address"];
      /*if (scope === true || scope === undefined) {
        //const result2=await chooseAddress();
        console.log(result2);
        wx.setStorage("address", result2)
      } else {
        await openSetting();
        // const result2=await chooseAddress();
        //console.log(result2);
      }*/
      //上面的代码等价于，当scope==false时，打开授权页面，否则不用其他操作
      if (scope === false) {
        await openSetting();
      }
      //因为不管是if还是else，都会执行以下，因此放在外边
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);
    } catch (err) {
      console.log(err);
    }
  },
})