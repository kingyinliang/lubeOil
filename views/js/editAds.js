var cityPicker = new mui.PopPicker({
	layer: 3
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		adsId:'',
		adsInfos:'',
		takerName:'',
	    phoneNum: '',
	    adsArea:'',
	    proName:'',
	    cityName:'',
	    areaName:'',
	    adsDetail:'',
	    cityDatas:''
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.adsId=muiSelf.adsId;
				console.log("extras:" + self.adsId);
				self.getAds();
			});
			window.addEventListener("refresh", function(event) {
				self.adsId=event.detail.adsId;
				console.log("extras:" + self.adsId);
				self.getAds();
		    }, false);
		}else{
			self.adsId=JSON.parse($.getUrlParam('argument')).adsId;
			console.log(self.adsId);
			self.getAds();
		}
		self.cityData();
	},
	methods:{
		cityData:function(){
			var self=this;
			postData('/api/public/getAreaList','',function(data){
				if(data.code==200){
					self.cityDatas=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		},
		getAds:function(){
			var self=this;
			var param={'token':token,'id':self.adsId};
			postData('/api/user/getUserAddressInfo',param,function(data){
				if(data.code==200){
					self.adsInfos=data.data;
					self.takerName=data.data.consignee;
				    self.phoneNum=data.data.mobile;
				    self.adsArea=data.data.province_text+data.data.city_text+data.data.area_text;
				    self.adsDetail=data.data.address;
				    self.proName=data.data.province;
					self.cityName=data.data.city;
					self.areaName=data.data.area;
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
		saveAds:function(index){
			var self=this;
			var param={'token':token,'consignee':self.takerName,'mobile':self.phoneNum,'province':self.proName,
			'city':self.cityName,'area':self.areaName,'address':self.adsDetail,'id':self.adsId};
			postData('/api/user/editAddress',param,function(data){
				if(data.code==200){
					mui.toast('编辑成功');
					// nextPage('manageAds.html');
					setTimeout(function(){
                        history.back(-1);
						// plus.webview.close(plus.webview.currentWebview());
						//plus.webview.currentWebview().close();
					},500);
				}else{
					mui.toast(data.message);
				}
			});
		}
	}
});