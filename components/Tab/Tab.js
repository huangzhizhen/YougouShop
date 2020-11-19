// components/Tab/Tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //表示当在父组件中引入了Tab组件
    //并点击了该组件的某个项后--由于绑定了changeItemActive事件，在wxml中使用data-index="{{index}}传递了index参数
    //这里是现在子组件Tab中获取到传过来对应的index值，使其作为参数像父组件传递
    //同时使用 this.triggerEvent调用父组件的方法，实现效果

    //<Tab tabs="{{tabs}}" bindtabItemChange="handleTabItem">
    //以上是父组件的使用
    /**
     *  handleTabItem(e){
          //相当于过滤，只对满足条件的tabs[i]的isActive进行改变
          var {index}=e.detail; //得到子组件传过来的index
          //console.log(index);
          var {tabs}=this.data;
          tabs.map((v,i)=>i===index?v.isActive=true:v.isActive=false);
          this.setData({
            tabs
       })
     },
     */
    changeItemActive(e){
      const {index}=e.currentTarget.dataset;
      this.triggerEvent("tabItemChange",{index});
    }
  }
})
