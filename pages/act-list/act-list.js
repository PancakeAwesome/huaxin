var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    pageNum:1,
    pageSize:20,
    acType:null,
    acTypeCn:null,
    acs:[],
    isShow:false,
    startTimeFm:null,
    endTimeFm:null,
    acTypeFilterFlag:true,
    isNotFound:false,
    isShowTip:false,
    alertText:'',
  },
//   ##线下活动

// | 名称      | 常量值 |备注    |
// | :---:     | :---:  | :---:  |
// | 沙盘疗法体验  | 1      |        |3
// | 园艺心理体验  | 2      |        |3
// | 艺术心理体验  | 3      |        |3
// | 中心回访体验  | 4      |        |
// | 脑图像技术体验 | 5      |        |
// | 催眠体验  | 6      |        |
// | 脑波音乐    | 7      |        |
// | 减压绘画体验      | 8      |        |
// | 放松训练项目      | 9      |        |3
// | 心微课  | 21      |        |
// | 心理学讲座  | 22      |        |
// | 心理学课程  | 23      |        |
// | 团体心理辅导  | 24      |        |
// | 心理志愿服务  | 31      |        |
// | 525心理健康节  | 32      |        |
// | 920新生心理健康节    | 33      |        |
// | 心理辅导站活动      | 34      |        |
// | 心理社团活动   | 35      |        |
// | 沙河心韵  | 41      |        |
// | 一心一语  | 42      |        |
// | 成长吧  | 43     |        |
// | XY老师的心理沙龙    | 44      |        |
// | 成长导师      | 45      |        |
// | 心理测评      | 51      |        |
  onLoad:function (options) {
    // body...
    // 获取活动列表
    var that = this
    var acTypeCn = util.acTypeToCn(options.acType)
    console.log(acTypeCn)
    this.setData({
      acType:options.acType,
      acTypeCn:acTypeCn
    })
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activity/getAllActivityClientVOs.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&acType='+this.data.acType+'&acTypeFilterFlag='+true,//仅为示例，并非真实的接口地址
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
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
            // var acs = util.sortAcs(acs)
            console.log(acs)
            that.setData({
              acs:acs,
              isShow:true,
            })
          }else{
            that.setData({
              isShow:true,
              isNotFound:true,
            })
          }

        }else{
          util.alertShow(that,'加载失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'加载失败！')
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

  
})
