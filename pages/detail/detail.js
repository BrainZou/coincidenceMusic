//detail.js
//获取应用实例
const app = getApp()

Page({
  data: {
    myUserName: '',
    otherName: '',
    myUserId: 0,
    otherId: 0,
    myPlayListId: 0,
    otherPlayListId: 0,
    count: 0,
    coincide: 0,
    coincidenceRate: 0,
    coincideSongs: [],
    coincideSongsDetail: [],
    anim:[{}],
    loadingOne: false,
    loadingTwo: false,
  },

  onLoad: function (options) {
    this.setData({
      myUserName: options.myUserName,
      otherName: options.otherName
    })
  },
  onReady: function (options) {
    this.start();
},

 
  /**查询提交 */
  start: function () {
    var page = this;
    console.log("myUserName：" + this.data.myUserName + " otherName：" + this.data.otherName);
    page.textShow(0);
    page.textShow(1);
    page.setData({
      loadingOne: true
    })
    this.getUserId(this.data.myUserName, function (data) {
      page.setData({
        myUserId: data
      })
      page.textShow(2);
        page.getUserId(page.data.otherName, function (data) {
          page.setData({
            otherId: data
          })
          page.textShow(3);
          page.getPlayListId(page.data.myUserId, function (data) {
            page.setData({
              myPlayListId: data
            })
            page.textShow(4);
          page.getPlayListId(page.data.otherId, function (data) {
            page.setData({
              otherPlayListId: data
            })
            page.textShow(5);
            //这里拿到了用户Id 歌单ID了
            console.log(page.data)
            //获取自己喜欢的歌曲
            page.getLikeSongs(page.data.myPlayListId, function (data) {
              var mySongs = data;

              //获取对方喜欢的歌曲
              page.getLikeSongs(page.data.otherPlayListId, function (data) {
                var otherSongs = data;
                //计算重合歌曲 重合率
                page.repetitiveRateSongs(mySongs, otherSongs);
                page.getSongDetail(page.data.coincideSongs, function (data) {
                  let songsDetail = [];
                  if (typeof (data) == "undefined"){
                    wx.showToast({
                      title: '重复歌曲过多',
                      icon: 'none'
                    }),
                    page.setData({
                      loadingTwo: false,
                    })
                    return;
                  }
                  data.forEach(function (item) {
                    if(songsDetail.length == 0){
                      songsDetail.push(item.name);
                    }else{
                      songsDetail.push('\n' + item.name);
                    }
                  })
                  page.setData({
                    loadingTwo: false,
                    coincideSongsDetail: songsDetail
                  })
                  page.textShow(9);
                })
              })
            })
          });

        });
      });

    });
  },

  /*获取用户Id***/
  getUserId: function (userName, callback) {
    var url = 'https://node.brainzou.com/search?type=1002&keywords=' + userName;
    wx.request({
      url: url,
      header: {
        'content-type': 'Application/json'
      },
      method: 'GET',
      success: function (res) {
        var users = res.data.result.userprofiles;
        let find = false;
        users.forEach(function (item) {
          if (userName == item.nickname) {
            find = true;
            callback(item.userId);
            return;
          }
        });
        if(!find){
          wx.showToast({
            title: '请确认用户名是否正确',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        callback(res);
      }
    })
  },

  /*获取用户喜欢歌单的ID***/
  getPlayListId: function (userId, callback) {
    var url = 'https://node.brainzou.com/user/playlist?uid=' + userId;
    wx.request({
      url: url,
      header: {
        'content-type': 'Application/json'
      },
      method: 'GET',
      success: function (res) {
        callback(res.data.playlist[0].id);
      },
      fail: function (res) {
        callback(res);
      }
    })
  },

  /*获取用户喜欢歌曲***/
  getLikeSongs: function (playListId, callback) {
    var url = 'https://node.brainzou.com/playlist/detail?id=' + playListId;
    wx.request({
      url: url,
      header: {
        'content-type': 'Application/json'
      },
      method: 'GET',
      success: function (res) {
        var ids = [];
        res.data.playlist.trackIds.forEach(function (item) {
          ids.push(item.id);
        })
        callback(ids);
      },
      fail: function (res) {
        callback(res);
      }
    })
  },

  /*获取歌曲详情*/
  getSongDetail: function (songIds, callback) {
    var url = 'https://node.brainzou.com/song/detail?ids=' + this.getTextByJs(songIds);
    wx.request({
      url: url,
      header: {
        'content-type': 'Application/json'
      },
      method: 'GET',
      success: function (res) {
        callback(res.data.songs);
      },
      fail: function (res) {
        callback(res);
      }
    })
  },

  repetitiveRateSongs: function (songIds1, songIds2) {
    var page = this;
    // 交集
    let coincide = songIds1.filter(function (v) { return songIds2.indexOf(v) > -1 });
    // 并集
    let union = songIds1.concat(songIds2.filter(function (v) { return !(songIds1.indexOf(v) > -1) }));;
    this.setData({
      coincide: coincide.length,
      count: union.length,
      coincidenceRate: coincide.length  / union.length *100,
      coincideSongs: coincide,
      loadingOne:false,
      loadingTwo:true
    })
    page.textShow(6);
    page.textShow(7);
    page.textShow(8);
    console.log(this.data);
  },

  //用，分隔数组
  getTextByJs: function (arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
      str += arr[i] + ",";
    }
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (str.length > 0) {
      str = str.substr(0, str.length - 1);
    }
    return str;
  },

  textShow:function(index){
    var animation = wx.createAnimation({
      duration: 2000,
    });
    var key = 'anim[' + index + ']';
    animation.opacity(1).step({})
    this.setData({
      [key] : animation.export(),
    })
  },

 onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '网易云歌单重合率',
      path: '/pages/detail/detail?myUserName=' + this.data.myUserName + '&otherName=' + this.data.otherName,
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