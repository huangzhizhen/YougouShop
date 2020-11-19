export const getSetting = () => {

    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

//封装弹框函数(--content可由外部传入--)
/**
 * 使用
 * const res=awit showModal({content:"您是否要删除？"})
 * 返回值res（有confirm、
 * 接着逻辑判断即可(res.confirm表示点击了确认)
 * if(res.confirm){
 * }.......
 * 
 */
export const showModal = ({
    content
}) => {
    return new Promise((reslove, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                reslove(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}


export const showToast = ({text}) => {
    return new Promise((reslove, reject) => {
        wx.showToast({
            title: text,
            //content:text,
            success: (res) => {
                reslove(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

//封装登录函数
export const login = () => {
    return new Promise((reslove, reject) => {
        wx.login({
            success: (res) => {
                reslove(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

//封装小程序内部的支付功能
/**
 * pay支付所必要的参数
*/
export const requestPayment = (pay) => {
    return new Promise((reslove, reject) => {
        wx.requestPayment({
            /*nonceStr: 'nonceStr',
            package: 'package',
            paySign: 'paySign',
            timeStamp: 'timeStamp',*/
            ...pay,
            success: (res) => {
                reslove(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}