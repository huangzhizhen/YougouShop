//由于会出现同步发送多个异步请求，因此需要等待全部请求完毕时再关闭加载中的效果
let ajaxTime=0;
export const request=(params)=>{

    //判断url中是否带有/my/  请求时私有的路径 有则使得 header带上token
    let header={...params.header}
    if(params.url.includes("/mg/")){
        //拼接header 带上token(若没有则直接使用params传过来的参数)
        header["Authorization"]=wx.getStorageSync('token');
    }
    ajaxTime++;
    /*发送请求之前显示加载信息 */
    wx.showLoading({
        title:"加载中",
        mask: true,
    });
    const urlBase="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((reslove,reject)=>{
        /*reslove、reject分别为两种接口返回的回调函数，
        回调函数中具体 */
        //对url进行简化，拼接
        var reqTask = wx.request({
           ...params,/*接收到的的参数将被放在这里（对象形式） */
           header:header,
           url:urlBase+params.url,
           success:(result)=>{
               reslove(result.data.message);
           },
           fail:(err)=>{
               reject(err);
           },
           complete:()=>{
               ajaxTime--;
               if(ajaxTime===0){
                 //在前面添加了++表示每有一个发送请求就自增一次，但每有一个完成请求就自减一次，
                //知道ajaxTime=0后，所有数据请求完毕，这时便可以关闭加载中的效果
                wx.hideLoading();
               }
               //不管成功还是失败都会调用该方法        
           }
        });
          
    })
}