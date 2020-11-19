// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    tabs: [{
        id: 0,
        title: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        title: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        title: "店铺收藏",
        isActive: false
      },
      {
        id: 1,
        title: "浏览足迹",
        isActive: false
      }
    ],
    collectGoods: [],
  },

  changItemIsAcitve(e) {
    //console.log(e);
    const {
      index
    } = e.detail;
    const {
      tabs
    } = this.data;
    //tabs[index].isActive=true;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  /*
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const collectGoods = wx.getStorageSync('collect');
    this.setData({
      collectGoods
    })
    this.islogout();
  },

/*  islogout(){
    const userinfo=wx.getStorageSync('userinfo');
    if(!userinfo){
      this.setData({
        islogin:true
      })
    }
  }*/
})