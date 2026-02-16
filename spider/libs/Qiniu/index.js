// ----------------------------------------------------------------------
// 七牛云上传  https://developer.qiniu.com/kodo/sdk/1289/nodejs
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import * as QiNiuSDk from 'qiniu'
import {QINIU_COMIC} from "../../conf";

/**
 * let upload = new QiNiu()
 * upload.do_upload("/tmp/test.jpg", "app/avatar/17666666666_test_23333.jpg")
 * */
export default class QiNiu {
    constructor() {
        let _this = this
        if (this.mac !== undefined) {
            console.log("已生成 mac ")
            return _this
        }
        this.app_id = QINIU_COMIC.access_key;
        this.app_secret = QINIU_COMIC.secret_key;
        if (this.app_id === "" || this.app_secret === "") {
            throw new Error("初始化七牛上传失败，请完成 es6/conf/business_comic.js 中 QINIU_COMIC 配置")
        }
        this.bucket = QINIU_COMIC.bucket;
        this.cdn_host = QINIU_COMIC.cdn_host; // 示例 http://tencent.cdn.hlzblog.top
        this.mac = new QiNiuSDk.auth.digest.Mac(this.app_id, this.app_secret)
    }

    /**
     * 获取 token
     * @return string
     */
    get_token(to_path) {
        let _this = this
        const options = {
            "scope": _this.bucket + ":" + to_path, // 覆盖上传
            "expires": 300, // 本次上传有效时间 300 s
        }
        let put_policy = new QiNiuSDk.rs.PutPolicy(options);
        return put_policy.uploadToken(this.mac)
    }

    /**
     * 获取CDN地址
     * @param string to_path 示例 app/avatar/test_23333.jpg
     * @return string
     */
    get_pic_src(to_path) {
        let _this = this
        //http://tencent.cdn.hlzblog.top/app/avatar/159828116110872.jpg
        this.cdn_host = QINIU_COMIC.cdn_host;
        let src = `${_this.cdn_host}/${to_path}`
        return src
    }

    /**
     * 实现上传
     * @return Promise string
     */
    do_upload(local_path, to_path) {
        let src = ""
        let _this = this
        let config = new QiNiuSDk.conf.Config();
        // 空间对应的机房
        config.zone = QiNiuSDk.zone.Zone_z0;
        // 是否使用https域名
        //config.useHttpsDomain = true;
        // 上传是否使用cdn加速
        //config.useCdnDomain = true;
        let formUploader = new QiNiuSDk.form_up.FormUploader(config);
        let putExtra = new QiNiuSDk.form_up.PutExtra();
        let promise = new Promise((resolve) => {
            formUploader.putFile(_this.get_token(to_path), to_path, local_path, putExtra, (err) => {
                if (err) {
                    console.log("Failed to upload Err:  " + err)
                    resolve(src)
                }
                src = _this.get_pic_src(to_path)
                resolve(src)
            });
        }).catch(err => {
            console.log("QiNiuSDk.stack  ", err);
        });


        return promise;
    }
}