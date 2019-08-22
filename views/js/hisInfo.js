var vm=new Vue({
	el: '#vmObj',
	data: {
		boundId:'',
		interInfos:''
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.boundId=muiSelf.boundId;
				console.log("extras:" + self.boundId);
				self.getInfo();
			});
		}else{
			console.log(JSON.parse($.getUrlParam('argument')));
			self.boundId=JSON.parse($.getUrlParam('argument')).boundId;
			console.log(self.boundId);
			self.getInfo();
		}
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'id':self.boundId};
			postData('/api/inventorygoods/getGoodsInfo',param,function(data){
				if(data.code==200){
					self.interInfos=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		}
	}
});
var old_back = mui.back;
mui.back = function(){
 	//执行mui封装好的窗口关闭逻辑；
	//nextPage('index.html');
    old_back();
}