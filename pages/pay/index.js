/**1.
 * 商品支付的页面和购物车差不多
 * 这里主要时有一个将cartList数组过滤筛选的步骤
 * 主要时筛选出被选择的商品，再显示在支付页面中（而购物车显示的是全部加购的商品）-----一句话：加入购物车不一定购买
 * 
 */

/**2.微信支付功能的实现
 *   2.1 微信支付
 *     2.1.1 哪些人、哪些账号可以实现微信支付
 *       1）企业账号
 *       2）企业的小程序后台，或给开发者添加上白名单
 *           白名单:  一个appid可以同时绑定多个开发者
 *                    这些开发者可以公用这个appid和它的开发权限
 *    2.2 支付（这里的支付会实际连接到用户，因此会涉及到权限问题）
 *      1）点击支付，判断缓存中是否有用户的token类似唯一身份证---对于token（详细看参考文档）
 *      2）若没有，则跳转到授权auth页面，进行获取token（即授权）--
 *      3）有token，再进行其他操作（如创建订单等）
 *      4）当已经完成了微信支付后（成功）
 *         4）1 则需要删除缓存在购物车中被选中的且支付完毕的商品
 *         4）2 删除后的购物车数据 再填充到缓存数据（更新）
 *         5）3 再跳转页面
 *     
 *3.总结:
    3.1 这个支付功能的步骤实质是一步一步的实现的，不断的嵌套，获取到每一步接口请求的来的信息
    3.2 得到信息，再传入下一个接口
    3.3 最终调用微信小程序内部的支付功供wx.requestPaymen()，当用户扫码成功时，小程序后台会自动返回ok等信息   
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/WxApi.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cartList: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    const address = wx.getStorageSync('address');
    let cartList = wx.getStorageSync('cart') || []; //防止没有数据时，调用数组函数时报错
    cartList = cartList.filter(v => v.check);
    //this.setCartList(cartList);
    this.setData({
      address
    });
    let totalPrice = 0;
    let totalNum = 0;
    //这里可以使用reduce，若使用会涉及三层循环，性能不佳，因此考虑用forEach直接循环
    cartList.forEach(v => {
      if (v.check) { //表示被选中时
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }
    });
    this.setData({
      cartList,
      totalPrice,
      totalNum
    })
  },

 async handelPay() {

  try {
    //1.判断缓存中是否有有token，若没有则跳转到授权页面auth
    const token = wx.getStorageSync('token');
    //2.由于没有企业账号，因此我获取到的token值是null，这里先模拟大概流程，真正开发时会获取即可
    //改了这里不会再跳转到auth页面获取授权（哭！！！没有企业账号）
    if (token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    } else {
      //3.授权成功---
      console.log("授权成功");
      //3.1 准备--请求头信息
      //const header={Authorization:token};
      //3.2 准备---请求体参数
      const order_price=this.data.totalPrice;
      const consignee_addr=this.data.address.all;
      const cartList=this.data.cartList;
      //3.3 准备--goods数组
      let goods=[];
      cartList.forEach(v=>{
        goods.push({
          goods_id:v.gooods_id,
          goods_number:v.num,
          goods_price:v.goods_price
        });
      });
      const orderParams={order_price,consignee_addr,goods}
      //4 得到以上准备的请求体参数之后，发送请求获取订单数据(实际详见开发文档)
     // const {order_number}=await request({url:"/my/orders/create",method:"post",data:orderParams,header:header});////request中封装了header，这里删掉
     const {order_number}=await request({url:"/my/orders/create",method:"post",data:orderParams});
      //console.log(res);
      //5 获取到以上的订单数据后，根据参数发送请求获取订单状态信息-
          //5.1  再根据得到的预支付信息，调用小程序内部的预支付功能（wx.requestPayment)，实现订单信息的获取
      const {pay}=await request({url:"my/orders/chkOrder",method:"post",data:{order_number}})
      //6. 直接发起微信支付（当你扫码支付成功时会返回一个ok等，可以通过console打印查看
      await requestPayment(pay);
       //7.发送请求查询后台订单状态
       const res=await request({url:"",method:"post",data:{order_number}})
       await showToast({text:"支付成功"});
       //8 手动删除缓存中 已经支付的商品
       //疑问？为什么在onshow中以及获取cartList，在这里还需要再次获取呢？
       //因为在上方获取的data里面的数据已经进行了过滤操作，只对选中的商品结算支付
       //而这里是要返回购物车，清掉已经支付的商品，留下未支付的商品，因此需要到缓存数据中再次获取
       let newcartList=wx.getStorageSync('cart');
       newcartList=newcartList.filter(v=>!v.check);
       wx.setStorageSync('cart', newcartList);
       //9 支付成功之后跳转到订单页面
       wx.navigateTo({
         url: '/pages/order/index',
       })
    }
  } catch (error) {
    await showToast({text:"支付失败"});
    console.log(error);
  }
  }

})