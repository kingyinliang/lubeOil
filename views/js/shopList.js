var vm=new Vue({
	el: '#vmObj',
	data: {
		shopLists:'',
		sendWay:''
	},
	created:function(){
		var self=this;
		self.getList();
	},
	methods:{
		getList:function(){
			var self=this;
			var param={'token':token,'address_id': JSON.parse($.getUrlParam('argument')).addressId,};
			postData('/api/agent/getList',param,function(data){
				if(data.code==200){
					self.shopLists=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		},
		toOrder:function(index){
			var self=this;
			if (JSON.parse($.getUrlParam('argument')).type == '0') {
                var paramObj={'sendWay':2,'shopName':encodeURI(encodeURI(self.shopLists[index].user_nickname)),'shopId':self.shopLists[index].id};
                nextPage('cartOrder.html',paramObj);
			} else if (JSON.parse($.getUrlParam('argument')).type == '1') {
                var paramObj={'sendWay':2,'shopName':encodeURI(encodeURI(self.shopLists[index].user_nickname)),'shopId':self.shopLists[index].id};
                nextPage('cfmOrder.html',paramObj);
			}

		}
	}
});
