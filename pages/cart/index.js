// pages/cart/index.js

/*
1.实现获取地址效果
 1.1 使用小程序内置的api，获取用户的收货地址---wx.chooseAddress
 1.2但是1）是要和 一起使用（因为小程序内置的获取收获地址的api是有两个选项供用户--1=》取消---2》确定
  1.2.1 因此，获取用户对小程序所授予的地址的权限、状态、即scope值
    1）假设用户点击获取收获地址的框的确认选项--得到Setting属性的scope.address值
       当scope值为true时，这时可以直接调用收货地址（此时用户已同意）
    2）假设 用户从来没有调用过小程序的获取地址的api，此时scope为undifined，此时也直接调用、获取收货地址
    3）假设用户点击获取收获地址的提示框的取消选项，
         这时应该诱导用户自己打开授权设置界面，当用户重新给与获取地址的权限时，再次调用api获取用户地址
  2.实现button添加地址是否显示
    2.1 在页面加载时判断本地缓存中是否有缓存了用户地址信息(用在data中用address来接收本地缓存，判断address即可)
       有---则不显示添加地址信息button
       无---则显示地址信息
获取收获地址的提示框
 */
/**
 * 一、购物车内容显示分析
 *  1.由于在商品详情中，当点击加入购物车时同时将数据存到了本地内存中
 *  2.在onShow中先获取本地内存中被加购的数据
 *  3.然后循环显示
 *  4.对于num值，是看当时被点击了多少次
 *  5.同时在cartDetail的加购操作--即当是第一次被点击时，添加一个属性
 *   5.1 this.GoodDetial.check=true
 *       this.GoodDetial.num=1
 *   5.1不是第一次时，只让它的num++即可，不同重复缓存整个数据
 */

/**
 * 二、实现全选
 * 0.在onShow中获取数据
 * 1.当全部商品选中时，下方的全选复选框也被选中
 * 2.当下方的复选框全选是，上面的商品也被同步全选
 * 3.当有一个商品没有被选中时，则下方的全选框不被选中
 */

/**三、总价格和总数量的
 * 计算总价格是计算被选中商品的价格
 * 获取商品的信息----遍历
 * 当被选中时：
 *   总价格：sum+=num*price
 *   总数量：num+=num
 * 最后将sum、num返回给data商品即可
 */

/**四、商品选中功能实现
 * 绑定change事件（注意：事件的绑定是在checkbox-group上）
 * 获取被修改的商品对象
 * 点击时，对商品的check取反
 * 要对缓存在本地数据的check改变，同时也要改变data中的数据
 * 再重新计算总数，总价格、全选等状态（需要封装代码不然很繁琐）
 */

/**五、实现全选和不全选功能
 * 1.为全选复选框checkbox-group绑定事件
 * 2.获取data中的 cartList、与isAllChoose（全选）
 *   让isAllChoose取反
 * 3.遍历cartList，让其随着isAllChoose的值变
 * 4. 当全选时：让isAllChoose为true，
 *    当不全选时：让isAllChoose为false
 *    对于cartList数组中的每个check，循环跟着isAllChoose的true或者fasle变即可
 * 5.最后将cartList、isAllChoose更新
 */

/**六、实现商品数量的增加+与减少-（实质cartList.num变化引起页面中的num显示）
 * 1.首先为+与-绑定同一个事件（以绑定的属性区分开），同时需要传递goods_id
 * 2.获取data中的cartList数组
 * 3.+、- 直接修改cartList.num值
 * 4.this.setCartList(cartList)
 */

 /**七、实现结算功能
  * 1.为起绑定事件
  * 2.当点击时
  *   2.1 判断用户是否添加地址
  *   2.2 判断是否勾选商品
  *   2.3 若没有，分别弹出提示
  * 3.经过以上的验证之后，跳转到支付也页面
  * 
  * 
  */
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/WxApi.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cartList: [],
    isAllChoose: false,
    totalPrice: 0,
    totalNum: 0,
    islogin:false
  },

  onShow() {
    const address = wx.getStorageSync('address');
    const cartList = wx.getStorageSync('cart') || []; //防止没有数据时，调用数组函数时报错
    this.setCartList(cartList);
    this.setData({
      address
    })
    this.loginuser();
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

  //s商品是否选中的状态
  handelChangeItem(e) {
    //const cartList=this.data.cartList;
    //1.获取被修改商品的id
    const goods_id = e.currentTarget.dataset.id;
    //2.获取购物车的商品对象
    let {
      cartList
    } = this.data;
    //console.log(e);
    /*if(cartList.goods_id===goods_id){
      cartList.check=!cartList.check;
    }*/
    //3.找到被修改商品的对象
    let index = cartList.findIndex(v => v.goods_id === goods_id)
    //4.选中状态取反
    cartList[index].check = !cartList[index].check;
    //5.更新缓存数据与data中的数据
    /*this.setData({
      cartList
    });
    wx.setStorageSync('cart', cartList)
    //6.重新计算总价格以及总数量*/
    this.setCartList(cartList);

  },

  //封装购物车状态（即设置购物车状态的同时 重新计算 底部工具栏的数据：全选、总价格、总数量
  setCartList(cartList) {
    //即在触发事件的时候只要计算好cartList数组即可
    //弄清楚every函数的返回值
    //every一个回调函数，当循环每个回调函数值均为true时，every才返回true||当为空数组时也返回true
    //当有一个回调函数值为false时，不再循环，every直接返回false
    //v=>v.check执行即是因为刚开始我们默认每个cart均被选中的状态，当我们手动取消选中时
    let isAllChoose = true;
    let totalPrice = 0;
    let totalNum = 0;
    //这里可以使用reduce，若使用会涉及三层循环，性能不佳，因此考虑用forEach直接循环
    cartList.forEach(v => {
      if (v.check) { //表示被选中时
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        isAllChoose = false;
      }
    });
    isAllChoose = cartList.length != 0 ? isAllChoose : false; //避免当cartList为空时，不会进入循环，那么全选框的值不会改变
    this.setData({
      cartList,
      isAllChoose,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cartList);
  },

  //实现全选与反选
  handelAllChoose() {
    //注意let与const的使用
    let {
      cartList,
      isAllChoose
    } = this.data;
    isAllChoose = !isAllChoose;
    cartList.forEach(v => v.check = isAllChoose);
    this.setCartList(cartList);
  },

  //实现+与-
  async countNum(e) {
    let {
      cartList
    } = this.data;
    const goods_id = e.currentTarget.dataset.id;
    const operation = e.currentTarget.dataset.operation;
    //const {goods_id,operation}=e.currentTarget.dataset;
    //获取被修改的商品的索引
    const index = cartList.findIndex(v => v.goods_id === goods_id);
    if (cartList[index].num === 1 && operation === -1) {
      const res = await showModal({content: "您是否要删除？"});
      if (res.confirm) {
        cartList.splice(index, 1);
        this.setCartList(cartList);
      }
    }
    else {//进行正常的修改数量
      cartList[index].num += operation;
      this.setCartList(cartList);
    }
  },
  /*if(operation===1){
    cartList[index].num+=1;
  }
  else{
    if(operation===-1&&cartList[index].num>1){
      //当num<0时，不能继续减
      //当num为0时，要考虑将该商品从cartList中提出
      cartList[index].num-=1;
    }else{
      wx.showModal({
        title: '提示',
        content: '提确认要删除该商品吗',
        success :(res) =>{
          if (res.confirm) {
            cartList.splice(index,1)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  }
  }
  this.setCartList(cartList);*/

  //点击结算功能
  async payAll(){
    //console.log("svl")
    const {address,totalNum}=this.data; 
    /*var carts=cartList.includes(v=>{
      v.check===true//使用包含函数includes来判断是否有商品被选中,以下直接使用totalNum来做判断
    })*/
    if(!address){
      //wx.showToast({ title: '请添加收货地址'})
      await showToast({text:'请添加收货地址'});
      return;
    }
   if(totalNum===0){
     // wx.showToast({title: '请选择需要结算的商品'})
     await showToast({text:'请选择需要结算的商品'});
     return;
    }

    wx.navigateTo({
      url: '/pages/pay/index',
    })

  },
  //判断用户是否已经登录

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