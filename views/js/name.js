var userName=decodeURI(decodeURI($.getUrlParam('userName')));
var vm=new Vue({
	el: '#vmObj',
	data: {
	    nickName:''
	},
	created:function(){
		var self=this;
		self.nickName=userName;
	},
	methods:{
		saveName:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/userInfo/editUserName', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		name:self.nickName
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
			    		mui.toast('修改成功');
			    		setTimeout(function(){
			    			location.href='grzx.html';
			    		},500);
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		}
	}
});