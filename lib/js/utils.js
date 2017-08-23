function back(){
  window.history.back();
}

function turnToNextPage(path){
    window.location.href = path;
}

// 弹框js
function pop(){
    $('.mask-ui').show();
    $('#bomb-box1').show();
}

function pop_cancle(){
    $('.mask-ui').hide();
    $('#bomb-box1').hide();
}

function pop_affirm(){
    $('#bomb-box1').hide();
    // $('#bomb-box2').show();
    // var t = setTimeout(function(){
    //     window.location.href = 'index.html'
    // },2000)
}