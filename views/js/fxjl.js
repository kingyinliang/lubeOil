var vm=new Vue({
	el: '#vmObj',
	data: {
	    rwdLists:'',
	    totalAmount:0
	},
	created:function(){
		var self=this;
		self.directList();
	},
	methods:{
		directList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/getDirectIntegral', // 数据接口地址  
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
			    			mui.toast('暂无分享奖励记录');
			    		}else{
			    			self.totalAmount=data.data.count;
			    			self.rwdLists=data.data.list;
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		indirectList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/getTwoIntegral', // 数据接口地址  
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
			    			mui.toast('暂无分享奖励记录');
			    		}else{
			    			self.totalAmount=data.data.count;
			    			self.rwdLists=data.data.list;
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		thirdList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/getThreeIntegral', // 数据接口地址  
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
			    			mui.toast('暂无分享奖励记录');
			    		}else{
			    			self.totalAmount=data.data.count;
			    			self.rwdLists=data.data.list;
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		direct:function(){
			var self=this;
			$('#tab_t li:eq(0)').addClass('act').siblings().removeClass('act');
			self.rwdLists='';
			self.directList();
		},
		indirect:function(){
			var self=this;
			$('#tab_t li:eq(1)').addClass('act').siblings().removeClass('act');
			self.rwdLists='';
			self.indirectList();
		},
		third:function(){
			var self=this;
			$('#tab_t li:eq(2)').addClass('act').siblings().removeClass('act');
			self.rwdLists='';
			self.thirdList();
		}
	}
});