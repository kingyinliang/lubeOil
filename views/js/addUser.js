var typePicker = new mui.PopPicker({
	layer: 1
});
var cityPicker = new mui.PopPicker({
	layer: 3
});
var vm=new Vue({
	el: '#vmObj',
	data: {
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
		self.cityData();
		typePicker.setData(self.userType);
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
			'city':self.cityId,'area':self.areaId,'address':self.detAds,'note':self.markCont};
			postData('/api/customer/addCustomer',param,function(data){
				if(data.code==200){
					mui.toast('新增成功');
					setTimeout(function(){
						window.close();
						location.href="pursellSave.html";
//						var self = plus.webview.currentWebview();
//				　　　　	var opener = self.opener();
//				        mui.fire(opener,'refresh',{param:true}); 
//			　　　　        	self.close();
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