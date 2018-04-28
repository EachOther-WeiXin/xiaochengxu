// pages/today/today.js
const config = require('../../config.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trains: []
  },


  onShow: function (options) {
    var that = this;
    while (app.globalData.token) {
      that.getTrains();
      return;
    }

  },
  getTrains: function () {
    var that = this;
    wx.request({
      url: config.requestUrl + 'train/today_list',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.token
      },
      success: res => {
        console.log(res);
        this.setData({
          trains: res.data.data
        })
      },
      fail: res => {
        console.log(res);
        wx.showToast({
          title: '服务异常,请稍后重试',
          icon: 'none'
        })
      }

    })
  }

})