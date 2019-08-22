var vm=new Vue({
	el: '#vmObj',
	data: {
		withInfo:'',
		withMoney:'',
		cardNum:'',
		realName:'',
		cardName:''
	},
	created:function(){
		var self=this;
		self.getInfo();
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token};
			postData('/api/user/getuserinfo',param,function(data){
				if(data.code==200){
					self.withInfo=data.data;
				}else{
					mui.toast(data.message);
				}
			});
		},
		withdraw:function(){
			var self=this;
			if (self.withInfo.balance*1<self.withMoney*1) {
                mui.toast('请输入正确金额');
				return false
			}
			// var param={'token':token,'account':self.cardNum,'bank_name':self.cardName,'realname':self.realName,'money':self.withMoney};
			var param={'token':token, 'money':self.withMoney};
			postData('/api/withdraw/addApply',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					location.href="my.html";
				}else{
					mui.toast(data.message);
				}
			});
		}
	}
});
$('.headTxt').click(function(){
	location.href="withdrawInfo.html";
})
