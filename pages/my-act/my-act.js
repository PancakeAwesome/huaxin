var util = require('../../utils/util.js');
var app =getApp();
Page({
  data:{
    isShow:true,
    isShow2:true,
    pageSize:20,
    pageNum:1,
    userId:null,
    // 首先显示已报名
    isCheckin:0,
    homeworkStatus:0,
    acs:null,
    acTypeShow:0,
    myUnfinishedActivityFlag:false,
    isDfShow:null,
    isShowTip:false,
    alertText:'',
  },

  onLoad:function function_name(options) {
    var that = this
    var userId = app.globalData.userId
    this.setData({
      userId:userId,
    })
    // 获取我报名的活动
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activity/getMyActivities.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum+'&isCheckin='+this.data.isCheckin+'&homeworkStatus='+this.data.homeworkStatus,
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
          var value = data.value
          var isDfShow = false

          if(value == null){
            isDfShow = true
            acs = null
          }else{
            var acs = value.list
            for(var i = 0 ;i < acs.length;i++){
              // 转换时间戳
              var ac = acs[i]
              ac.startTimeFm = util.tsToDate(ac.startTime)
              var acType = ac.acType
              var acTypeCn = null
                // 活动类型转换  
              ac.acTypeCn = util.acTypeToCn(acType)
            }
            console.log(acs)
            for(var i = 0 ;i < acs.length;i++){
              var ac = acs[i]
              ac.startTimeFm = util.tsToDate(ac.startTime)
              acs[i] = ac
            }
          }

          // wx.showToast({
          //   title: '加载中！',
          //   icon: 'loading',
          //   duration: 10000
          // })

          that.setData({
            acs:acs,
            isShow:true,
            isDfShow:isDfShow,
          })
          
          // wx.hideToast()

          console.log(acs)
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
    var acTypeShow = e.currentTarget.dataset.type;
    var that = this
    // var acTypeFilterFlag = true
    var isCheckin = null
    var homeworkStatus = null
    var myUnfinishedActivityFlag = false
    this.setData({
      isShow2:false,
      pageNum:1
    })
    switch(acTypeShow)
    {
    // 已报名
    case "0":
      isCheckin = 0
      homeworkStatus = 0
      break;
    case "1":
    // 已签到
      isCheckin = 1
      myUnfinishedActivityFlag = true
      break;
    case "2":
    // 已完成
      isCheckin = 1
      homeworkStatus = 3
      break; 
    }

    that.setData({
      acTypeShow:acTypeShow
    })

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activity/getMyActivities.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum+'&isCheckin='+isCheckin+'&homeworkStatus='+homeworkStatus+'&myUnfinishedActivityFlag='+myUnfinishedActivityFlag,
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
          var value =data.value
          var isDfShow = false
          if(value == null){
            isDfShow = true
          }else{
            var acs = value.list
            
            if(acs == null || typeof(acs) == 'undefined' || acs.length == 0){
              isDfShow = true
            }else{
              for(var i = 0 ;i < acs.length;i++){
                // 转换时间戳
                var ac = acs[i]
                ac.startTimeFm = util.tsToDate(ac.startTime)
                var acType = ac.acType
                var acTypeCn = null
                  // 活动类型转换  
                switch(acType)
                {
                case 1:
                  acTypeCn = '沙盘疗法体验'
                  break;
                case 2:
                  acTypeCn = '园艺心理体验'
                  break;
                case 3:
                  acTypeCn = '艺术心理体验'
                  break;
                case 4:
                  acTypeCn = '中心回访体验'
                  break;
                case 5:
                  acTypeCn = '脑图像技术体验'
                  break;
                case 6:
                  acTypeCn = '催眠体验'
                  break;
                case 7:
                  acTypeCn = '脑波音乐'
                  break;
                case 8:
                  acTypeCn = '减压绘画体验'
                  break;
                case 9:
                  acTypeCn = '放松训练项目'
                  break;
                case 21:
                  acTypeCn = '心微课'
                  break;
                case 22:
                  acTypeCn = '心理学讲座'
                  break;              
                case 23:
                  acTypeCn = '心理学课程'
                  break;    
                case 24:
                  acTypeCn = '团体心理辅导'
                  break;
                case 31:
                  acTypeCn = '心理志愿服务'
                  break;
                case 32:
                  acTypeCn = '525心理健康节'
                  break;
                case 33:
                  acTypeCn = '920新生心理健康节'
                  break;
                case 34:
                  acTypeCn = '心理辅导站活动'
                  break;
                case 35:
                  acTypeCn = '心理社团活动'
                  break;
                case 41:
                  acTypeCn = '沙河心韵'
                  break;
                case 42:
                  acTypeCn = '一心一语'
                  break;
                case 43:
                  acTypeCn = '成长吧'
                  break;
                case 44:
                  acTypeCn = 'XY老师的心理沙龙'
                  break;
                case 45:
                  acTypeCn = '成长导师'
                  break;
                case 51:
                  acTypeCn = '心理测评'
                  break;                           
                }
                ac.acTypeCn = acTypeCn
                acs[i] = ac
              }
            }
          }
          
          console.log(acs)
          // wx.showToast({
          //   title: '加载中！',
          //   icon: 'loading',
          //   duration: 1000
          // })
          that.setData({
            acs:acs,
            isShow2:true,
            isDfShow:isDfShow,
          })
          // wx.hideToast()
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

  onPullDownRefresh:function () {
    // 下拉加载活动列表，每次加载20个
    var acTypeShow = this.data.acTypeShow;
    var pageNum = this.data.pageNum+1
    var that = this
    // var acTypeFilterFlag = true
    var isCheckin = null
    var homeworkStatus = null
    var myUnfinishedActivityFlag = false

    switch(acTypeShow)
    {
    // 已报名
    case "0":
      isCheckin = 0
      homeworkStatus = 0
      break;
    case "1":
    // 已签到
      isCheckin = 1
      myUnfinishedActivityFlag = true
      break;
    case "2":
    // 已完成
      isCheckin = 1
      homeworkStatus = 3
      break; 
    }

    this.setData({
      pageNum:pageNum
    })

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activity/getMyActivities.do?userId='+this.data.userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum+'&isCheckin='+isCheckin+'&homeworkStatus='+homeworkStatus+'&myUnfinishedActivityFlag='+myUnfinishedActivityFlag,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(res.data.success){
          // 获取活动数组
          var acs = res.data.value.list
          if(acs.length == 0){
            // 没有加载数据
            wx.showToast({
              title: '没有更多了！',
              duration: 3000
            })

            setTimeout(function(){
              wx.hideToast()
            },1000)
          }
          for(var i = 0 ;i < acs.length;i++){
            // 转换时间戳
            var ac = acs[i]
            ac.startTimeFm = util.tsToDate(ac.startTime)
            var acType = ac.acType
            var acTypeCn = null
              // 活动类型转换  
            switch(acType)
            {
            case 1:
              acTypeCn = '沙盘疗法体验'
              break;
            case 2:
              acTypeCn = '园艺心理体验'
              break;
            case 3:
              acTypeCn = '艺术心理体验'
              break;
            case 4:
              acTypeCn = '中心回访体验'
              break;
            case 5:
              acTypeCn = '脑图像技术体验'
              break;
            case 6:
              acTypeCn = '催眠体验'
              break;
            case 7:
              acTypeCn = '脑波音乐'
              break;
            case 8:
              acTypeCn = '减压绘画体验'
              break;
            case 9:
              acTypeCn = '放松训练项目'
              break;
            case 21:
              acTypeCn = '心微课'
              break;
            case 22:
              acTypeCn = '心理学讲座'
              break;              
            case 23:
              acTypeCn = '心理学课程'
              break;    
            case 24:
              acTypeCn = '团体心理辅导'
              break;
            case 31:
              acTypeCn = '心理志愿服务'
              break;
            case 32:
              acTypeCn = '525心理健康节'
              break;
            case 33:
              acTypeCn = '920新生心理健康节'
              break;
            case 34:
              acTypeCn = '心理辅导站活动'
              break;
            case 35:
              acTypeCn = '心理社团活动'
              break;
            case 41:
              acTypeCn = '沙河心韵'
              break;
            case 42:
              acTypeCn = '一心一语'
              break;
            case 43:
              acTypeCn = '成长吧'
              break;
            case 44:
              acTypeCn = 'XY老师的心理沙龙'
              break;
            case 45:
              acTypeCn = '成长导师'
              break;
            case 51:
              acTypeCn = '心理测评'
              break;                           
            }
            ac.acTypeCn = acTypeCn
            acs[i] = ac
          }
          var acs = that.data.acs.concat(acs)
          // wx.showToast({
          //   title: '加载中！',
          //   icon: 'loading',
          //   duration: 10000
          // })
          that.setData({
            acs:acs,
            isShow2:true,
          })
          
          // wx.hideToast()
          console.log(acs)
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
  },

  // 跳到活动详情页面
  turnToAc:function function_name(e) {
    var uuid = e.currentTarget.dataset.type
    wx.navigateTo({
      url:'../action-detail/action-detail?acId='+uuid
    })
  },
})
