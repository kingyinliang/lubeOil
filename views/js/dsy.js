var mask = mui.createMask(function(){
	$('.orderMa').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
	    orderLists:'',
	    orderMa:''
	},
	created:function(){
		var self=this;
		self.getList();
	},
	methods:{
		getList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toBeUsedList', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{},
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
			    		if(data.data.length==0){
			    			mui.toast('暂无订单');
			    		}else{
			    			self.orderLists=data.data;
			    			$.each(self.orderLists, function(i,v) {
			    				v.createTime=v.createDate.split(' ')[0];
			    			});
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		getMa:function(id){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/order/toFinishNo', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		orderId:id
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
		toOrderinfo:function(index){
			var self=this;
			location.href="ddxq.html?orderId="+self.orderLists[index].id;
		},
		useOrder:function(index){
			var self=this;
			self.getMa(self.orderLists[index].id);
			mask.show();
			$('.orderMa').show();
		}
	}
});