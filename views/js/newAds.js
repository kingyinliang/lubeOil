var cityPicker = new mui.PopPicker({
	layer: 3
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		cityDatas:'',
		takerName:'',
	    phoneNum: '',
	    adsArea:'',
	    proName:'',
	    cityName:'',
	    areaName:'',
	    adsDetail:''
	},
	created:function(){
		var self=this;
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
				self.proName=(items[0] || {}).value;
				self.cityName=(items[1] || {}).value;
				self.areaName=(items[2] || {}).value;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		},
		saveAds:function(){
			var self=this;
			if(!self.takerName){
				mui.toast('请填写收货人姓名');
			}else if(!self.phoneNum){
				mui.toast('请填写收货人手机号');
			}else if(!self.adsArea){
				mui.toast('请选择所在地区');
			}else if(!self.adsDetail){
				mui.toast('请填写街道、楼牌号');
			}else{
			var param={'token':token,'consignee':self.takerName,'mobile':self.phoneNum,'province':self.proName,
			'city':self.cityName,'area':self.areaName,'address':self.adsDetail};
			postData('/api/user/addAddress',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					//nextPage('manageAds.html');
					setTimeout(function(){
//						history.back(-1);
//						window.opener=null;
//						window.open('','_self');
//						window.close();
						location.href="manageAds.html";
//						plus.webview.close('manageAds.html');
//						plus.webview.close('newAds.html');
//						plus.webview.create('manageAds.html').show();
						//plus.webview.currentWebview().close();
					},500);
				}else{
					mui.toast(data.message);
				}
			});
			}
		}
	}
});