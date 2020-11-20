/**1.实现上传图片功能：调用的时小程序内部的上传api函数
 */


/**1.实现提交功能
 *   1.1为提交按钮绑定事件
 *   1.2 获取用户输入文本框的值和上传的图片url
 *   1.3 需要将图片的url上传到如新浪图床，让其转成外网的链接----小程序有内置的上传api，
 *        成功后也会返回外网形式的url，因此定义一个全局数组用于存储
 *   1.4 由于小程序内置的上传图片到外网不支持一次多涨，因此需要每次遍历数组实现
 *         1.4.1 遍历的时候需要注意：即当用户有上传图片时才遍历，遍历完成之后再提交
 *         1.4.2 否则直接提交文本框的内容、
 * 
 *   1.5 最后的提交即会提交到后台服务器，即是发送请求（将文本和外网链接数组提交到服务器中），这里只是模拟
 * 
 * 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        title: "体验问题",
        isActive: true
      },
      {
        id: 1,
        title: "商家/商店投诉",
        isActive: false
      }
    ],
    imagesInfo: [], //存储上传的照片
    areaValue: "", //文本域的value值
  },

  newImageUrls: [], //经过外网处理过的图片路径
  handleTabItem(e) {
    //相当于过滤，只对满足条件的tabs[i]的isActive进行改变
    var {
      index
    } = e.detail;
    //console.log(index);
    var {
      tabs
    } = this.data;
    tabs.map((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  //上传图片
  chooseImages() {
    wx.chooseImage({
      count: 9, //最多上传照片数目
      sizeType: ['original', 'compressed'], //图片来自设备
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        //console.log(res)
        this.setData({
          imagesInfo: [...this.data.imagesInfo, ...res.tempFilePaths]
        })
      }
    })
  },

  //点击删除图片
  deleteImg(e) {
    //console.log(e)
    const {
      index
    } = e.currentTarget.dataset;
    const {
      imagesInfo
    } = this.data;
    //console.log(index);
    imagesInfo.splice(index, 1)
    this.setData({
      imagesInfo
    })

  },

  //获取文本域的内容
  handleInput(e) {
    //console.log(e)
    const value = e.detail.value
    this.setData({
      areaValue: value
    })
  },


  //提交按钮事件
  handleFormSubmit(e) {

    const {
      areaValue,
      imagesInfo
    } = this.data;
    //对文本域内容合法性验证
    if (!areaValue.trim()) {
      this.setData({
        areaValue: ""
      })
      wx.showToast({
        title: '输入不合法',
        e
      });
      return;
    }
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    if (imagesInfo.length != 0) {
      imagesInfo.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/', //仅为示例，非真实的接口地址
          filePath: v,
          name: 'file',
          formData: {},
          success: (res) => {
            console.log(res);
            if (i === imagesInfo.length - 1) {
              //上传完毕关闭
              wx.hideLoading();
              console.log("把经过外网处理后的外网url上传到后台服务器中");
              this.setData({
                areaValue: "",
                imagesInfo: []
              })
              //跳回上个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    } else {
      console.log("只提交了文字");
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
  },
})