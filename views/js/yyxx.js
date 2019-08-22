var vm=new Vue({
	el: '#vmObj',
	data: {
	    serviceLists:'',
	    shopLists:'',
	    serviceName:'',
	    serviceId:'',
	    shopName:'',
	    shopId:'',
	    serviceTime:'',
	    serUser:'',
	    shopDesc:'',
	    selected:'',
	    selected1:''
	},
	created:function(){
		var self=this;
		self.serviceList();
		self.shopList();
	},
	methods:{
		serviceList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/service/serviceList', // 数据接口地址  
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
			    			mui.toast('无数据');
			    		}else{
			    			self.serviceLists=data.data;
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		shopList:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/service/shopList', // 数据接口地址  
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
			    			mui.toast('无数据');
			    		}else{
			    			self.shopLists=data.data;
			    			self.shopDesc=self.shopLists[0].content;
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		serName:function(index){
			console.log(index);
			var self=this;
			self.serviceId=self.serviceLists[index].id;
			self.serviceName=self.serviceLists[index].name;
		},
		doorName:function(index){
			var self=this;
			self.shopId=self.shopLists[index].id;
			self.shopName=self.shopLists[index].name;
			self.shopDesc=self.shopLists[index].content;
		},
		serTime:function(){
			var self=this;
			var optionsJson = $('#demo4').attr('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				self.serviceTime=rs.value;
				picker.dispose();
			});
		},
		toDoor:function(){
			var self=this;
			location.href="door.html?shopDesc="+encodeURI(encodeURI(self.shopDesc));
		},
		submitBtn:function(){
			var self=this;
			if(!self.serviceId){
				mui.toast('请选择服务项目');
			}else if(!self.shopId){
				mui.toast('请选择服务门店');
			}else if(!self.serviceTime){
				mui.toast('请选择服务时间');
			}else if(!self.serUser){
				mui.toast('请输入预约人姓名');
			}else{
				$.ajax({   
				  	url:testUrl+'/user/service/serviceaddReservation', // 数据接口地址  
				  	type:'post',        //请求方式
				  	dataType:"json",   //返回数据类型
				 	data:{
				 		serviceId:self.serviceId,
				 		shopId:self.shopId,
				 		time:self.serviceTime,
				 		name:self.serUser
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
				    		if(data.data.length==0){
				    			mui.toast('无数据');
				    		}else{
				    			location.href="yy.html?orderNum="+data.data.yym;
				    		}
				     	}else if(data.code==-1){
				     		location.href='ljzc.html';
				     	}else{
				     		mui.toast(data.msg);
				     	}
				  	} 
				});
			}
		}
	}
});