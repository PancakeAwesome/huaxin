var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    isBomb:false,
    userId:null,
    phoneNumber:null,
    // 设备标示符
    deviceTag:'wemini',
    content:null,
    focus:false,
    disabled:false,
    isShowTip:false,
    alertText:'',
  },
  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },
  // 弹窗js
  pop: function() {
    // 弹窗js
    // var that = this
    // that.setData({
    //   isBomb: true,
    // })
    var that = this
    // 手机号输入检查
    if( !util.phVal(this.data.phoneNumber)){
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()
      },1000)
      return
    }
    // 意见内容检查
    if(this.data.content == null || this.data.content == ''){
      wx.showToast({
        title: '意见内容不能为空！',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()
      },1000)
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定提交吗？',
      success: function(res) {
        if (res.confirm) {
          that.popConfirm()
          // console.log('用户点击确定')
        } else if (res.cancel) {
          
          // console.log('用户点击取消')
        }
      }
    })
  },
  onLoad:function function_name(options) {
    // 获取手机型号
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.model)
        that.setData({
          deviceTag:res.model
        })
      }
    })
  },
  popConfirm: function (){
    // 提交意见
    var userId = app.globalData.userId
    this.setData({
      userId:userId
    })
    var that = this

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/opinion/createOpinion.do',
      method:'POST',
      header: {
          'Authorization': 'Bearer '+app.globalData.token,
          'content-type': 'application/json'
      },
      data:{
        userId:this.data.userId,
        contactInfomation:this.data.phoneNumber,
        content:this.data.content,
        deviceTag:this.data.deviceTag,
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(data.success){
          // 如果获取成功
          wx.showToast({
            title: '成功提交意见！感谢你随我们一起进步！',
            icon: 'success',
            duration: 10000
          })
          that.setData({
            disabled:true,
          })
          setTimeout(function(){
            wx.hideToast()
            wx.navigateTo({
              url:'../mine/mine'
            })
          },3000)
        }else{
          util.alertShow(that,'提交失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'提交失败！')
      }
    })

  },

  popCancle: function (){
    var that = this ;
    that.setData({
      isBomb: false,
    });
  },

  contentEvent:function(e){
    // 问题内容输入的操作
    var that = this
    that.setData({
      content : e.detail.value
    })
    console.log(that.data.content)
  },

  phoneNumberIp:function(e){
    // 手机号码输入的操作
    var that = this
    that.setData({
      phoneNumber : e.detail.value
    })
  },
})
