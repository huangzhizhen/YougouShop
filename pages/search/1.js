Page({

    TimeId: -1,

    handleInput(e) {
        
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.getResult(value);
        }, 1000)
    },

    //发送请求获取搜索结果数据
    async getResult(query) {
        const res = await request({
            url: "/goods/qsearch",
            data: {
                query
            }
        });
        console.log(res);
        this.setData({
            goods: res
        })
    },

    /*this.getResult(value);*/
})