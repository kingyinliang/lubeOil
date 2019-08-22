var cityPicker = new mui.PopPicker({
	layer: 3
});
var vm=new Vue({
	el: '#vmObj',
	data: {
	    phoneNum: '',
	    checkNum:'',
	    psdNum:'',
	    sendWay:4,
	    carType:'',
	    brand:'',
	    buyDate:'',
	    adsArea:'',
	    areaId:'',
	    adsDetail:'',
	    shopName:'',
	    invitId:''
	},
	created:function(){
		var self=this;
		self.invitId=$.getUrlParam('invitId');
		self.cityData();
	},
	methods:{
		cityData:function(){
			var self=this;
			var param={'pid':1};
			postData('/api/public/getAreaList','',function(data){
				if(data.code==200){
					self.cityDatas=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		},
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
				var param={'mobile':self.phoneNum,'type':'register'};
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
		getArea:function(){
			var self=this;
			for(var i=0;i<self.cityDatas.length;i++){
				for(var j=0;j<self.cityDatas[i].children.length;j++){
					for(var k=0;k<self.cityDatas[i].children[j].children.length;k++){
						self.cityDatas[i].children[j].children[k].value=self.cityDatas[i].children[j].children[k].id;
						self.cityDatas[i].children[j].children[k].text=self.cityDatas[i].children[j].children[k].name;
						//cityArr2.push({"value":self.cityDatas[i].children[j].id,"text":self.cityDatas[i].children[j].name});
					}
					self.cityDatas[i].children[j].value=self.cityDatas[i].children[j].id;
					self.cityDatas[i].children[j].text=self.cityDatas[i].children[j].name;
					//cityArr1.push({"value":self.cityDatas[i].id,"text":self.cityDatas[i].name,'children':cityArr2});
				}
				self.cityDatas[i].value=self.cityDatas[i].id;
				self.cityDatas[i].text=self.cityDatas[i].name;
        		//newData.push({"value":self.cityDatas[i].id,"text":self.cityDatas[i].name,'children':cityArr1});
			}
        	
        	console.log(self.cityDatas);
			cityPicker.setData(self.cityDatas);
			cityPicker.show(function(items) {
				self.adsArea = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
				self.areaId=(items[2] || {}).value;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		},
		regBtn:function(){
			var self=this;
			if(!self.phoneNum){
				mui.toast('请输入手机号');
			}else if(!self.psdNum){
		  		mui.toast('请输入密码');
		  	}else if(!self.checkNum){
				mui.toast('请输入验证码');
			}else if(!self.carType){
		  		mui.toast('请输入车辆型号');
		  	}else if(!self.brand){
				mui.toast('请输入品牌');
			}else if(!self.buyDate){
				mui.toast('请输入购买日期');
			}else{
				var param={'mobile':self.phoneNum,'code':self.checkNum,'password':self.psdNum,'user_type':self.sendWay,
				'type':self.carType,'brand':self.brand,'purchase_date':self.buyDate,'inviter_uid':self.invitId};
				postData('/api/agent/register',param,function(data){
					if(data.code==200){
						mui.toast(data.message);
						setTimeout(function(){
							location.href="http://lube.sdszwlkj.com/lubeOil/index.html";
						},500);
					}else{
						mui.toast(data.message);
					}
				});
		  	}
		}
	}
});