var Url='https://lube.sdszwlkj.com';//'http://huishou.jzbwlkj.com';
var token=localStorage.getItem('token_lube');
console.log(token);

//获取参数
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);
//获取当前时间
var curTime=function(){
	var curDate=new Date();
	var curYear=curDate.getFullYear();
	var curMonth=curDate.getMonth()+1;
	var curDay=curDate.getDate();
	var curHour=curDate.getHours();
	var curMin=curDate.getMinutes();
	var curSec=curDate.getSeconds();
	if(curMonth<10){
		curMonth='0'+curMonth;
	}
	if(curDay<10){
		curDay='0'+curDay;
	}
	if(curHour<10){
		curHour='0'+curHour;
	}
	if(curMin<10){
		curMin='0'+curMin;
	}
	if(curSec<10){
		curSec='0'+curSec;
	}
	console.log(curYear+'-'+curMonth+'-'+curDay+' '+curHour+':'+curMin+':'+curSec);
	return curYear+'-'+curMonth+'-'+curDay+' '+curHour+':'+curMin+':'+curSec  //2018-08-04 09:08:08
}
//获取当前时间
var curDate=function(){
	var curDate=new Date();
	var curYear=curDate.getFullYear();
	var curMonth=curDate.getMonth()+1;
	if(curMonth<10){
		curMonth='0'+curMonth;
	}
	var current=curYear.toString()+curMonth.toString();
	return current  //201808
}
//选项卡点击事件
mui('.footer').on('tap', 'a', function(e) {
    var index=$(this).index();
	window.top.location.href=this.href;
});
//跳转下一页
function nextPage(nUrl,param){
	if(mui.os.plus){
		var vNextPage = null;
		var vCurrentWebView = plus.webview.currentWebview();
		if (vNextPage == null) {
	        vNextPage = plus.webview.getWebviewById(nUrl);
	        if (vNextPage != null) {
	            //触发下一个页面的自定义事件
	            mui.fire(vNextPage, 'refresh', param);
	        }
	    }
//	    if (vCurrentWebView != null) {
//	        vCurrentWebView.hide('none');
//	    }
		mui.openWindow({
	    	id:nUrl,
	    	url:nUrl,
	    	extras:param
	  	});
  	}else{
  		if(!param){
  			location.href=nUrl;
  		}else{
  			location.href=nUrl+'?argument='+JSON.stringify(param);
  		}
  	}
}
//数据请求
function postData(url,data,callback){
	$.ajax({  
        dataType:"json",
        type:"post",  
        url:Url+url,//接口服务器地址  
        data:data,//请求数据
        success:function(res){
        	console.log(res);
        	callback(res);
        	if(res.code==300){
        		location.href="login.html";
        	}
        },
        error:function(e){
        	mui.toast('网络请求失败,请检查网络连接');
        }  
  	});
}
//将时间戳转换成日期格式
function timestampToTime(timestamp,datetime) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate()<10?'0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours()<10?'0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes()<10?'0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds()<10?'0'+date.getSeconds() : date.getSeconds());
    if(datetime){
    	return Y+M+D+h+m+s;
    }else{
    	return Y+M+D;
    }
}
function getConfig(){
	var param={'token':token};
	postData('/api/public/getConfig',param,function(data){
		if(data.code==200){
			var resData=data.data;
			console.log(resData)
			return resData;
		}else{
			mui.toast(data.message);
		}
	});
}
function Calculation(type, num1, num2) {
 
    var temp1, temp2, a;
    try {
        // 获取temp1小数点后的长度
        temp1 = num1.toString().split(".")[1].length;
    }
    catch (e) {
        temp1 = 0;
    }
    try {
        // 获取temp2小数点后的长度
        temp2 = num2.toString().split(".")[1].length;
    }
    catch (e) {
        temp2 = 0;
    }
    // Math.max(temp1, temp2) 为了获取temp1和temp2两个值中较大的一个
    // Math.pow(a,b) 表示 a 的 b 次方
    a = Math.pow(10, Math.max(temp1, temp2));
 
    // 计算的方式是先将所有的小数乘为整数，待加减运算执行完之后再除去对应的 a 的值，将其变为小数输出
    // 先判断执行的方式是否是加法，不是的话则执行减法运算
    return type == "add" ? (num1 * a + num2 * a) / a : (num1 * a - num2 * a) / a;
}

setTimeout(() => {
    window.onpageshow=function(e){
        if(e.persisted) {
            window.location.reload()
        }
    };
},500)
