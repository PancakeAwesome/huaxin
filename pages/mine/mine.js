var util = require('../../utils/util.js');
var app = getApp()
Page({ 
  data:{
    isBomb:false,
    integral:null,
    userPic:null,
    userName:null,
    isShowTip:false,
    alertText:'',
    isShow:false
  },

  onLoad:function (options) {
    // body...
    var that = this
    var userId = app.globalData.userId
    console.log(app.globalData.userInfo)
    this.setData({
      userPic:app.globalData.userInfo.avatarUrl,
      userName:app.globalData.userInfo.nickName
    })
    // console.log(this.data.userPic)
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/user/getUserIntegral.do?userId='+userId,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(data.success){
          that.setData({
            integral:data.value,
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
    })
  },
  // 弹窗js
  pop: function() {
    // 弹窗js
    var that = this
    that.setData({
      isBomb: true
    })
  },

  popConfirm: function (){
    // 确认退出
    // 进入登录页面并清除全局用户信息
    app.globalData.userInfo = null
    app.globalData.userId = null
    app.globalData.roleType = null
    app.globalData.token = null
    app.globalData.session_key = null
    app.globalData.isLogin = null

    wx.navigateTo({
      url: '../index/index'
    });
  },

  popCancle: function (){
    var that = this ;
    that.setData({
      isBomb: false
    });
  },

  mask_cancle:function function_name(argument) {
    this.setData({
      isBomb:false,
    })
  },
  
  turnToNextPage_redirect: function turnToNextPage_redirect(e){
    // 获取页面跳转路径
    util.turnToNextPage_redirect(e);
  },

  turnToNextPage: function (e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
})
