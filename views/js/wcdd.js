var orderId=$.getUrlParam('orderId');
var vm=new Vue({
	el: '#vmObj',
	data: {
	    orderMa:''
	},
	created:function(){
		var self=this;
		self.getMa();
	},
	methods:{
		getMa:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toFinishNo', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		orderId:orderId
			 	},
			  	xhrFields : { 
  					withCredentials: true 
				},
			  	async : true, //是否异步
			  	//processData : false, 
				// 告诉jQuery不要去设置Content-Type请求头
				//contentType : false,
			  	error:function(){
			    	if(status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			    	if (data.code==0) {
			    		self.orderMa=data.data;
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		toOrderinfo:function(){
			location.href='ddxq.html?orderId='+orderId;
//			nextPage('grxx.html');
		},
		toIndex:function(){
			location.href='shop.html';
//			mui.openWindow({
//		    	id:'yyfw',
//		    	url:'yyfw.html'
//		  	});
		}
	}
});