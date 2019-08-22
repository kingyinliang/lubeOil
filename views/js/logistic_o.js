var vm=new Vue({
	el: '#vmObj',
	data: {
	    logisticInfos: '',
	    orderId:''
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.orderId=muiSelf.orderId;
				console.log("extras:" + self.orderId);
				self.getInfo();
			});
			window.addEventListener("refresh", function(event) {
				self.orderId=event.detail.orderId;
				console.log("extras:" + self.orderId);
				self.getInfo();
		    }, false);
		}else{
			self.orderId=JSON.parse($.getUrlParam('argument')).orderId;
			console.log(self.orderId);
			self.getInfo();
		}
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'order_id':self.orderId};
			postData('/api/logistics/getOrderLogistics',param,function(data){
				if(data.code==200){
					self.logisticInfos=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		}
	},
	mounted:function(){
		var self=this;
		setTimeout(function(){
			if($('.logisCont.carBan img').height()<$('.logisCont .carBan img').width()){
				$('.logisCont .carBan img').height('1.48rem');
			}else{
				$('.logisCont .carBan img').width('1.48rem');
			}
		},500)
	}
});
$('.headTxt').click(function(){
	nextPage('shipRecord.html');
});