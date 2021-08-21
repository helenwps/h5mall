import FileSaver from "file-saver";
import XLSX from "xlsx";
import Vue from "vue";
import axios from "axios";
const utils ={
    /**
     * @param {Object} file
     * 图片上传阿里云
     */
    uploadImgOss(file, vmThis,foldername='member') {
      var that = vmThis;
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
    		};
      //获取file文件后缀
      var pos = file.name? file.name.lastIndexOf(".") : file.type.lastIndexOf("/");
      var suffix = "";
      if (pos != -1) {
        suffix = file.name? file.name.substring(pos) : file.type.substring(pos);
      }
      //获取随机name组合字符串
      var len = 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    		}
    		
      //后台获取签名凭证
      return new Promise((resolve, reject) => {
        that.main.request(
          that.url.webuploadinfowithoutlogin,{},'get').then((res)=>{
              let content_len = Math.round((file.size * 100) / 1024) / 100;
              let name = foldername + "/" + pwd + suffix;
              let data = res.data.params;
              let uploadUrl = data.host;
              let reqData = new FormData();
              reqData.append("Content-Length", content_len);
              reqData.append("key", name);
              reqData.append("policy", data.policy);
              reqData.append("OSSAccessKeyId", data.accessid);
              reqData.append("success_action_status", "200");
              reqData.append("signature", data.signature);
              reqData.append("expire", data.expire);
              reqData.append("file", file);
              //获取凭证后上传到oss
              axios.post(uploadUrl, reqData, config)
                .then(() => {
                  var imageUrl = data.cdnurl + "/" + name;
                  resolve(imageUrl);
                })
                .catch(function(error) {
                  reject(error);
                });
          }).catch(function(error) {
            reject(error);
          });
      });
    },	
    goToPage(item) {
        if(item.key == 'h5page'){
            let url = location.origin +'/jump-mp.html#/index?id='+item.id;
            location.replace(url);  
        }else if(item.key == 'outlink'){
            location.href = item.url;
        }else if(item.key == 'userdefined'){
            location.href = item.url;
        }
    },
}
export default utils;