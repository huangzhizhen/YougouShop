// pages/goods_list/index.js

/*
1.当用户上滑页面时，滚动条触底 开始加载下一页数据
 1.1 找到滚动条触底事件
 1.2 判断还有没有下一页：
   1.2.1 获取到总页数（总页数=Math.ceil(总条数/页容量（pagesize)
                            =Math.ceil（23/10）=2.3=3
   ，当前页码（pagenum）
   1.2.2 判断 当前>=当前页数   ----无=》弹出提示
   1.2.3 否则   ------有=》继续继续加载下一页
      1）让当前的页码++
      2）重新发送请求
      3）数据不能直接this.setData覆盖原来数据，应该时数据拼接
2.下拉刷新
  2.1 触发下拉刷新事件(在json中开启页面配置)
    2.1.1 找到事件，在此事件中写代码逻辑（类似于上拉，也是存在页面周期函数中）
  2.2 重置数据 数组(先清空，)
  2.3 重置页码为1
  2.4 再重新发送请求
  2.5 数据请求完毕，完毕刷新效果（wx.stopPullDownRefresh();------没有调用下拉刷新，直接调用也不会出错)

*/
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        title:"综合",
        isActive:true
      },
      {
        id:1,
        title:"销量",
        isActive:false
      },
      {
        id:2,
        title:"价格",
        isActive:false
      }
    ],
    GoodsList:[]//存到商品列表的数据
  },

  //接口要的参数(根据接口，)
  QueryParams:{
    query:"",
    cid:"",
    pagenum:0,//表示请求的时第一页
    pagesize:10//是个数据
  },

  //全局
  totalPages:1,


  handleTabItem(e){
    //相当于过滤，只对满足条件的tabs[i]的isActive进行改变
    var {index}=e.detail;
    //console.log(index);
    var {tabs}=this.data;
    tabs.map((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    this.QueryParams.cid=options.cid;
    this.getGoodsList();

  },

  async getGoodsList(){
    const result=await request({url:"/goods/search",data:this.QueryParams});
    //var GoodsList=result.goods;
    const total=result.total;
    //console.log(total%this.QueryParams.pagesize);
    //console.log(GoodsList);
   // wx.setStorageSync('goodsList', {time:Date.now(),data:GoodsList});
    this.setData({
      //拼接数组
      GoodsList:[...this.data.GoodsList,...result.goods]
    })

  },


  onReachBottom(e){
   // console.log("chudishijian");
   if(this.QueryParams.pagenum>=this.totalPages){
    wx.showToast({
      title: '没有下一页数据',
    });
    
   }else{
    console.log("有下一页数据");
    this.QueryParams.pagenum++;
    this.getGoodsList();
   }
  },

  //上拉刷新
  onPullDownRefresh(e){
   // console.log("上拉刷新");
   this.data.GoodsList=[]//清空数组
   this.QueryParams.pagenum=0;
   this.getGoodsList();//再次发送请求
   wx.stopPullDownRefresh();//数据请求完毕之后，停止刷新效果
  }

})