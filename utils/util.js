// var app = getApp();
function formatTime(fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function turnToNextPage(e) {
  // 页面跳转方法（非重定向）
  var path = e.currentTarget.dataset.type;
  wx.navigateTo({
    url: '../'+path+'/'+path
  });
   
}

function turnToNextPage_redirect(e) {
  // 页面跳转（重定向）
  var path = e.currentTarget.dataset.type;
  wx.redirectTo({
    url: '../'+path+'/'+path
  });
}
// 页面返回方法
function backToPage(){
  // 暂停录音功能
  wx.stopRecord();
  wx.navigateBack({
    delta: 1
  });
}

// 验证弹出层显示
function alertShow(that, text) {
  that.setData({
    isShowTip: true,
    alertText: text
  });
  alertHidden(that);
}

function alertHidden(that) {
  setTimeout(function () {
      that.setData({
        isShowTip: false,
        alertText: ''
      });
  }, 1500)
}

function stringToArray(dataStr) {
  // 字符串数组转换成整型数组
  
  var dataStrArr=dataStr.split(",");//分割成字符串数组  
  var dataIntArr=[];//保存转换后的整型字符串  

  //方法一  
  dataStrArr.forEach(function(data,index,arr){  
      dataIntArr.push(+data);  
  }); 

  return dataIntArr; 
}

function isOutDate(endDate) {
  // 时间过期检查 
  // var myDate = new Date()
  // var d2 = myDate.toLocaleString( );
  // console.log(d2)
  var d2 = getNowTime();
  console.log(d2)
  var d1=tsToDate(endDate); 
  // var d2 = new Date(d2.replace(/\-/g, "\/"));  
  console.log(d1) 
  console.log(d2) 
  var result = comptime(d2,d1)
  // if(d2!=""&&d1!=""&&d1 < d2)  
  // {  
  //   console.log("结束时间已经大于现在的时间！");  
  //   return true;  
  // }else{
  //   return false;
  // }
  return result;
}

function tsToDate(tm) {
  // 时间戳转化标准时间
  // 简单的一句代码
  var date = new Date(tm); //将时间戳传给Date对象

  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
  // var s = date.getSeconds(); 
  var result = Y+M+D+h+m;
  return result;
}

function formatDate(now) { 
  var year=now.getYear(); 
  var month=now.getMonth()+1; 
  var date=now.getDate(); 
  var hour=now.getHours(); 
  var minute=now.getMinutes(); 
  var second=now.getSeconds(); 
  return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
} 

function getNowTime() {
  // 获取当前时间
  var date = new Date(); //获取一个时间对象

  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
  // var s = date.getSeconds(); 
  var result = Y+M+D+h+m;
  return result;
}

// js时间比较(yyyy-mm-dd hh:mi:ss)

function comptime(d1,d2) {
    var beginTime = d1;
    var endTime = d2;
    var beginTimes = beginTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');

    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 16);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 16);

    var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
    if (a < 0) {
        // alert("d2小!");
        return true;
    } else if (a >= 0) {
        // alert("d2大!");
        return false;
    } 
}

function difTimeInOD(d2) {
    var beginTime = tsToDate(d2);
    // console.log(beginTime)
    // var endTime = d2;
    var endTime = getNowTime();;
    var beginTimes = beginTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');

    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 16);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 16);
    // 差值dif是以小时为单位
 
    var dif = (Date.parse(endTime) - Date.parse(beginTime))/3600/1000;
    var result = null
    if(dif<=1){
      // 一个小时以内
      result = dif*60;
      result = parseInt(result)  
      return  result+'分钟'  
    }else if(dif>1 && dif<=24){
      // 一天之内
      result = dif;
      result = parseInt(result)
      return result + '小时'
    }else if(dif>24 && dif <= 744){
      // 一个月之内（一个月31天）
      result = dif/24;
      result = parseInt(result)
      return result + '天'
    }else if(dif > 744 && dif <= 8760){
      // 大于一个月（31天）
      result = dif/744;
      result = parseInt(result)
      return result + '月'
    }else{
      // 大于一年（365天）
      result = dif/8760;
      result = parseInt(result)
      return result + '年'
    }
    
}
// 插入排序：重排活动；实现最新活动排序
// 插入排序 从下标1开始每增1项排序一次，越往后遍历次数越多
function sortAcs(array) {
  var len = array.length,
        i, j, tmp, result;
  
  // 设置数组副本
  result = array.slice(0);
  for(i=1; i < len; i++){
    // 获取活动开始时间
    tmp = result[i];
    // console.log(tmp)
    j = i - 1;
    while(j>=0 && !comptime(result[j].startTimeFm,tmp.startTimeFm) ){
      // 按活动时间逆序排列
      result[j+1] = result[j];
      j--;
    }
    result[j+1] = tmp;
  }
  // console.log(result)
  return result;
}
function checkChinese(str) { var re = /[^\u4e00-\u9fa5]/; if (re.test(str)) return false; return true; }; 
function nmCnVal(v) {
  // 0代表输入正确
if (v == '') return 1; if (v.length < 2) { return 2; }
var name = v.replace(/·/g, ''); name = name.replace(/•/g, ''); 
if(checkChinese(name))  return 0; else return 2;
        };

function phVal(sMobile){ 

  if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))){ 
    return false; 
  }else{
    return true;
  } 
}

function timeCount(that) {
  // 计时器
  var v = that.data.recordDuration
  if(v >180*1000){
    // 大于三分钟
    return 
  }else{

    v = v + 1
    that.setData({
      recordDuration:v
    })
  }
  
}
function voiceDuration(time) {
  // 语音播放时间格式化
  if(time < 60){
    // within 1 min
    return time+"''"
  }else{
    // longer than 1 min
    var min = time/60
    var seconds = time%60
    min = (time-seconds)/60
    return min+"'"+seconds+"''"
  }
  
}

function enterToList(str) {
  // 将带有回车符的字符串分割成字符串数组
  var strList = str.split('\n')
  return strList
}

function acTypeToCn(acType) {

  // 活动类型转换
  var acType = parseInt(acType)
  var acTypeCn = null
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
  case 52:
    acTypeCn = '其他'
    break;                            
  }
  console.log(acTypeCn)
  return acTypeCn;

}

function acTypeClassify(acTypeShow,that){
  var acType = []
  var acTypeFilterFlag = true
  switch(acTypeShow)
  {
  case "0":
    acTypeFilterFlag = false
    break;
  case "1":
  // 沙龙类
  acType = [41,42,43,44,45]
    break;
  case "2":
  // 活动类
  acType = [31,32,33,34,35]
    break;
  case "3":
  // 体验类
  acType = [1,2,3,4,5,6,7,8,9]
    break; 
  case "4":
  // 课程类
  acType = [21,22,23,24]
    break; 
  }
  that.setData({
    acTypeFilterFlag:acTypeFilterFlag
  })
  return acType;
}

function arrayProcess(member,array){
  // 数组处理
  // 数组重复处理
  for(var ar in array){
    if(array[ar] == member){
      return array
    }
  }

  // 加入新成员变量
  array[array.length] = member
  return array
}

// 点赞事件
function liking(e,that,app) {
  // 判断登陆
  // var that = this
  // this.setData({
  //   e:e
  // })
  var util = this
  var isLogin = app.globalData.isLogin
  if(isLogin){
    var quId = e.currentTarget.dataset.type;
    // 每个问答的点赞状态
    var index = e.currentTarget.dataset.status;
    if(typeof(index) == 'undefined'){
      index = 0
    }
    console.log(index)
    var userId = app.globalData.userId
    // var that = this;
    var qus = that.data.qus
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/voteOne.do?quId='+quId+'&userId=' + userId,
      method:'POST',
      header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
      success: function(res) {
        // 提交问题成功
        var data = res.data
        if(data.success){
          // 如果获取成功
          qus[index].voted=true
          qus[index].quVoteNum=qus[index].quVoteNum+1

          that.setData({
            qus:qus
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 10000
          })

          setTimeout(function(){
            wx.hideToast()
          },1000)
          
        }else{
          util.alertShow(that,data.error)
          console.log(data.error)
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,res.data.error)
      }
    })
  }else{
    // 没有登陆
    // 调用登陆接口
    app.wechatLogin(function(){
      //  login
      if(app.globalData.isLogin){
        // login success
        wx.redirectTo({
          url:'../index/index'
        })
        // that.liking(that.data.e)
      }else{
        util.alertShow(that,'login faile')
      }
    })
  }
  
}
// 取消点赞事件
function unLiking(e,that,app) {
  var isLogin = app.globalData.isLogin
  var util = this
  // var that = this
  // this.setData({
  //   e:e
  // })
  if(isLogin){
    var quId = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.status;
    if(typeof(index) == 'undefined'){
      index = 0
    }
    var userId = app.globalData.userId
    // var that = this;
    var qus = that.data.qus
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/cancelVote.do?quId='+quId+'&userId=' + userId,
      method:'POST',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        var data = res.data
        if(data.success){
          // 如果获取成功
          qus[index].voted=false
          qus[index].quVoteNum=qus[index].quVoteNum-1

          that.setData({
            qus:qus
          })
          wx.showToast({
            title: '已取消点赞',
            icon: 'success',
            duration: 10000
          })

          setTimeout(function(){
            wx.hideToast()
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
  }else{
    // 没有登陆
    // 调用登陆接口
    app.wechatLogin(function(){
      // = login
      if(app.globalData.isLogin){
        // login success
        wx.redirectTo({
          url:'../index/index'
        })
        // that.unLiking(that.data.e)
      }else{
        util.alertShow(that,'login faile')
      }
    })
  }
  
}

function downloadFile(voicePath,app,cb) {
  // 下载语音文件
  wx.downloadFile({
    url: voicePath,
    success: function(res) {
      app.globalData.tempFilePath = res.tempFilePath;
      cb();
    },
    fail:function () {
      // 调用失败
      util.alertShow(that,'语音文件下载失败！')
    }
  })
}

// function voiceEvent(e,that,app) {
//     // 播放语音接口
//     // var that = this;
//     var util = this
//     var voicePath = e.currentTarget.dataset.type
//     var anId = e.currentTarget.dataset.anid
//     var isLogin = app.globalData.isLogin
//     if(isLogin){
//       if(that.data.isVoicePlaying){
//         // 正在播放中
//         wx.stopVoice();
//         util.alertShow(that,'停止播放');
//         that.setData({
//           isVoicePlaying:false
//         })
//       }else{
//         wx.downloadFile({
//           url: voicePath, 
//           success: function(res) {
//             console.log(res.tempFilePath)
//             wx.playVoice({
//               filePath: res.tempFilePath,
//               success:function (res) {
//                 // 语音被收听
//                 wx.request({
//                   url: 'https://www.huaxinapp.xyz/api/qa/VoiceListenedOne.do?anId='+anId+'&userId=' + app.globalData.userId,
//                   method:'POST',
//                   header: {
//                       'Authorization': 'Bearer '+app.globalData.token
//                   },
//                   success: function(res) {
//                     // 提交问题成功
//                     var data = res.data
//                     if(data.success){
//                       var index = e.currentTarget.dataset.anvoice;
//                       var qus = that.data.qus
//                       qus[index].anVoiceListened = qus[index].anVoiceListened+1
//                       that.setData({
//                         qus:qus
//                       })
//                       util.alertShow(that,'播放中！');
//                       that.setData({
//                         isVoicePlaying:true
//                       });
//                     }else{
//                       util.alertShow(that,'播放失败！')
//                     }
//                   },
//                   fail:function (res) {
//                     util.alertShow(that,'播放失败！')
//                   }
//                 })
//               },
//               complete: function(){
//                 util.alertShow(that,'播放成功！')
//               },
//               fail:function () {
//                 // 播放失败
//                 util.alertShow(that,'播放失败！')
//               }
//             })
//           },
//           fail:function () {
//             // 调用失败
//             util.alertShow(that,'语音文件下载失败！')
//           }
//         })
//       }
//     }else{
//       // 没有登陆
//       // 调用登陆接口
//       app.wechatLogin(function(){
//         // = login
//         if(app.globalData.isLogin){
//           // login success
//           that.voiceEvent(e,that,app)
//         }else{
//           util.alertShow(that,'login faile')
//         }
//       })
//     }
    
//   }

function voiceEvent(e,that,app) {
    // 播放语音接口
    var util = this;
    var voicePath = e.currentTarget.dataset.type;
    var anId = e.currentTarget.dataset.anid;
    var index = e.currentTarget.dataset.anvoice;
    // 操作preIndex
    if(that.data.preIndex === null){
      // 初始化
      that.setData({
        preIndex:index,
      });
    }
    // console.log(index+', '+that.data.preIndex);
    // console.log(that.data.isVoicePlaying);
    var isLogin = app.globalData.isLogin;
    var qus = that.data.qus;
    if(isLogin){
      if(that.data.isVoicePlaying){
        // wx.hideToast();
        util.alertShow(that,'停止播放语音！');
        wx.stopVoice();
        // wx.hideToast();
        
        if(that.data.preIndex != index){
          // 不同的语音
          // 变化之前的语音的文字提示
          that.setData({
            isVoicePlaying:false,
            preIndex:index
          });
          // 进入下个语音的播放动作
          util.voiceEvent(e,that,app);
        }else{
          // 同一个语音
          that.setData({
            isVoicePlaying:false
          })
        }
      }else{
        // 缓存提示
        wx.showToast({
          title: '缓冲中',
          icon:'loading',
          duration: 2000
        });
        wx.downloadFile({
          url: voicePath, 
          success: function(res) {
            // 保证语音下载文件不会出错
            that.setData({
              isVoicePlaying:true,
              preIndex:index
            });
            wx.hideToast();
            util.alertShow(that,'语音播放中');
            wx.playVoice({
              filePath: res.tempFilePath,
              success:function (res) {
                // 语音被收听
                // wx.showToast({
                //   title: '停止播放语音',
                //   duration: 10000
                // })
                wx.request({
                  url: 'https://www.huaxinapp.xyz/api/qa/VoiceListenedOne.do?anId='+anId+'&userId=' + app.globalData.userId,
                  method:'POST',
                  header: {
                      'Authorization': 'Bearer '+app.globalData.token
                  },
                  success: function(res) {
                    // 提交问题成功
                    var data = res.data
                    if(data.success){
                      qus[index].anVoiceListened = qus[index].anVoiceListened+1;
                      // 定时更改提示文字
                      var st = setTimeout(function(){
                        // 更改播放状态
                        that.setData({
                          isVoicePlaying:false
                        });
                      },qus[index].anVoiceDuration*1000)
                      that.setData({
                        qus:qus
                      })
                    }else{
                      util.alertShow(that,'播放失败！')
                    }
                  },
                  fail:function (res) {
                    util.alertShow(that,'播放失败！')
                  }
                })
              },
              fail:function () {
                // 播放失败
                util.alertShow(that,'播放失败！')
              }
            })
          },
          fail:function () {
            // 调用失败
            util.alertShow(that,'语音文件下载失败！')
          }
        })
      }
    }else{
      // 没有登陆
      // 调用登陆接口
      app.wechatLogin(function(){
        // = login
        if(app.globalData.isLogin){
          // login success
          that.voiceEvent(e,that,app)
        }else{
          util.alertShow(that,'login faile')
        }
      })
    } 
  }

function getPhoneInfo(that, app) {
  app.getPhoneInfo(function (phoneHeight, phoneWidth) {
      that.setData({
          phoneHeight: phoneHeight,
          phoneWidth: phoneWidth
      })
  });
}

function autoPlayImgResize(that,app){
  // 轮播图图片尺寸自适应屏幕
  var rt = that.data.phoneWidth/app.globalData.imgWidth
  var imgPfHeight = app.globalData.imgHeight*rt+'px'
  that.setData({
    imgPfHeight:imgPfHeight
  })
  console.log(that.data.imgPfHeight)
}

/**
 *
 * 生成从 1 到 length 之间的随机数组
 *
 * @length 随机数组的长度，如果未传递该参数，那么 length 为默认值 9
 *
 */
function randomArray(length) {
    var i,
        index,
        temp,
        arr = [length];
    length = typeof(length) === 'undefined' ? 9 : length;
    for (i = 1; i <= length; i++) {
        arr[i - 1] = i;
    }
    // 打乱数组
    for (i = 1; i <= length; i++) {
        // 产生从 i 到 length 之间的随机数
        index = parseInt(Math.random() * (length - i)) + i;
        if (index != i) {
            temp = arr[i];
            arr[i] = arr[index];
            arr[index] = temp;
        }
    }
    return arr;
}

// function popReset(that,app) {
//   // 弹窗根据屏幕尺寸垂直居中
//   app.getPhoneInfo(function (phoneHeight, phoneWidth,screenHeight,screenWidth) {
//     var top = screenHeight/2 - app.globalData.popHeight/2 + (900 - screenHeight)
//     that.setData({
//       popTop:top + 'px'
//     })
//   });
// }
module.exports = {
  formatTime: formatTime,
  turnToNextPage: turnToNextPage,
  backToPage: backToPage,
  alertShow:alertShow,
  alertHidden:alertHidden,
  stringToArray:stringToArray,
  isOutDate:isOutDate,
  tsToDate:tsToDate,
  formatDate:formatDate,
  getNowTime:getNowTime,
  comptime:comptime,
  sortAcs:sortAcs,
  phVal:phVal,
  checkChinese:checkChinese,
  nmCnVal:nmCnVal,
  difTimeInOD:difTimeInOD,
  turnToNextPage_redirect:turnToNextPage_redirect,
  timeCount:timeCount,
  voiceDuration:voiceDuration,
  enterToList:enterToList,
  acTypeToCn:acTypeToCn,
  arrayProcess:arrayProcess,
  liking:liking,
  unLiking:unLiking,
  voiceEvent:voiceEvent,
  getPhoneInfo:getPhoneInfo,
  autoPlayImgResize:autoPlayImgResize,
  acTypeClassify:acTypeClassify,
  downloadFile:downloadFile,
  randomArray:randomArray,
  // popReset:popReset,
}
