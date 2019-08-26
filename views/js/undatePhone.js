var vm=new Vue({
    el: '#vmObj',
    data: {
        phoneNum: '',
        psdNum:'',
    },
    created:function(){
        var self=this;

    },
    methods:{
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
        regBtn:function(){
            var self=this;
            if(!self.phoneNum){
                mui.toast('请输入手机号');
            }else if(!self.psdNum){
                mui.toast('请输入密码');
            }else{
                var param={'token':token,'mobile':self.phoneNum,'pass_word':self.psdNum};
                postData('/api/user/update_mobile',param,function(data){
                    if(data.code==200){
                        mui.toast(data.message);
                        setTimeout(function(){
                            window.close();
                            location.href="myInfo.html";
                        },500);
                    }else{
                        mui.toast(data.message);
                    }
                });
            }
        }
    }
});