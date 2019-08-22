var mask = mui.createMask(function(){
	$('.popPhone').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
	    phoneInfo:''
	},
	created:function(){
		var self=this;
		self.getInfo();
	},
	methods:{
		getInfo:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/service/getPhone', // 数据接口地址  
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
			    			self.phoneInfo=data.data;
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		},
		phoneOrder:function(){
			mask.show();
			$('.popPhone').show();
		}
	}
});
var old_back = mui.back;
mui.back = function(){
	location.href="grzx.html";
    old_back();
}