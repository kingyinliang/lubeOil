var vm=new Vue({
	el: '#vmObj',
	data: {
	    phoneNum: '',
	    checkNum:'',
	    psdNum:'',
	    carType:'',
	    brand:'',
	    buyDate:''
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
		getChecknum:function(){
			var self=this;
			if(!self.phoneNum){
				mui.toast('请输入手机号', {duration:'long', type:'div'});
			}else if(self.telBl()){
				var param={'mobile':self.phoneNum,'type':'forgotten'};
				postData('/api/public/sendsms',param,function(data){
					if(data.code==200){
						$('.checkCode').html('已发送(60s)');
						$('.checkCode').css('color','#ccc');
						$('.checkCode').prop('disabled',true);
						var setTime;
				        $(document).ready(function(){
				            var time=parseInt($(".checkCode").text().substring(4,6));
				            setTime=setInterval(function(){
				                if(time<=0){
				                    clearInterval(setTime);
				                    $(".checkCode").text('重新获取');
				                    $('.checkCode').css('color','#2079E8');
				                    $('.checkCode').prop('disabled',false);
				                    return;
				                }
				                time--;
				                $(".checkCode").text('已发送（'+time+'s）');
				            },1000);
				        });
					}else{
						mui.toast(data.message);
					}
				});
			}else{
				mui.toast('手机号输入错误', {duration:'long', type:'div'});
			}
		},
		confirmPsd:function(){
			var self=this;
			if(self.psdNum1!=self.psdNum){
				mui.toast('两次输入的密码不一样');
				return false;
			}else{
				return true;
			}
		},
		regBtn:function(){
			var self=this;
			if(!self.phoneNum){
				mui.toast('请输入手机号');
			}else if(!self.psdNum){
		  		mui.toast('请输入密码');
		  	}else if(!self.checkNum){
				mui.toast('请输入验证码');
			}else{
				var param={'mobile':self.phoneNum,'code':self.checkNum,'password':self.psdNum};
				postData('/api/public/forgetpwd',param,function(data){
					if(data.code==200){
						mui.toast(data.message);
						setTimeout(function(){
							nextPage('login.html');
						},500);
					}else{
						mui.toast(data.message);
					}
				});
		  	}
		}
	}
});