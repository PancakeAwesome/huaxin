//app.js
var util = require('utils/util.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据

    // var scHs = new Array()
    // wx.setStorageSync('scHs',scHs)
  },
  globalData:{
    // 个人测试
    // appid:'wx9169c17e0b802ce7',
    // secret:'027c0f34d06bf0a4412657ed82028b34',
    // official
    appid:'wx7d8bc99896db96ee',
    secret:'4dba55624cb3f65362e192279667eaa2',
    // 用户类型0普通用户1权限用户
    // roleType:null,
    token:null,
    userInfo:null,
    nickName:null,
    userPic:null,
    userInfo:null,
    // fake
    // openid:'6a20596be8fe409294b04b94a8c2e0ec',
    // openid:'wujinwo3601169361235623521322ggg',
    session_key:null,
    token:null,
    userId:null,
    // userId:'6a20596be8fe409294b04b94a8c2e0ec',
    // userId:'wujinwo3601169361235623521322ggg',
    // userId:'wujinwo3601169361235652',
    // userId:'wujinwo360116932',
    // 活动页面联系电话
    acPhNu:['沙河校区 call:83208198','清水河校区 call:61830031'],
    isCf:false,
    // 全局变量用来标识用户是否登录
    isLogin:false,
    // 登录状态
    loginRs:false,
    // 用户认证信息
    collegeType:null,
    studentId:null,
    phoneNumber:null,
    // 轮播图图片尺寸
    imgHeight:550,
    imgWidth:1080,
    // 弹窗高度
    popHeight:200,
    // 代表是否正在由语音播放中
    // isVoicePlaying:false,
    // tempFilePath:null,
  },
  // 微信登陆
  wechatLogin: function(cb) {
      // var page = that;
      var that = this;
      var userId = null;
      var result = null;
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        duration: 10000
      })
      // 获取登录凭证code
      wx.login({
      success: function(res) {
        if (res.code) {
          //code换取openid和session_key
          console.log(res.code)
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+that.globalData.appid+'&secret='+that.globalData.secret+'&js_code='+res.code+'&grant_type=authorization_code',
            success:function (result) {
                // 获取到openid和session_key
                var data = result.data
                console.log(result.globalData)
                if(result.data.openid != null){
                  // that.setData({
                  //   userId:result.data.openid
                  // })
                  that.globalData.userId = result.data.openid
                  that.globalData.session_key = result.data.session_key
                  // wx.setStorageSync('userId',result.data.openid)
                  // wx.setStorageSync('session_key',result.data.session_key)
                  wx.getUserInfo({
                    success: function (res) {
                      // console.log(res.userInfo)

                      that.globalData.nickName = res.userInfo.nickName;
                      that.globalData.userPic = res.userInfo.avatarUrl;
                      that.globalData.userInfo = res.userInfo;

                      console.log(res.userInfo)

                       // typeof cb == "function" && cb(that.globalData.userInfo)
                      wx.request({
                        url: 'https://www.huaxinapp.xyz/api/user/userLogin.do?userId='+that.globalData.userId,
                        method:'POST',
                        success:function (result) {
                          // 成功调用用户登录接口
                          var data = result.data
                          if(data.error == 'user not exist'){
                            // 用户未注册
                            // 调用新增用户接口
                            wx.request({
                              url: 'https://www.huaxinapp.xyz/api/user/createUser.do',
                              method:'POST',
                              header: {
                                'content-type': 'application/json'
                              },
                              data:{
                                userId:that.globalData.userId,
                                nickname:that.globalData.nickName,
                                userPic:that.globalData.userPic
                              },
                              success:function (result) {
                                // 成功调用用户注册接口
                                var data = result.data

                                console.log(data.value)
                                if(data.success){
                                  // 注册成功
                                  // 成功调用用户注册接口
                                  var data = result.data

                                  console.log(data.value)
                                  that.globalData.roleType = data.value.roleType
                                  that.globalData.token = data.value.token
                                  // wx.setStorageSync('roleType',data.value.roleType)
                                  // wx.setStorageSync('token',data.value.token)
                                  wx.showToast({
                                    title: '成功注册登录！',
                                    icon: 'success',
                                    duration: 10000
                                  })
                                  that.globalData.isLogin = true
                                  setTimeout(function(){
                                    wx.hideToast()
                                    cb()
                                  },2000)

                                }else{
                                  //注册失败
                                  console.log(result.error)
                                  that.globalData.isLogin = false

                                  cb()
                                }
                              },
                              fail:function (result) {
                                  console.log(result.error)
                                  that.globalData.isLogin = false

                                  cb()
                              }
                            })
                          }else if(data.success){
                            // 调用成功（用户已注册）

                            console.log(data.value)
                            // 获取token（接口参数）
                            // wx.setStorageSync('roleType',data.value.roleType)
                            // wx.setStorageSync('token',data.value.token)
                            that.globalData.roleType = data.value.roleType
                            that.globalData.token = data.value.token
                            wx.showToast({
                              title: '成功登录！',
                              icon: 'success',
                              duration: 10000
                            })

                            that.globalData.isLogin = true
                            setTimeout(function(){
                              wx.hideToast()
                              cb()
                            },2000)
                            
                          }else if(data.error == 'already userLogin'){
                            // 用户已经登陆
                            wx.showToast({
                              title: '你已经登录！',
                              icon: 'success',
                              duration: 10000
                            })
                            that.globalData.isLogin = true
                            setTimeout(function(){
                              wx.hideToast()
                              cb()
                            },2000)
                            
                          }
                        },
                        fail:function (result) {
                            console.log(result.errcode)

                            wx.showToast({
                              title: '登录失败！',
                              icon: 'success',
                              duration: 10000
                            })
                            that.globalData.isLogin = false
                            setTimeout(function(){
                              wx.hideToast()
                              cb()
                            },2000)
                        }
                      }) 
                    } 

                  })
                }else{
                  // 获取openid失败
                  console.log(result.errcode)
                  wx.showToast({
                    title: '登录失败！',
                    icon: 'success',
                    duration: 10000
                  })
                  that.globalData.isLogin = false
                  setTimeout(function(){
                    wx.hideToast()
                    cb()
                  },2000)

                }  
            },
            fail:function (argument) {
                // body...
                console.log(result.errcode)
                wx.showToast({
                  title: '登录失败！',
                  icon: 'success',
                  duration: 10000
                })
                that.globalData.isLogin = false
                setTimeout(function(){
                  wx.hideToast()
                  cb()
                },2000)

            }
          })
        } else {
            console.log(result.errcode) 

            wx.showToast({
              title: '登录失败！',
              icon: 'success',
              duration: 10000
            })
            that.globalData.isLogin = false
            setTimeout(function(){
              wx.hideToast()
              cb()
            },2000)

        }

      }

    });
    
  },

// 学生认证
valCf:function function_name(acId,cb) {
  var that = this
  wx.request({
    url: 'https://www.huaxinapp.xyz/api/user/getUserAuthInfo.do?userId='+this.globalData.userId+'&acId='+acId,
    method:'GET',
    header: {
        'Authorization': 'Bearer '+this.globalData.token
    },
    success: function(res) {
      // 获取用户认证信息
      var data = res.data
      console.log(data)
      if(data.success){
        if(res.data.value.userName != null){
          // 用户没有认证
          that.globalData.isCf = true
          that.globalData.collegeType = data.value.collegeType
          that.globalData.studentId = data.value.studentId
          that.globalData.userName = data.value.userName
          that.globalData.phoneNumber = data.value.phoneNumber

        }else{
          that.globalData.isCf = false

        }
        cb()
      }else{
        console.log('验证用户认证信息失败！')
        cb()
      }
    },
    fail:function (res) {

      console.log('验证用户认证信息失败！')
      cb()
    }
  })
},
  getPhoneInfo: function (callback) {
    wx.getSystemInfo({
      success: function (res) {
        callback(res.windowHeight,res.windowWidth,res.screenHeight,res.screenWidth);
      }
    })
  },
})