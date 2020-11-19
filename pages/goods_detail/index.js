
/*
1.发送请求获取数据
2.点击轮播图 预览大图
 2.1. 给轮播图绑定点击事件
 3.2. 调用小程序的api previewImage

3.加入购物车功能
  3.1 为购物车添加事件addCart
  3.2 当触发事件时，将其缓存到本地数据中（以数组的形式）
  3.3 判断：
     1）若是第一次添加：给所缓存的数组定义一个属性num，并赋值为1，并重新将购物信息缓存到数组，并添加至缓存
     2）若不是第一次添加，使num++，并重新将购物信息缓存到数组，并添加至缓存
  3.4 弹出提示
4.实现商品的收藏功能（在获取数据后，进行判断）---主要是根据v.goods_id===this.GoodsInfo.goods_id
 4.1 页面onShow，加载页面缓存的数据
 4.2 判断该商品是否被收藏(在获取得到数据之后才判断)
   是：改变图标
  不是：什么都不用做？
4.3 点击收藏项时，判断商品是否存在缓存数据中：（绑定事件）
     存在：--将该商品从缓存中清除
     不存在：--将该商品添加到缓存数据和data中
 4.3
*/


import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/goods_detail/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:{},
    isCollect:false,  //商品是否被收藏
    collectGoods:[]//收藏的商品
  },
  //全局对象，用户存放请求得到的详情数据，方便在实现收藏数据时对其进行判断对比
  //不同的是下面的goodsDetail做了相应的处理，只返回需要的数据属性，而GoodsInfo是接口的全部数据
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  /*onLoad: function (options) {

    //console.log(options.goods_id)
    const {goods_id}=options
    this.getGoodsDetial(goods_id);
  },*/

  onShow(){
    //因为在onShow方法中使用另外一种方法获取options
    let pages=getCurrentPages();
    let options=pages[pages.length-1].options;
    const {goods_id}=options
    console.log(goods_id);
    //判断商品是否被收藏
    this.getGoodsDetial(goods_id);
  },

  //根据goods_id发送请求，获取指定id的商品详细信息，并将其存到data中，便于遍历显示
  async getGoodsDetial(goods_id){
    var result=await request({url:"/goods/detail",data:{goods_id}})//记得传入数据的类型（是个对象类型）
    //给定义的全局变量赋值（方便下面的赋值）
    this.GoodsInfo=result;
    const collectGoods=wx.getStorageSync('collect')||[];
    //当缓存数据中有collectGoods后，肯定存在一个goods_id
    //但是需要注意确保this.GoodsInfo_goods_id值已经存在
    //因此需要在请求数据完毕后再判断
    let isCollect=collectGoods.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsDetail:{
        goods_name:result.goods_name,
        goods_price:result.goods_price,
        goods_introduce:result.goods_introduce,
        pics:result.pics,
        goods_introduce:result.goods_introduce.replace(/\.webp/g,'.jpg'),
        goods_id:result.goods_id

      },
      isCollect
    })
    //console.log(this.data.goods_datail);
  },


  //点击轮播图预览
  Scanimags(e){

    //构造urls数组(由于goodsDetail数据是请求时赋值的，
    //因此不能直接拿到，需要拿到可以定义一个全局变量GoodsInfo)
    //或者使用this.data.goodsDetail.pics.map(v=>v.pics_mid);
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    //const urls=this.data.goodsDetail.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
     wx.previewImage({
      current, // 当前显示图片的http链接
      urls// 需要预览的图片http链接列表
    });
  },

  //添加购物车
  addCart(e){
    //console.log("tianjia")
    let carts=wx.getStorageSync("cart")||[];//因为第一次时肯定为空字符串，因此使其为空数组的形式
    //查找索引，并返回（因为接下来要判断）
    let index=carts.findIndex(c=>c.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //表示不存在该商品
      //为全局变量GoodsInfo添加一个新的属性
      this.GoodsInfo.num=1;
      this.GoodsInfo.check=true;
      //将更新的GoodsInfo添加至carts数组中
      carts.push(this.GoodsInfo);
    }
    else{
      //表示存在这个id的商品，那么s让该index（即id）的商品num++
      carts[index].num++;
    }
    wx.setStorageSync('cart', carts)
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true//表示时隔1.5s后才能再次点击添加
    });
      
  },

  //收藏商品事件
  collectGood(e){
    /*console.log(e);
    //不需要goods_id做判断，直接this.GoodsInfo
    const {goods_id}=e.currentTarget.dataset;
    const {collectGood}=this.data;
    //this.getGoodsDetial(goods_id);*/
    let isCollect=false;//表示刚开始没有被点击
    //1.获取缓存中的数据collect
    let collect=wx.getStorageSync('collect')||[];
    //判断点击的商品是否存在缓存数据中（即是查找当前的商品id是否等于获取到详情商品的id
    const index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index!=-1){
      //表示缓存数据中已存在该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消收藏',
        icon:'success',
        mask:true
      })
    }else{
      //wx.setStorageSync('collect', this.GoodsInfo)//不存在则添加至缓存数据中
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      })
    }
    wx.setStorageSync('collect', collect);
    //this.data.isCollect=!this.data.isCollect;
    this.setData({
      isCollect
    })

  }
})