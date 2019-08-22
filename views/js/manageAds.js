var vm=new Vue({
	el: '#vmObj',
	data: {
	    adsLists: '',
	    ads:0,
	    isBuy:0
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				if(muiSelf.isBuy){
					self.isBuy=muiSelf.isBuy;
					console.log("extras:" + self.isBuy);
				}
			});
		}else{
			if(JSON.parse($.getUrlParam('argument'))){
				self.isBuy=JSON.parse($.getUrlParam('argument')).isBuy;
				console.log(self.isBuy);
			}
		}
		self.isBuy=$.getUrlParam('isBuy');
		self.getList();
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token};
			postData('/api/user/getUserAddressList',param,function(data){
				if(data.code==200){
					self.adsLists=data.data;
					//alert(data.data);
					$.each(self.adsLists, function(i,v) {
						if(v.is_default==1){
							localStorage.setItem('defaultAds',JSON.stringify(v));
						}
					});
				}else{
					mui.toast(data.message);
				}
			});
		},
		setDefault:function(index){
			var self=this;
			if(self.adsLists[index].is_default==0){
			var param={'token':token,'id':self.adsLists[index].id};
			postData('/api/user/setDefault',param,function(data){
				if(data.code==200){
					mui.toast('设置成功');
					self.getList();
					self.ads=1;

				}else{
					mui.toast(data.message);
				}
			});
			}
		},
		editAds:function(index){
			var self=this;
			var paramObj={'adsId':self.adsLists[index].id};
			nextPage('editAds.html',paramObj);
		},
		delAds:function(index){
			var self=this;
			var btnArray = ['确定', '取消'];
			mui.confirm('您确定要删除此收货地址吗？', '温馨提示', btnArray, function(e) {
				if (e.index == 0) {
					var param={'token':token,'id':self.adsLists[index].id};
					postData('/api/user/delAddress',param,function(data){
						if(data.code==200){
							mui.toast(data.message);
							self.getList();
						}else{
							mui.toast(data.message);
						}
					});
				} else {
					mui.toast('取消删除');
				}
			})
			
		},
		addAds:function(){
//			plus.webview.currentWebview().close();
//			plus.webview.create('newAds.html').show();
//			nextPage('newAds.html');
			location.href="newAds.html";
		},
		toOrder:function(index){
			var self=this;
			var paramObj={'adsId':self.adsLists[index].id};
			if(self.isBuy==1){
				localStorage.setItem('adsId',self.adsLists[index].id);
				setTimeout(function(){
					//window.close();
					history.back(-1);
                    // window.location.href=document.referrer;
				},500);
			}
		}
	}
});