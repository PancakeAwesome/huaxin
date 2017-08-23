var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    isShow:false,
    userId:null,
    openid:'',
    session_key:'',
    isBomb:false,
    acId:null,
    // fake
    hwType:2,
    ac:null,
    acType:null,
    acTypeCn:null,
    isBomb2:false,
    // 活动是否过期
    isOutDate:null,
    // 上传图片的地址
    hwTmage:null,
    // 标准化时间
    endTimeFm:null,
    startTimeFm:null,
    isBomb3:false,
    isBomb4:false,
    isBomb5:false,
    isBomb6:false,
    isPop3:false,
    // 是否还剩一天活动开始
    isBeforeOneD:true,
    // 用户是否认证
    isCf:false,
    // 是否需要预约
    needAppointment:false,
    acPhNu:app.globalData.acPhNu,
    // 活动类容（已分割）
    contentList:null,
    applyFc:false,
    // applyDisable:false,
    disabled:false,
    // 作业提交类型
    homeworkType:null,
    isLogin:false,
    isShowTip:false,
    alertText:'',
  },
  onLoad:function (options) {
      var that = this

      var userId = app.globalData.userId
      var acPhNu = app.globalData.acPhNu
      console.log(userId)
      this.setData({
        acId:options.acId,
        userId:userId,
        acPhNu:acPhNu,
        isLogin:app.globalData.isLogin
      })
      
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/activity/getActivityDetailClientVO.do?acId='+that.data.acId+'&userId='+that.data.userId,
        method:'GET',
        header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
        success: function(res) {
          // 成功获取活动列表
          var data = res.data
          console.log(data)
          if(data.value != null){
            // 如果获取成功
            // 格式化时间
            if(data.value.endTime == null){
              var endTimeFm = '---'
              var isOutDate = false
            }else{
              var endTimeFm = util.tsToDate(data.value.endTime)
              var isOutDate = util.isOutDate(data.value.endTime)
            }
            if(data.value.startTime == null){
              var startTimeFm = '---'
            }else{
              var startTimeFm = util.tsToDate(data.value.startTime)
            }

            // 活动类型分类
            var acTypeCn = util.acTypeToCn(data.value.type)
            // 内容回车分割
            var contentList = util.enterToList(data.value.acContent)
            console.log(contentList)
            that.setData({
              ac:data.value,
              isShow:true,
              acType:data.value.acType,
              startTimeFm:startTimeFm,
              endTimeFm:endTimeFm,
              acTypeCn:acTypeCn,
              needAppointment:data.value.needAppointment,
              contentList:contentList,
              isOutDate:isOutDate,
              homeworkType:data.value.homeworkType
            })
            // 时间过期检查
            // var endDate = data.value.endTime
            // var isOutDate = util.isOutDate(endDate)
            // 用户认证检查

            // var isCf = app.globalData.isCf
            // console.log(isCf)
            that.setData({
              // isOutDate:isOutDate,
              // isCf:isCf
            })
            console.log(isOutDate)
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
  turnToNextPage_redirect: function turnToNextPage_redirect(e){
    // 获取页面跳转路径
    util.turnToNextPage_redirect(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },
  // 弹窗js
  submitHw: function() {
    // 弹窗js
    var that = this
    that.setData({
      isBomb: true,
      isBomb3:true,
    })
  },

  popCancle:function function_name(argument) {
    // 取消弹窗
    this.setData({
      isBomb:false
    })
  },

  popCancle2:function function_name(argument) {
    // 取消弹窗
    this.setData({
      isBomb2:false
    })
  },

  subHomeFromImg:function (argument) {
    // 上传图片
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: 'https://www.huaxinapp.xyz/api/upload/upload.do?dir=homework',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            'user': 'test'
          },
          header: {
            'Authorization': 'Bearer '+app.globalData.token,
            'content-type': 'multipart/form-data'   
          },
          success: function(res){
            // 成功获取活动列表
            var data = JSON.parse(res.data)
            console.log(data)
            if(data.isSuccess){
              console.log(data.param.fid)
              // 图片作业上传
              wx.request({
                url: 'https://www.huaxinapp.xyz/api/activityRecord/addHomeworkWithImages.do?userId='+that.data.userId+'&acId='+that.data.acId+'&homeworkType='+3+'&images='+data.param.fid,
                method:'POST',
                header: {
                    'Authorization': 'Bearer '+app.globalData.token
                },
                success: function(res) {
                  // 成功获取活动列表
                  var data = res.data
                  console.log(data)
                  if(data.success){
                    // util.alertShow(that,'成功上传图片！')
                    that.setData({
                      disabled:true,
                    })

                    wx.showToast({
                      title: '成功上传图片！',
                      icon: 'success',
                      duration: 10000
                    })

                    setTimeout(function(){
                      wx.hideToast()
                      wx.redirectTo({
                        url:'../action-detail/action-detail?acId='+that.data.acId
                      })
                    },1000)

                  }else{
                    util.alertShow(that,data.error)
                  }
                },
                fail:function (res) {

                  util.alertShow(that,res.data.error)
                }
              })
            }else{
              util.alertShow(that,'上传图片失败！')
            }
          }
        })
      },
      fail:function (argument) {
        // 调用失败
        util.alertShow(that,'调用失败！')
      }
    })
  },

  subHomeFromText:function (argument) {
    // 提交文字作业
    if(this.data.homeworkType == 3){
      // 选择提交方式
      this.setData({
        isBomb2:true
      })
    }else if(this.data.homeworkType == 2){
      // 心探索
      this.subFromDis()
    }else{
      // 心学习
      this.subFromStudy()
    }
    
  },

  subFromDis:function (argument) {
    // 心探索提交
    var acId = this.data.acId
    // 心探索页面
    var hwType = 2
    wx.navigateTo({
      url:'../submit-homework/submit-homework?acId='+acId+'&hwType='+hwType,
    })
  },

  subFromStudy:function (argument) {
    // 心学习提交
    var acId = this.data.acId
    // 心学习页面
    var hwType = 1
    wx.navigateTo({
      url:'../submit-homework/submit-homework?acId='+acId+'&hwType='+hwType,
    })
  },

  // 调用扫描二维码
  toSign: function (){
    var that = this
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
              // wx.showToast({
              //   title: '成功扫码！',
              //   icon: 'success',
              //   duration: 10000
              // })
              that.setData({
                isBomb:true,
                isBomb6:true
              })
              setTimeout(function(){
                wx.redirectTo({
                  url:'../action-detail/action-detail?acId='+that.data.acId
                })
              },1000)
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
      fail: () => {
        // 调用失败
        console.log('扫描二维码失败！')
      },
    })
  },

  apply:function function_name() {
    // 活动报名
    var that = this
    var isLogin = app.globalData.isLogin
    this.setData({
      applyDisable:true,
    })
    if(isLogin){
      this.valCf(function() {
        // callback
        var isCf = that.data.isCf
        if(isCf){
          wx.request({
            url: 'https://www.huaxinapp.xyz/api/activityRecord/activitySignUp.do?acId='+that.data.acId+'&userId='+app.globalData.userId,
            method:'POST',
            header: {
                'Authorization': 'Bearer '+app.globalData.token
            },
            success: function(res) {
              // 成功获取活动列表
              var data = res.data
              console.log(data)
              if(data.success){
                that.setData({
                  isPop3:true,
                  isBomb:true,
                  applyFc:true,
                })
                util.alertShow(that,'报名成功！')
                setTimeout(function(){
                  wx.redirectTo({
                    url:'../action-detail/action-detail?acId='+that.data.acId
                  })
                },3000)
                
              }else{
                util.alertShow(that,data.error)
              }
            },
            fail:function (res) {

              util.alertShow(that,res.data.error)
            }
          })
        }else{
          // 没有身份认证
          that.setData({
            isBomb:true,
            isBomb4:true
          })
        }
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
          wx.redirectTo({
            url:'../action-detail/action-detail?acId='+that.data.acId
          })
        }else{
          util.alertShow(that,'login faile')
        }
      })
    }
  },

  // 跳转认证页面
  turnToCf:function function_name(argument) {
    wx.redirectTo({
      url:'../certification/certification?acId='+this.data.acId
    })
  },

  callPhEv:function function_name(e) {
    // 拨打电话
    var phoneNumber = (e.currentTarget.dataset.type).match(/[1-9]/g).join('');
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  // 拨打电话弹窗
  popDialog:function function_name(argument) {
    this.setData({
      isBomb5:true,
      isBomb:true
    })
  },

  // mask_cancle:function function_name(argument) {
  //   this.setData({
  //     isBomb:false,
  //   })
  // },

  // 学生认证
  valCf:function function_name(cb) {
    var that = this
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/user/getUserAuthInfo.do?userId='+app.globalData.userId+'&acId='+this.data.acId,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 获取用户认证信息
        var data = res.data
        console.log(data)
        if(data.success){
          if(res.data.value.userName != null){
            // 用户没有认证
            that.data.isCf = true
            // return true
          }else{
            that.data.isCf = false
            // return false
          }
          cb()
        }else{
          console.log('调用失败！')
          cb()
        }
      },
      fail:function (res) {

        console.log('调用失败！')
        cb()
      }
    })
  },
})