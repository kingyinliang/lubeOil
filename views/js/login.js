var vm=new Vue({
	el: '#vmObj',
	data: {
	    phoneNum: '',
	    psdNum:''
	},
	created:function(){
		var self=this;
	},
	methods:{
		telBl:function(){
			var self=this;
			var userPhone = $.trim(self.phoneNum);
			var ret = /^1[3587469]{1}[0-9]{9}$/;
			if(ret.test(userPhone)){
				return true;
			}else{
				mui.toast('手机号输入错误', {duration:'long', type:'div'});
				return false;
			}
		},
		toReg:function(){
			var self=this;
			nextPage('register.html');
		},
		toFot:function(){
			var self=this;
			nextPage('forgetPsd.html');
		},
		login:function(index){
			var self=this;
			if(!self.phoneNum){
				mui.toast('请输入手机号');
			}else if(!self.psdNum){
		  		mui.toast('请输入密码');
			}else{
				var param={'mobile':self.phoneNum,'password':self.psdNum};
				postData('/api/public/login',param,function(data){
					if(data.code==200){
						mui.toast('登录成功');
						localStorage.setItem('token_lube',data.data.token);
						var param1={'token':data.data.token};
						postData('/api/user/getuserinfo',param1,function(data){
							if(data.code==200){
								localStorage.setItem('myInfos',JSON.stringify(data.data));
							}else{
								mui.toast(data.message);
							}
						});
						postData('/api/public/bind_openid',param1,function(data){
							if(data.code==200){
								setTimeout(function(){
									nextPage('home.html');
								},500);
							}else if(data.code==500){
								postData('/api/public/wxLogin','',function(data1){
									if(data1.code==200){
										console.log(data1.data.url);
										location.href=data1.data.url;
									}else{
										mui.toast(data.message);
									}
								});
							}else{
								mui.toast(data.message);
							}
						});
						
					}else{
						mui.toast(data.message);
					}
				});
		  	}
		}
	}
});