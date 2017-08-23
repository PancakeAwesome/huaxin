var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    isBomb:false,
    userId:null,
    collegeType:1,
    studentId:'',
    userName:'',
    phoneNumber:'',
    focus:false,
    acId:null,
    nameIsFalse:false,
    pnIsFalse:false,
    idIsFalse:false,
    array: ["通信与信息工程学院","电子工程学院","微电子与固体电子学院","物理电子学院","光电信息学院","计算机科学与工程学院","信息与软件工程学院","自动化工程学院","机械电子工程学院","生命科学与技术学院","数学科学学院","英才实验学院","经济与管理学院","政治与公共管理学院","外国语学院","马克思主义教育学院","资源与环境学院","航空航天学院","格拉斯哥学院","通信抗干扰重点实验室","医学院","创新创业学院","基础与前沿研究院"],
   //  objectArray: [
   //   {
   //     id: 0,
   //     name: '美国'
   //   },
   //   {
   //     id: 1,
   //     name: '中国'
   //   },
   //   {
   //     id: 2,
   //     name: '巴西'
   //   },
   //   {
   //     id: 3,
   //     name: '日本'
   //   }
   // ],
   // 数组的下标
   index: 0,
   acId:null,
   isShowTip:false,
    alertText:'',
  },

  onLoad:function function_name(options) {
    // acId存值
    var that = this
    this.setData({
      acId:options.acId
    })
    app.valCf(this.data.acId,function(){
      // 验证认证
      var isCf = app.globalData.isCf
      if(isCf){
        // 已经认证
        that.setData({
          index:app.globalData.collegeType-1,
          studentId:app.globalData.studentId,
          userName:app.globalData.userName,
          phoneNumber:app.globalData.phoneNumber,
        })
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

  cfEvent:function (argument) {
    // 提交认证
    var that = this
    var userId = app.globalData.userId
    this.setData({
      userId:userId
    })

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/user/userAuthenticate.do',
      method:'POST',
      data:{
        userId:this.data.userId,
        collegeType:this.data.collegeType,
        studentId:this.data.studentId,
        userName:this.data.userName,
        phoneNumber:this.data.phoneNumber,
      },
      header: {
          'Authorization': 'Bearer '+app.globalData.token,
          'content-type': 'application/json'
      },
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(data)
        if(res.data.success){
          // 如果认证成功
          wx.showToast({
            title: '成功提交！',
            icon: 'success',
            duration: 10000
          })
          // 存储用户认证信息在本地
          app.globalData.collegeType = that.data.collegeType
          app.globalData.studentId = that.data.studentId
          app.globalData.userName = that.data.userName
          app.globalData.phoneNumber = that.data.phoneNumber
          app.globalData.isCf = true

          setTimeout(function(){
            wx.hideToast()
            if(that.data.acId != null){
              wx.redirectTo({
                url:'../action-detail/action-detail?acId='+that.data.acId
              })
            }else{
              wx.redirectTo({
                url:'../mine/mine'
              })
            }
          },3000)

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

  studentIdIp:function(e){
    // 学号输入的操作
    var that = this
    that.setData({
      studentId : e.detail.value
    })

  },

  userNameIp:function(e){
    // 姓名输入的操作
    var that = this
    that.setData({
      userName : e.detail.value
    })

  },

  phoneNumberIp:function(e){
    // 手机号码输入的操作
    var that = this
    that.setData({
      phoneNumber : e.detail.value
    })

  },
// 学院选择器
// 通信与信息工程学院  1  
// 电子工程学院  2  
// 微电子与固体电子学院  3  
// 物理电子学院  4  
// 光电信息学院  5  
// 计算机科学与工程学院  6  
// 信息与软件工程学院 7  
// 自动化工程学院 8  
// 机械电子工程学院  9  
// 生命科学与技术学院 10   
// 数学科学学院  11   
// 英才实验学院  12   
// 经济与管理学院 13   
// 政治与公共管理学院 14   
// 外国语学院 15   
// 马克思主义教育学院 16   
// 资源与环境学院 17   
// 航空航天学院  18   
// 格拉斯哥学院  19   
// 通信抗干扰重点实验室  20   
// 医学院 21   
// 创新创业学院  22   
// 基础与前沿研究院  23
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      collegeType: parseInt(e.detail.value)+1,
      index:e.detail.value
    })
    console.log(this.data.collegeType)
  },
// 弹窗js
  pop: function() {
    // 弹窗js
    // 填写内容检查
    // if(this.data.collegeType == null || this.data.studentId == null || this.data.userName == null || this.data.phoneNumber == null ){
    //   wx.showToast({
    //     title: '请填写完全后提交',
    //     icon: 'loading',
    //     duration: 10000
    //   })

    //   setTimeout(function(){
    //     wx.hideToast()
    //     this.setData({
    //       isBomb:false
    //     })
    //   },1000)
    //   return
    // }
    if(this.data.studentId == ''){
      wx.showToast({
        title: '请填写学号',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()
        
      },500)
      return
    }

    if(this.data.userName == ''){
      wx.showToast({
        title: '请填写姓名',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()
        
      },500)
      return
    }

    if(this.data.phoneNumber == ''){
      wx.showToast({
        title: '请填写电话',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()
        
      },500)
      return
    }

    // 中文姓名输入检查
    if( util.nmCnVal(this.data.userName) != 0){
      wx.showToast({
        title: '请输入正确的中文姓名！',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()

      },500)
      return
    }

    // 手机号码输入检查
    if( !util.phVal(this.data.phoneNumber)){
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()

      },500)
      return
    }

    this.setData({
      isBomb: true
    })
  },

  popCancle:function function_name(argument) {
    // 取消弹窗
    this.setData({
      isBomb:false
    })
  },

  mask_cancle:function function_name(argument) {
    this.setData({
      isBomb:false,
    })
  },
})
