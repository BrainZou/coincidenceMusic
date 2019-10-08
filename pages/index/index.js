//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    myUserName: '',
    otherName: '',
  },
  
  /*获取自己的用户名***/
  myUserNameInput: function(e) {
    this.setData({
      myUserName: e.detail.value
    })
  },
  /*获取对方的用户名***/
  otherNameInput: function(e) {
    this.setData({
      otherName: e.detail.value
    })
  },
  /**查询提交 */
  sumbit: function(e) {
    var page = this;
    if (this.data.myUserName == '') {
      wx: wx.showToast({
        title: '请输入你的姓名',
        icon: 'none'
      })
      return false
    }
    else if (this.data.otherName == '') {
      wx: wx.showToast({
        title: '请输入对方的用户名',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/detail/detail?myUserName=' + this.data.myUserName + '&otherName=' + this.data.otherName
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '网易云歌单重合率',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'none'
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon: 'none'
        })
      }
    }
  }

})