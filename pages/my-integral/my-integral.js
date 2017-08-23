var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    isShow:false,
    integral:null,
    pageSize:20,
    pageNum:1,
    its:null,
    isShowTip:false,
    alertText:'',
    // 1代表不可填写问卷，2代表可填写问卷但未获得学分，3代表已填写问卷且已获学分
    hundredPlanStatus:1,
    levelingPlanStatus:1,
    medal1_goal:false,
    medal2_goal:false,
    isBomb:false,
    isPop:false,
    questionnaire:'测试测试测试测试测试测试',
    unconversable1:true,
    conversable1:false,
    submited1:false,
    unconversable2:true,
    conversable2:false,
    submited2:false,
  },

  onLoad:function function_name(options) {
    var that = this;
    var userId = app.globalData.userId;
    this.setData({
      userId:userId,
    })
    // 获取用户积分
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/user/getUserIntegral.do?userId='+userId,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data;
        var integral = data.value;
        if(data.success){
          // 如果获取成功

          that.setData({
            integral:integral,
            isShow:true,
          })
        }else{
          util.alertShow(that,'获取用户积分失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'获取用户积分失败！')
      }
    });

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/user/getMyFinishedActivities.do?userId='+userId+'&pageSize='+this.data.pageSize+'&pageNum='+this.data.pageNum,
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
          var its = data.value.list
          
          for(var i in its){
            // 格式化时间
            its[i].finishedTimeFn = util.tsToDate(its[i].finishedTime).substring(0,10);
            // 转换中文活动类型
            its[i].acTypeCn = util.acTypeCn(its[i].acType);
          }
          that.setData({
            its:its,
            isShow:true,
          })
          console.log(that.data.its)
        }else{
          util.alertShow(that,'获取积分详情列表失败！')
        }
      },
      fail:function (res) {
        util.alertShow(that,'获取积分详情列表失败！')
      }
    });

    // 获取用户可获得学分状态
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/user/getUserCreditStatus.do?userId='+userId,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data;
        var integral = data.value;
        if(data.success){
          // 如果获取成功
          var value = data.value;

          that.setData({
            hundredPlanStatus:value.hundredPlanStatus,
            levelingPlanStatus:value.levelingPlanStatus,
          })
        }else{
          util.alertShow(that,'获取用户积分可兑换失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'获取用户积分可兑换失败！')
      }
    })
  }, 

  hint_pop:function hint_pop () {
    this.setData({
      isBomb:true,
      isPop1:true
    });
  } ,

  hint_cancle:function hint_cancle () {
    this.setData({
      isBomb:false,
      isPop1:false
    });
  },

  // 兑换学分徽章
  converse_medal:function converse_medal (e) {
    var type = e.currentTarget.dataset.type;
    var hundredPlanStatus = this.data.hundredPlanStatus;
    var levelingPlanStatus = this.data.hundredPlanStatus;
    // 1代表不可填写问卷，2代表可填写问卷但未获得学分，3代表已填写问卷且已获学分
    util.alertShow(this,hundredPlanStatus + ',' + levelingPlanStatus);

    if(type.indexOf('hp') >= 0){
      // hp_plan
      this.setData({
        isBomb:true,
        isPop2:true
      });

      // 百分计划要求
      if(hundredPlanStatus == 2){
        // 可填写问卷
        this.setData({
          unConversable1:false,
          conversable1:true,
          submited1:false
        });
      }else if(hundredPlanStatus == 3){
        // 已提交
        this.setData({
          unConversable1:false,
          conversable1:false,
          submited1:true
        });
      }else{
        // 不可兑换
        this.setData({
          unConversable1:true,
          conversable1:false,
          submited1:false
        });
      }
    }else{
      // lp_plan
      this.setData({
        isBomb:true,
        isPop3:true
      });

      // 练级计划要求
      if(levelingPlanStatus == 2){
        // 可填写问卷
        this.setData({
          unConversable2:false,
          conversable2:true,
          submited2:false
        });
      }else if(levelingPlanStatus == 3){
        // 已提交
        this.setData({
          unConversable2:false,
          conversable2:false,
          submited2:true
        });
      }else{
        // 不可兑换
        this.setData({
          unConversable2:true,
          conversable2:false,
          submited2:false
        });
      }
    }
    
  },

  pop2_cancle:function hint_cancle () {
    this.setData({
      isBomb:false,
      isPop2:false
    });
  },

  pop3_cancle:function hint_cancle () {
    this.setData({
      isBomb:false,
      isPop3:false
    });
  },

  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  }
})
