if(!token){
	location.href="login.html";
}else{
var vm=new Vue({
	el: '#vmObj',
	data: {
	    userInfors:'',
	    orderNum:''
	},
	created:function(){
		var self=this;
		mui.plusReady(function(){
      		plus.webview.currentWebview().setPullToRefresh({support:false});
      	});
      	window.addEventListener('myInfo', function(e){//监听上一个页面fire返回
		    self.getInfo();
	 	});
		self.getInfo();
		// self.getOrderNum();
	},
	mounted: function () {
        var self=this;
        self.getOrderNum();
	},
	methods:{
		getInfo:function(){
			var self=this;
			$.ajax({  
		        dataType:"json",
		        type:"post",  
		        url:Url+'/api/user/getuserinfo',//接口服务器地址  
		        data:{
		        	token:token
		        },//请求数据
		        success:function(res){
		        	console.log(res);
		        	if(res.code==200){
			        	self.userInfors=res.data;
//			        	userInfo.avatar=self.userInfors.avatar;
			        	localStorage.setItem("userInfos", JSON.stringify(self.userInfors));
			        }else if(res.code==300){
			        	location.href="login.html";
			        }else{
			        	mui.toast(res.message);
			        }
		        },
		        error:function(e){
		        	mui.toast('网络请求失败,请检查网络连接');
		            //失败执行  
		            //mui.toast(e.status+','+ e.statusText);
		        }  
		  	});
		},
		getOrderNum:function(){
			var self=this;
			var param={'token':token};
			postData('/api/order/getOrderStatistical',param,function(data){
				if(data.code==200){
					self.orderNum=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		},
		toMyinfo:function(){
//			mui.openWindow({
//              url:'myInfo.html',
//              id:'myInfo.html',
//              extras:{
//              }
//         	});
           	location.href="myInfo.html";
		},
		toOrder:function(){
			var paramObj={'status':-1};
           	nextPage('myOrder.html',paramObj)
		},
		payOrder:function(){
           	var paramObj={'status':0};
           	nextPage('myOrder.html',paramObj)
		},
		sendOrder:function(){
			var paramObj={'status':1};
           	nextPage('myOrder.html',paramObj)
		},
		getOrder:function(){
			var paramObj={'status':2};
           	nextPage('myOrder.html',paramObj)
		},
		servOrder:function(){
			var paramObj={'status':7};
           	nextPage('myOrder.html',paramObj)
		},
		evalOrder:function(){
			var paramObj={'status':3};
           	nextPage('myOrder.html',paramObj)
		},
		refundOrder:function(){
			var paramObj={'status':6};
           	nextPage('myOrder.html',paramObj)
		},
		toAds:function(){
			mui.openWindow({
                url:'manageAds.html',
                id:'manageAds.html',
                extras:{
                }
           	});
		},
		toRmd:function(){
			mui.openWindow({
                url:'withdraw.html',
                id:'withdraw.html',
                extras:{
                }
           	});
		},
		toCoupons:function(){
			mui.openWindow({
                url:'myCoup.html',
                id:'myCoup.html',
                extras:{
                }
           	});
		},
		toCollect:function(){
			mui.openWindow({
                url:'myCol.html',
                id:'myCol.html',
                extras:{
                }
           	});
		},
		toProfile:function(){
			mui.openWindow({
                url:'myProfile.html',
                id:'myProfile.html',
                extras:{
                }
           	});
		},
		toShare:function(){
			mui.openWindow({
                url:'shareMa.html',
                id:'shareMa.html',
                extras:{
                }
           	});
		},
		toFeedback:function(){
			mui.openWindow({
                url:'myFeedback.html',
                id:'myFeedback.html',
                extras:{
                }
           	});
		},
		toPromo:function(){
			mui.openWindow({
                url:'myPromo.html',
                id:'myPromo.html',
                extras:{
                }
           	});
		},
		toPursell:function(){
			nextPage('pursellSave.html');
		}
	}
});
}
$('.setIcon').click(function(){
	mui.openWindow({
        url:'set.html',
        id:'set',
        extras:{
        }
   	});
});
$('.infoIcon').click(function(){
	mui.openWindow({
        url:'infor.html',
        id:'infor',
        extras:{
        }
   	});
});
var old_back = mui.back;
mui.back = function(){
 	//执行mui封装好的窗口关闭逻辑；
	nextPage('home.html');
    old_back();
}