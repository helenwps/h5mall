var temp = new Temp();
let [host, tmg] = ["", ""];
if (document.domain == 'localhost') {//localhost
  // host = temp.decode('aHR0cHM6Ly9iMmItZGV2LnFkYW1hLmNuL2IyYi8='); //dev 
  tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK'); //dev
  host = "https://b2b-k8s01-stage.cn/b2b/"; //k8s01-stage
  // host = temp.decode('aHR0cHM6Ly9iMmItbnVjLnFkYW1hLmNuL2IyYi8=');//nuc环境
  host = "https://b2b-k8s01-stage.cn/b2b/"; //k8s01-stage
//   host = "https://b2b-k8s01-stage.cn/b2b/"; //k8s01-stage
}else if(document.domain == 'h5-mall-dev.cn'){ //dev 环境
    host = temp.decode('aHR0cHM6Ly9iMmItZGV2LnFkYW1hLmNuL2IyYi8='); 
    tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK');
}else if(document.domain == 'h5-mall-qa-merge.cn'){ //qa-merge
    host = temp.decode('aHR0cHM6Ly9iMmItcWEtbWVyZ2UucWRhbWEuY24vYjJiLw==');
    tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK')
}else if (document.domain == 'h5-mall-k8s-qa.cn') { //k8s-qa
     host = temp.decode('aHR0cHM6Ly9iMmItazhzLXFhLnFkYW1hLmNuL2IyYi8=');
     tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK');
}else if (document.domain == 'h5-mall.cn') { //正式环境
     host = temp.decode('aHR0cHM6Ly9taWRvZmZpY2UucWRhbWEuY24vYjJiLw==');
     tmg = temp.decode('M0pyOFMxSzE4cmNDMXdBZnY4')
}else if(document.domain == 'h5-mall-k8s01-stage.cn'){//k8s01-stage
    index = 'https://h5-mall-k8s01-stage.cn';
    host = 'https://b2b-k8s01-stage.cn/b2b/';
    tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK')
}else if(document.domain == 'h5-mall-k8s02-stage.cn'){//k8s02-stage
    index = 'https://h5-mall-k8s02-stage.cn';
    host = 'https://b2b-k8s02-stage.cn/b2b/';
    tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK')
}else if(document.domain == 'h5-mall-k8s01-qa.cn'){//k8s01-qa
    index = 'https://h5-mall-k8s01-qa.cn';
    host = 'https://b2b-k8s01-qa.cn/b2b/';
    tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK')
}else if(document.domain == 'h5-mall-k8s02-qa.cn'){//k8s02-qa
    index = 'https://h5-mall-k8s02-qa.cn';
    host = 'https://b2b-k8s02-qa.cn/b2b/';
    tmg = temp.decode('eHBNRmo3T2lxeDVFUUs1ajZK')
}else if(document.domain == 'h5-mall-gray01.cn'){//gray01
    host = 'https://midoffice-gray01.cn/b2b/';
    tmg = temp.decode('M0pyOFMxSzE4cmNDMXdBZnY4')
}


module.exports = {
	mHost:host,
    md5key: tmg,
    syslanguage: host + "account/syslanguage", // 获取语言菜单
    memberheaderRegist: host + "member/memberheader/regist",//会员注册
    sendsmscode: host + "member/memberheader/sendsmscode",//注册会员，获取验证码
    webuploadinfowithoutlogin: host + 'file/upload/file/webuploadinfowithoutlogin',// 获取上传签名等参数

    savehead: host + "product/head/savehead" ,//POST  团长模式-编辑团长(H5专用)
    getheadbycondition: host + "product/head/getheadbycondition",// POST  团长模式-根据不同条件查看团长信息(未登录)
    sendcomheadsmscode: host + "member/memberheader/sendsmscode", //GET  合并会员获取短信验证码
    ckecksmscode: host + "member/memberheader/ckecksmscode",//GET  中台-短信验证码校验
    getlastversion: host + "common/applicationversion/getlastversion", //POST  检查助手版本是否需要更新(配置白名单)

    
    // h5外链
    getH5PageByIdInWhiteUrls: host + "common/webcontent/getH5PageByIdInWhiteUrls",//获取某个H5页面信息
}

function Temp() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
