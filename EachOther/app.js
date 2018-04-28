//app.js
const config = require('/config.js')

App({
  globalData: {
    userInfo: null,
    token: null
  },
  onLaunch: function () {
    var that = this;
    var token = wx.getStorageSync("token");
    console.log("token==" + token);
    if (token) {
      that.globalData.token = token;
      that.globalData.userInfo = wx.getStorageSync("userInfo");
      return;
    }
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        wx.request({
          url: config.requestUrl + 'user/login',
          data: {
            code: res.code
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 200) {
              console.log("登陆接口返回" + res.data.data);
              console.log(that);
              that.globalData.token = res.data.data;
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  console.log(res);
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        console.log(res);
                        wx.setStorageSync({
                          key: 'userInfo',
                          data: res.userInfo
                        });
                        that.globalData.userInfo = res.userInfo;
                        that.updateUserInfo(res.userInfo);
                      }
                    })
                  } else {
                    wx.getUserInfo({
                      success: res => {
                        console.log(res);
                        wx.setStorageSync({
                          key: 'userInfo',
                          data: res.userInfo
                        });
                        that.globalData.userInfo = res.userInfo;
                        that.updateUserInfo(res.userInfo);
                      }
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '服务异常,请稍后重试!',
              })
            }
          }
        })
      }
    });
  },
  updateUserInfo: function (userInfo) {
    var that = this;
    console.log(userInfo);
    wx.request({
      url: config.requestUrl + 'user/updateUserInfo',
      data: userInfo,
      header: {
        'Authorization': 'Bearer ' + this.globalData.token
      },
      method: 'POST',
      success: res => {
        if(res.data.code != 200) {
          wx.showToast({
            title: '微信登陆异常',
            icon: 'none'
          })
        } else {
          wx.setStorage({
            key: 'token',
            data: this.globalData.token
          })
        }
      }
    })
  }
  
})