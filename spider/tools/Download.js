import * as  fs from 'fs';
import UserAgentTool from "./UserAgentTool";
import Log from "./Log";

const HttpProxyAgent = require('http-proxy-agent');
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch

export default class Download {
    static do_request(ctx, url, save_path) {
        let back = "" // 成功则返回响应
        let options = {
            "method": "GET",
            "headers": {
                "User-Agent": UserAgentTool.fake_one(),
                "Content-Type": "application/octet-stream",
            },
            // "agent": HttpProxyAgent("http代理地址 TODO"),
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "mode": "cors"
        }
        return new Promise((resolve => {
            fetch(url, options)
                .then(res => res.buffer()).then(_ => {
                fs.writeFile(save_path, _, "binary", function (err) {
                    if (err) {
                        console.error(err);
                        fs.unlinkSync(save_path)
                    } else {
                        back = save_path
                    }
                    resolve(back)
                });
            }).catch((err) => {
                Log.ctxInfo(ctx, `抓取失败 url.(${url}) Err: ` + err.stack())
                resolve(back)
            });
        }))

    }
}