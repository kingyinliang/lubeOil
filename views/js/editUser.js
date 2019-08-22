var typePicker = new mui.PopPicker({
	layer: 1
});
var cityPicker = new mui.PopPicker({
	layer: 3
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		userId:'',
		userName:'',
		userPhone:'',
		cityDatas:'',
	    adsName:'',
	    provId:'',
	    cityId:'',
	    areaId:'',
	    detAds:'',
	    userType:[{value:0,text:'小客户'},{value:1,text:'中客户'},{value:2,text:'大客户'}],
	    markType:'',
	    markId:'',
	    markCont:''
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.userId=muiSelf.userId;
				console.log("extras:" + self.userId);
				self.getInfo();
			});
		}else{
			console.log(JSON.parse($.getUrlParam('argument')));
			self.userId=JSON.parse($.getUrlParam('argument')).userId;
			console.log(self.userId);
			self.getInfo();
		}
		self.cityData();
		typePicker.setData(self.userType);
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'id':self.userId};
			postData('/api/customer/getCustomerInfo',param,function(data){
				if(data.code==200){
					self.userName=data.data.name;
					self.userPhone=data.data.mobile;
					self.adsName=data.data.province_name+data.data.city_name+data.data.area_name;
					self.detAds=data.data.address;
					if(data.data.type==0){
						self.markType='小客户';
					}else if(data.data.type==1){
						self.markType='中客户';
					}else if(data.data.type==2){
						self.markType='大客户';
					}
					self.markCont=data.data.note;
					self.provId=data.data.province;
					self.cityId=data.data.city;
					self.areaId=data.data.area;
					self.markId=data.data.type;
				}else{
					mui.toast(data.message);
				}
			});
		},
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
		getArea:function(){
			var self=this;
			for(var i=0;i<self.cityDatas.length;i++){
				for(var j=0;j<self.cityDatas[i].children.length;j++){
					for(var k=0;k<self.cityDatas[i].children[j].children.length;k++){
						self.cityDatas[i].children[j].children[k].value=self.cityDatas[i].children[j].children[k].id;
						self.cityDatas[i].children[j].children[k].text=self.cityDatas[i].children[j].children[k].name;
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
				if(JSON.stringify(items[2]) == "{}"){
					self.adsName = (items[0] || {}).text + " " + (items[1] || {}).text;
					self.provId=(items[0] || {}).value;
					self.cityId=(items[1] || {}).value;
					self.areaId='';
				}else{
					self.adsName = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
					self.provId=(items[0] || {}).value;
					self.cityId=(items[1] || {}).value;
					self.areaId=(items[2] || {}).value;
				}
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		},
		selType:function(){
			var self=this;
			typePicker.show(function(items) {
				console.log(items);
				self.markType=items[0].text;
				self.markId=items[0].value;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
			//nextPage('selGoods.html');
		},
		saveUser:function(){
			var self=this;
			if(!self.userName){
				mui.toast('请输入姓名');
			}else if(!self.userPhone){
				mui.toast('请输入客户联系电话');
			}else if(!self.adsName){
				mui.toast('请选择所在地区');
			}else if(!self.detAds){
				mui.toast('请输入详细地址');
			}else if(!self.markType){
				mui.toast('请选择类别');
			}else if(!self.markCont){
				mui.toast('请填写备注');
			}else{
			var param={'token':token,'name':self.userName,'mobile':self.userPhone,'type':self.markId,'province':self.provId,
			'city':self.cityId,'area':self.areaId,'address':self.detAds,'note':self.markCont,'id':self.userId};
			postData('/api/customer/editCustomer',param,function(data){
				if(data.code==200){
					mui.toast('编辑成功');
					setTimeout(function(){
						var self = plus.webview.currentWebview();
				　　　　	var opener = self.opener();
				        mui.fire(opener,'refresh',{param:true}); 
			　　　　        	self.close();
					})
				}else{
					mui.toast(data.message);
				}
			});
			}
		}
	}
});
var old_back = mui.back;
mui.back = function(){
 	//执行mui封装好的窗口关闭逻辑；
	//nextPage('index.html');
    old_back();
}