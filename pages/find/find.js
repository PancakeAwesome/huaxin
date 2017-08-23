var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    pageNum:1,
    pageSize:20,
    acType:[1,2,3,4,5,6,7,8,9,21,22,23,24],
    acTypeFilterFlag:false,
    acs:[],
    isShow:false,
    acTypeShow:0,
    startTimeFm:null,
    endTimeFm:null,
    isShowTip:false,
    alertText:'',
  },

  onLoad:function (options) {
    // 获取活动列表
    var that = this
    this.setData({
      acTypeFilterFlag:false
    })
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activity/getAllActivityClientVOs.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&acType='+this.data.acType+'&acTypeFilterFlag='+this.data.acTypeFilterFlag,//仅为示例，并非真实的接口地址
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(data.success){
          // 如果获取成功
          // 格式化时间
          var acs = data.value.list
          if(acs[0] != null){
            for(var i = 0;i<acs.length;i++){
              var ac = acs[i];
              if(ac.endTime == null){
                var endTimeFm = '---'
              }else{
                var endTimeFm = util.tsToDate(ac.endTime)
              }
              if(ac.startTime == null){
                var startTimeFm = '---'
              }else{
                var startTimeFm = util.tsToDate(ac.startTime)
              }
              ac.startTimeFm = startTimeFm
              ac.endTimeFm = endTimeFm
              acs[i] = ac;
            }
            // 重新排序活动（按照最新开始时间）
            console.log(acs);
            that.setData({
              acs:acs,
              isShow:true,
            })
          }else{
            that.setData({
              isShow:true
            })
          }

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

  // 下拉刷新
  onPullDownRefresh: function(){
    // 下拉加载活动列表，每次加载20个
    var that = this
    this.setData({
      pageNum:this.data.pageNum+1
    })
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activity/getAllActivityClientVOs.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&acType='+this.data.acType+'&acTypeFilterFlag='+this.data.acTypeFilterFlag,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(data.success){
          // 如果获取成功
          // 格式化时间
          var acs1 = data.value.list
          if(acs1.length == 0){
            // 没有加载数据
            wx.showToast({
              title: '没有更多了！',
              duration: 10000
            })

            setTimeout(function(){
              wx.hideToast()
            },1000)
          }
          for(var i = 0;i<acs1.length;i++){
            var ac = acs1[i];
            var startTimeFm = util.tsToDate(ac.startTime);
            var endTimeFm = util.tsToDate(ac.endTime);
            ac.startTimeFm = startTimeFm
            ac.endTimeFm = endTimeFm
            acs1[i] = ac;
          }
          // 重新排序活动（按照最新开始时间）
          // var acs = util.sortAcs(acs)
          
          var acs = that.data.acs.concat(acs1)
          that.setData({
            acs:acs,
          })
          console.log(acs)
          wx.stopPullDownRefresh()
        }else{
          util.alertShow(that,'调用失败！')
          wx.stopPullDownRefresh()
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'调用失败！')
        wx.stopPullDownRefresh()
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
  turnToAct: function (e) {
    // 进入问题详情页面
    var that = this
    var acId = e.currentTarget.id;
    console.log(acId)
    wx.navigateTo({
      url:'../action-detail/action-detail?acId='+acId
    })
  },
  switchTab:function (e) {
    // 线下活动页面切换tab
    var acTypeShow = e.currentTarget.dataset.type;
    var that = this
    var acTypeFilterFlag = true
    var acType = []
    acType = util.acTypeClassify(acTypeShow,this)

    that.setData({
      acTypeShow:acTypeShow,
      acType:acType,
      // acTypeFilterFlag:acTypeFilterFlag,
      pageNum:1,
    })
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activity/getAllActivityClientVOs.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&acType='+this.data.acType+'&acTypeFilterFlag='+this.data.acTypeFilterFlag,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(data.success){
          // 如果获取成功
          // 格式化时间
          var acs = data.value.list
          for(var i = 0;i<acs.length;i++){
            var ac = acs[i];
            var startTimeFm = util.tsToDate(ac.startTime);
            var endTimeFm = util.tsToDate(ac.endTime);
            ac.startTimeFm = startTimeFm
            ac.endTimeFm = endTimeFm
            acs[i] = ac;
          }
          // 重新排序活动（按照最新开始时间）
          // var acs = util.sortAcs(acs)
          console.log(acs)
          that.setData({
            acs:acs,
            isShow:true,
          })
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
  
  // 跳转到搜索页面
  turnToSearch:function function_name(argument) {
    wx.redirectTo({
      url:'../search/search?keyIp='+''
    })
  },

  turnToNextPage_redirect: function turnToNextPage_redirect(e){
    // 获取页面跳转路径
    util.turnToNextPage_redirect(e);
  },

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
})
