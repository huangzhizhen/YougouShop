//Page Object
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        leftcateList:[],//左边得数据
        rightcateList:[],//右边得数据
        currentIndex:0,//表示当前被选中得索引
        scroeTop:0,//右侧滚动条距离顶部得距离
    },
    Cates:[], //存放全部数据
    //options(Object)
    onLoad: function(options) {
      /**
       * 1.先判断本地存储中有没有旧的数据
       *   1.1存储方式：以对象得形式存储
       *        {time:Date.now(),data:[...]}
       * 2.有旧数据且没有过期，则直接获取本地存储得数据以显示
       * 3.若没有旧数据，则直接发送请求
       */
      //1.获取本地存储中得数据（次奥程序也是有本地存储技术）
      const Cates=wx.getStorageSync('cates');
      if(!Cates){
        //没有数据时
        this.getCates();
      }
      else{
        //有数据时
        //有旧数据，定义过期时间（自定义）10s
        if(Date.now()-Cates.time>1000*10){
          //若超时，则需要重新发送请求
          this.getCates();
          //console.log('可以请求数据');
        }
      //有旧数据且不过期时
      else{
        this.Cates=Cates.data;
        let leftcateList=this.Cates.map(v=>v.cat_name);
          //const leftcateList=this.Cates.cat_name
        let rightcateList=this.Cates[0].children;
        this.setData({
            leftcateList,
            rightcateList
          })
          
      }
      }
       
    },
   /* getCates1(){
        request({url:'/categories'})
        .then((result)=>{
          //this.Cates=result.message;
          console.log(result.data.message)
          this.Cates=result.data.message;

          //这里已经确保获取到数据，因此将其存储到本地中

          wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
          //循环得到每一个cat_name
          let leftcateList=this.Cates.map(v=>v.cat_name)
          //const leftcateList=this.Cates.cat_name
          let rightcateList=this.Cates[0].children
          this.setData({
            leftcateList,
            rightcateList
          })
          
        })
      },*/

      async getCates(){
        var result=await request({url:'/categories'});
        this.Cates=result;

          //这里已经确保获取到数据，因此将其存储到本地中

          wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
          //循环得到每一个cat_name
          let leftcateList=this.Cates.map(v=>v.cat_name)
          //const leftcateList=this.Cates.cat_name
          let rightcateList=this.Cates[0].children
          this.setData({
            leftcateList,
            rightcateList
          })
      },
    //左侧菜单得点击事件
    handleItemTap(e){
      console.log(e);
      //1.通过事件源获取被点击得标题身上得索引
      //2.给data中得currtntIndex赋值
      //3.根据不同得索引来渲染右侧得商品内容
      const {index}=e.currentTarget.dataset;
      let rightcateList=this.Cates[index].children
      this.setData({
        currentIndex:index,
        rightcateList,
        //重新设置右侧scroll-view标签距离顶部得距离
        scrollTop:0
      });
      
    }
});
  