var util = require('../../utils/util.js');
var app =getApp()
Page({
  data:{
    isShow:false,
    isShow2:true,
    pageSize:20,
    pageNum:1,
    userId:null,
    // 首先显示已报名
    qus:null,
    quTypeShow:0,
    e:null,
    isDfShow:false,
    isShowTip:false,
    alertText:'',
    // tab var
    // e:{currentTarget:{dataset:{type:'0'}}},
  },

  onLoad:function function_name(options) {
    var that = this
    var userId = app.globalData.userId
    this.setData({
      userId:userId,
    })
    // 获取我的提问
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/getMyAskingQAClientVO.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(res.data.success){
          // 如果认证成功
          // 获取活动数组
          var qus = res.data.value.list
          var isDfShow = false
          if(qus == null){
            isDfShow = true
          }
          that.setData({
            qus:qus,
            isShow:true,
            isDfShow:isDfShow,
          })
          console.log(qus)
        }else{
          util.alertShow(that,'调用失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'调用失败！')
      }
    })
  },
  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },

  switchTab:function (e) {
    // 我的活动页面切换tab
    var quTypeShow = e.currentTarget.dataset.type;
    var that = this

    that.setData({
      quTypeShow:quTypeShow,
      isShow2:false,
      pageNum:1,
    })
    if(quTypeShow == '0'){
      // 我的提问
      console.log(app.globalData.token)
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/qa/getMyAskingQAClientVO.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum,
        method:'GET',
        header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
        success: function(res) {
          // 成功获取活动列表
          var data = res.data
          console.log(data)
          if(res.data.success){
            // 如果认证成功
            // 获取活动数组
            var qus = res.data.value.list
            wx.showToast({
              title: '加载中',
              icon: 'loading',
              duration: 100000
            })
            that.setData({
              qus:qus,
              isShow2:true,
            })
            wx.hideToast()
            console.log(qus)
          }else{
            util.alertShow(that,'加载失败！')
          }
        },
        fail:function (res) {
          // body...
          util.alertShow(that,'加载失败！')
        }
      })
    }else{
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/qa/getMyAnsweringQAClientVO.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum,
        method:'GET',
        header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
        success: function(res) {
          // 成功获取活动列表
          var data = res.data
          console.log(data)
          if(res.data.success){
            // 如果认证成功
            // 获取活动数组
            var qus = res.data.value.list
            wx.showToast({
              title: '加载中',
              icon: 'loading',
              duration: 10000
            })
            that.setData({
              qus:qus,
              isShow2:true,
            })
            wx.hideToast()
            console.log(qus)
          }else{
            util.alertShow(that,'加载失败！')
          }
        },
        fail:function (res) {
          // body...
          util.alertShow(that,'加载失败！')
        }
      })
    }
  },

  // 下拉刷新
  onPullDownRefresh: function(){
    // 下拉加载问答列表，每次加载20个
    var pageNum = this.data.pageNum+1
    var quTypeShow = this.data.quTypeShow;
    var that = this

    that.setData({
      pageNum:pageNum,
    })
    if(quTypeShow == '0'){
      // 我的提问
      console.log(app.globalData.token)
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/qa/getMyAskingQAClientVO.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum,
        method:'GET',
        header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
        success: function(res) {
          // 成功获取活动列表
          var data = res.data
          console.log(data)
          if(res.data.success){
            // 如果认证成功
            // 获取活动数组
            var qus = res.data.value.list
            if(qus.length == 0){
              // 没有加载数据
              wx.showToast({
                title: '没有更多了！',
                duration: 10000
              })

              setTimeout(function(){
                wx.hideToast()
              },1000)
            }
            var qus = that.data.qus.concat(qus)
            // wx.showToast({
            //   title: '加载中',
            //   icon: 'loading',
            //   duration: 1000000
            // })
            that.setData({
              qus:qus,
              isShow2:true,
            })
            // wx.hideToast()
            console.log(qus)
             wx.stopPullDownRefresh()
          }else{
            util.alertShow(that,'加载失败！')
             wx.stopPullDownRefresh()
          }
        },
        fail:function (res) {
          // body...
          util.alertShow(that,'加载失败！')
           wx.stopPullDownRefresh()
        }
      })
    }else{
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/qa/getMyAnsweringQAClientVO.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum,
        method:'GET',
        header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
        success: function(res) {
          // 成功获取活动列表
          var data = res.data
          console.log(data)
          if(res.data.success){
            // 如果认证成功
            // 获取活动数组
            var qus = res.data.value.list
            if(qus.length == 0){
              // 没有加载数据
              wx.showToast({
                title: '没有更多了！',
                duration: 10000
              })

              setTimeout(function(){
                wx.hideToast()
              },1000)
            }
            var qus = that.data.qus.concat(qus)
            // wx.showToast({
            //   title: '加载中',
            //   icon: 'loading',
            //   duration: 100000
            // })
            that.setData({
              qus:qus,
              isShow2:true,
            })
            // wx.hideToast()
            console.log(qus)
             wx.stopPullDownRefresh()
          }else{
            util.alertShow(that,'加载失败！')
             wx.stopPullDownRefresh()
          }
        },
        fail:function (res) {
          // body...
          util.alertShow(that,'加载失败！')
           wx.stopPullDownRefresh()
        }
      })
    }
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

  voiceEvent: function (e) {
    // 播放语音接口
    util.voiceEvent(e,this,app)
    
  },

  // 跳到活动详情页面
  // 进入问题详情
  turnToQu: function (e) {
    var that = this
    // var role = app.globalData.roleType
    var quId = e.currentTarget.id;
    // console.log(role)
      
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
  },
})
