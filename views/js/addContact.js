var phoneNum=$.getUrlParam('phone');
var contacter=decodeURI(decodeURI($.getUrlParam('name')));
var vm=new Vue({
	el: '#vmObj',
	data: {
	    contacter:'',
	    phoneNum:''
	},
	created:function(){
		var self=this;
		if(phoneNum&&contacter){
			self.contacter=contacter;
			self.phoneNum=phoneNum;
		}
	},
	methods:{
		telBl:function(){//手机号失去光标事件
			var self=this;
			var userPhone = $.trim(self.phoneNum);
			var ret = /^1[358746]{1}[0-9]{9}$/;
			if(ret.test(userPhone)){
				return true;
			}else{
				mui.toast('手机号输入错误', {duration:'long', type:'div'});
				return false;
			}
		},
		saveName:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/contact/add', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		name:self.contacter,
			 		phone:self.phoneNum
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
			    		mui.toast('添加成功');
			    		setTimeout(function(){
			    			location.href='contacter.html';
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