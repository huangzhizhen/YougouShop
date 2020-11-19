/**
 * 1.当页面打开时，在onShow中初始化数据
 *   但需要注意：
 *      onShow不同于onLoad，onShow无法在形参上接收options参数
 *       即不能使用onShow(options),因此使用页面栈的形式获取（页面栈--每打开一个页面，都会像数组中推入一个页面，页面最大长度为10，小程序内部设置的）
 * 2.当点击不同的选项时
 *   2.1 获取url上的参数type
 *   2.2 根据type值，分别发送请求获取数据(分为主页的和订单页面tabs上的，点击时均需要发送请求)
 *   2.3 根据type值来判断那个选项被激活选中
 *     由于该请求也是/my/，因此是需要token的，所以要分步
 *       即当token已经获取时，可以直接发送请求（请求头已经封装）
 *         当token为授予权限时，需要跳转到授权页面进行授权再进行返回
 *   2.4 渲染数据
 * 
 * 
 */
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    order:[],//用户存放请求的order数据，
    //由于现在不能获取到，但是实际上获取到时，将数据放入order中
    //即在发送请求后 const order=res.data
    //便可以在wxml中渲染
    tabs: [{
        id: 1,
        title: "全部订单",
        isActive: true,
      },
      {
        id: 2,
        title: "待付款",
        isActive: false,
      },
      {
        id: 3,
        title: "待收货",
        isActive: false,
      },
      {
        id: 4,
        title: "退货/退款",
        isActive: false,
      }
    ]
  },

  //根据索引或者type，判断哪个选项被激活选中的封装函数
  changeTitleByIndex(index){
    const {tabs} = this.data;
    tabs.map((v, i) => v.isActive = i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },




  //各个标题的点击事件
  //注意这里点击要重新发送请求
  handleTabItem(e) {
    //console.log(e);
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    this.getOrder(index+1);

  },

  onShow(options) {
    //const token=wx.getStorageSync('token')
    //若token为空
    /*if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      //由于不是企业账号，这里先暂时不获取
    }*/


    //当token不为空时执行以下
    //console.log(options)不能使用
    //由于当你不断打开新页面，因此页面栈中不断的加入，因此索引值最大为当前页面
    //然后根据返回页面的相关信息，会获取到你传过来的type参数
    let pages = getCurrentPages();
    console.log(pages)
    //使用{type}--打印页数比如1
    //使用type--打印{type：1}
    let currentPage=pages[pages.length-1];
    const {type}=currentPage.options

    //根据type值激活选中标题
    this.changeTitleByIndex(type-1);
    console.log(currentPage.options);

    this.getOrder(type);

  },

  //获取订单列表的方法
  async getOrder(type){

    const res=await request({url:"/my/orders/all",data:{type}})
    console.log(res)
  }


})