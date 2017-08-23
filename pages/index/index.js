var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    // 轮播图效果
    imgUrls: [
      'https://www.huaxinapp.xyz/static/wxss/banner1.png',
      'https://www.huaxinapp.xyz/static/wxss/banner3.png',
      // 'http://img06.tooopengyo.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    isShow:true,
    isBomb:false,
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    // duration: 500,
    isShowTip:false,
    alertText:'',
    // 问答content
    qus:[],
    isLiked:false,
    userId:null,
    isLogin:null,
    pageSize:20,
    pageNum:1,
    anVoiceDurationFm:null,
    e:null,
    // 手机屏幕尺寸
    phoneHeight:null,
    phoneWidth:null,
    imgPfHeight:'190px',
    // 是否有语音正在播放
    isVoicePlaying:false,
    // 语音变量
    preIndex:null,
    // 定时器id
    st:null,
    // userpic:'链接在这~',
  },

  onLoad: function(options) { 
    var that = this;
    // test
    // app.wechatLogin(function(){
    //   that.setData({
    //     userpic:app.globalData.userPic
    //   });
    // });

    util.getPhoneInfo(that,app);
    // 自适应轮播图尺寸
    util.autoPlayImgResize(that,app);
    // console.log(this.data.imgPfHeight)
    this.setData({
      userId:app.globalData.userId,
      isLogin:app.globalData.isLogin
    })

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/getAllQAClientVO.do?pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum+'&userId='+this.data.userId,
      method:'GET',
      header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
      success: function(res) {

        var data = res.data;
        if(data.success){
          // 如果获取成功
          var qus = data.value.list
          if(qus[0] != null){
            console.log(qus)
            for(var i = 0;i<qus.length;i++){
              // 格式化语音时长
              if(qus[i] != null){
                var qu = qus[i]
                if(qu.anVoiceDuration != null){
                  qu.anVoiceDurationFm = util.voiceDuration(qu.anVoiceDuration)
                }
              }
            }
            that.setData({
              qus:qus,
              isShow:true
            });
          }else{
            that.setData({
              isShow:true
            })
          }
          
        }else{
          util.alertShow(that,data.error)
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,res.data.error)
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function(){
    // 加载问答列表，每次加载20个
    var that = this
    this.setData({
      pageNum:this.data.pageNum+1
    })
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/getAllQAClientVO.do?pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum+'&userId='+this.data.userId,
      method:'GET',
      header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
      success: function(res) {

        var data = res.data;
        if(data.success){
          // 如果获取成功
          var qus1 = data.value.list
          if(qus1.length == 0){
            // 没有加载数据
            wx.showToast({
              title: '没有更多了！',
              duration: 10000
            })

            setTimeout(function(){
              wx.hideToast()
            },1000)
          }
          console.log(qus)
          for(var i = 0;i<qus1.length;i++){
            // 格式化语音时长
            var qu = qus1[i]
            qu.anVoiceDurationFm = util.voiceDuration(qu.anVoiceDuration)
          }
          var qus = that.data.qus.concat(qus1)
          that.setData({
            qus:qus,
          });
          console.log(qus)
          wx.stopPullDownRefresh()
        }else{
          util.alertShow(that,'刷新失败！')
          wx.stopPullDownRefresh()
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'刷新失败！')
        wx.stopPullDownRefresh()
      }
    })
    
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },

  turnToNextPage_redirect: function turnToNextPage_redirect(e){
    // 获取页面跳转路径
    util.turnToNextPage_redirect(e);
  },
  // 分享朋友圈效果
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '话心，世界很大，我在这里陪你',
      path: '/page/index/index',
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功！',
          icon: 'success',
          duration: 10000
        });
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '转发失败！',
          icon: 'loading',
          duration: 10000
        });
      }
    }
  },
  // 扫描二维码
  erCodeEvent: function (){
    var that = this
    var isLogin = app.globalData.isLogin
    if(isLogin){
      // 已经登陆
      wx.scanCode({
        success: (res) => {
          // 调用成功
          console.log(res)
          // 二维码内容匹配
          // #acId扫描二维码获得的字符串#
          var acId = res.result
          wx.request({
            url: 'https://www.huaxinapp.xyz/api/activityRecord/activityCheckin.do?userId='+this.data.userId+'&acId='+acId,
            method:'POST',
            header: {
                  'Authorization': 'Bearer '+app.globalData.token
              },
            success: function(res) {
              // 提交签到成功
              var data = res.data;
              console.log(data)
              if(data.success){
                // 如果签到成功
                wx.showToast({
                  title: '签到成功！',
                  icon: 'success',
                  duration: 10000
                })
                this.setData({
                  isBomb:true
                })

                setTimeout(function(){
                  wx.hideToast()
                  wx.navigateTo({
                    url:'../index/index'
                  })
                },3000)
                
              }else{
                if(data.error == '未报名'){
                  // 未报名
                  wx.showToast({
                    title: '请先报名！',
                    icon: 'loading',
                    duration: 10000
                  })

                  setTimeout(function(){
                    wx.hideToast()
                    wx.navigateTo({
                      url:'../action-detail/action-detail?acId='+acId
                    })
                  },3000)
                }
                
                util.alertShow(that,data.error)
              }
            },
            fail:function (res) {
              // body...
              util.alertShow(that,res.data.error)
            }
          })
        },
        fail: () => {
          // 调用失败
          console.log('扫描二维码失败！')
          util.alertShow(that,'扫描二维码失败！')
        },
      })
    }else{
      // 没有登陆
      // 调用登陆接口
      app.wechatLogin(function(){
        // = login
        // wx.hideLoading();
        wx.hideToast();
        if(app.globalData.isLogin){
          // login success
          that.erCodeEvent()
        }else{
          util.alertShow(this,'login faile')
        }
      })
      
    }
  },

  voiceEvent: function (e) {
    // 播放语音接口
    util.voiceEvent(e,this,app)
    
  },

  // 点赞事件
  liking: function (e) {
    // 判断登陆
    util.liking(e,this,app)
    
  },
  // 取消点赞事件
  unLiking: function (e) {
    util.unLiking(e,this,app)
  },

  // 进入问题详情
  turnToQu: function (e) {
    var that = this
    // var role = app.globalData.roleType
    var isLogin = app.globalData.isLogin
    if(isLogin){
      var quId = e.currentTarget.id;
      // console.log(role)
      // role = 1
      // if(role == 0){
      //   // normal user
      //   wx.navigateTo({
      //     url:'../question-detail/question-detail?quId='+quId,
      //   })
      // }else if(role == 1){
      //   // private user
      //   wx.navigateTo({
      //     url:'../answer-question/answer-question?quId='+quId,
      //   })
      // }
      wx.navigateTo({
        url:'../question-detail/question-detail?quId='+quId,
      })
    }else{
      // has not login 
      app.wechatLogin(function(){
        //  login success
        // wx.hideLoading();
        wx.hideToast();
        if(app.globalData.isLogin){
          // login success
          that.turnToQu(e)
        }else{
          util.alertShow(that,'login faile')
        }
      })
    }
    
  },

  // 跳转到搜索页面
  turnToSearch:function function_name(argument) {
    wx.redirectTo({
      url:'../search/search?keyIp='+''
    })
  },

  // imgEve:function function_name(e) {
  //   // 首页轮播图跳转
  //   var index = e.currentTarget.id
  //   var url = null

  //   switch(index){
  //     case '0':
  //     url = 'http://url.cn/464ms7I'
  //     break;
  //     case '1':
  //     url = 'http://url.cn/464ms7I'
  //     break;
  //     case '2':
  //     url = 'http://url.cn/464ms7I'
  //     break;
  //   } 

  //   wx.navigateTo({
  //     url:url
  //   })
  // },
  
  // turnToIntegral:function function_name(argument) {
  //   // 跳转到提问页面
  //   // 判断是否登陆
  //   var isLogin = app.globalData.isLogin
  //   var that = this
  //   if(isLogin){
  //     wx.navigateTo({
  //       url:'../my-integral/my-integral'
  //     })
  //   }else{
  //     app.wechatLogin(function(){
  //       //  login success
  //       // wx.hideLoading();
  //       wx.hideToast();
  //       if(app.globalData.isLogin){
  //         // login success
  //         that.turnToIntegral();
  //       }else{
  //         util.alertShow(that,'login faile')
  //       }
  //     })
  //   }

  // },

  turnToMine:function function_name() {
    // 跳转到我的页面
    // 判断是否登陆
    var isLogin = app.globalData.isLogin
    var that = this
    if(isLogin){
      // 已经登陆
      wx.redirectTo({
        url:'../mine/mine'
      })
    }else{
      // 没有登陆
      // 调用登陆接口
      app.wechatLogin(function(){
        // = login
        // wx.hideLoading();
        wx.hideToast();
        if(app.globalData.isLogin){
          // login success

          that.turnToMine()
        }else{
          util.alertShow(that,'login faile')
        }
      })
    }
  },
// turn to ask page
  turnToAsk:function function_name() {
    // 跳转到我的页面
    // 判断是否登陆
    var isLogin = app.globalData.isLogin
    var that = this
    if(isLogin){
      // 已经登陆
      wx.redirectTo({
        url:'../ask/ask'
      })
    }else{
      // 没有登陆
      // 调用登陆接口
      app.wechatLogin(function(){
        // = login
        // wx.hideLoading();
        wx.hideToast();
        if(app.globalData.isLogin){
          // login success

          that.turnToAsk()
        }else{
          util.alertShow(that,'login faile')
        }
      })
    }
  },
})