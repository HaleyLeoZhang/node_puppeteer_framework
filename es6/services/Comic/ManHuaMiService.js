import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "https://www.manhua3.com" // 爬取地址  https://www.manhua3.com/woweixiedi
const CryptoJS = require("crypto-js"); // image列表页，解密依赖库

export default class ManHuaMiService extends Base {
    static get_base_href() {
        return BASE_HREF
    }

    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `${BASE_HREF}/${source_id}`
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        console.log(target_url)
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".module-info-heading").find("h1").text()
                let pic = $(".module-item-pic img").eq(0).attr("src")
                let intro = $(".module-info-content p").eq(0).text().trim("")
                Log.ctxInfo(ctx, "数据如下", {name, pic, intro})
                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 基本信息`)
                return {name, pic, intro}
            })
    }

    /**
     * @return Promise
     */
    static async get_chapter_list(ctx, source_id) {
        let _this = this
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 列表信息-头部`)
        let target_url = `${BASE_HREF}/${source_id}`
        let sequence = 0
        let chapter_list = []
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        // 先拉头部
        await fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let li_dom_list = $(".module-list .module-play-list-link")
                let len_li_dom_list = li_dom_list.length
                if (len_li_dom_list > 0) {
                    for (let i = 0; i < len_li_dom_list; i++) {
                        let dom = li_dom_list.eq(i)
                        let link = dom.attr("href")
                        // console.log(link)
                        link = _this.getLink(link)
                        let name = dom.find("span").text()
                        let tmp_one = {
                            link,
                            name,
                        }
                        chapter_list.push(tmp_one)
                    }
                    Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 总计章节数 ${len_li_dom_list}`)
                }
            })
        return chapter_list

    }

    static getLink(path) {
        // 匹配跳转地址
        let result = path.match(/%2F(\d.*)/)
        // console.log(result)
        let real_path = result[1]

        return `https://manhuami.cc/${real_path}`
    }

    /**
     * @return Promise
     */
    static async get_image_list(ctx, target_url) {
        let image_list = [];
        Log.ctxInfo(ctx, `开始拉取 ${target_url} 图片列表`)

        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                // 图片原始数据在这里
                let script_match = html.match(/var DATA='(.*?)';/)
                if(script_match === null){
                    throw new Error("ManHuaMiService 解析图片列表，原始数据失败")
                }
                let obj = ManHuaMiService.parseData(script_match[1]);
                // console.log('obj')
                // console.log(obj)
                // 见 params.images 参数结果  https://manhuami.cc/template/pc/manhuawang/js/pic2.js
                // 解密所需库 https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
                // TODO 2024-9-26 23:51:44 当前剩余问题，这个库在 Node的 Module模块
                //   加载不出来 decode_code_tool 变量的对象 CryptoJS, 能解决就能跑完流程
                for(let i in obj.images){
                    let item = obj.images[i]
                    image_list.push(item.url)
                }
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
    // 解码
    static parseData(DATA ) {
        var _0xods='jsjiami.com.v7';function _0x187f(_0x1a2dea,_0x20786d){var _0x5bed67=_0x5bed();return _0x187f=function(_0x187f60,_0x12cdcb){_0x187f60=_0x187f60-0x115;var _0xdcd153=_0x5bed67[_0x187f60];if(_0x187f['WtUdrt']===undefined){var _0x49ca55=function(_0x47a04e){var _0x33e7a1='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x5e94ad='',_0x3b12e1='';for(var _0x17aa3c=0x0,_0x20b494,_0x22db3b,_0x28888b=0x0;_0x22db3b=_0x47a04e['charAt'](_0x28888b++);~_0x22db3b&&(_0x20b494=_0x17aa3c%0x4?_0x20b494*0x40+_0x22db3b:_0x22db3b,_0x17aa3c++%0x4)?_0x5e94ad+=String['fromCharCode'](0xff&_0x20b494>>(-0x2*_0x17aa3c&0x6)):0x0){_0x22db3b=_0x33e7a1['indexOf'](_0x22db3b);}for(var _0x5aab44=0x0,_0x4df1c1=_0x5e94ad['length'];_0x5aab44<_0x4df1c1;_0x5aab44++){_0x3b12e1+='%'+('00'+_0x5e94ad['charCodeAt'](_0x5aab44)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3b12e1);};var _0x496a91=function(_0x40c6fc,_0x3c617f){var _0xe7dfcc=[],_0x30bc02=0x0,_0xb8b280,_0x219821='';_0x40c6fc=_0x49ca55(_0x40c6fc);var _0x2bcbeb;for(_0x2bcbeb=0x0;_0x2bcbeb<0x100;_0x2bcbeb++){_0xe7dfcc[_0x2bcbeb]=_0x2bcbeb;}for(_0x2bcbeb=0x0;_0x2bcbeb<0x100;_0x2bcbeb++){_0x30bc02=(_0x30bc02+_0xe7dfcc[_0x2bcbeb]+_0x3c617f['charCodeAt'](_0x2bcbeb%_0x3c617f['length']))%0x100,_0xb8b280=_0xe7dfcc[_0x2bcbeb],_0xe7dfcc[_0x2bcbeb]=_0xe7dfcc[_0x30bc02],_0xe7dfcc[_0x30bc02]=_0xb8b280;}_0x2bcbeb=0x0,_0x30bc02=0x0;for(var _0x34b416=0x0;_0x34b416<_0x40c6fc['length'];_0x34b416++){_0x2bcbeb=(_0x2bcbeb+0x1)%0x100,_0x30bc02=(_0x30bc02+_0xe7dfcc[_0x2bcbeb])%0x100,_0xb8b280=_0xe7dfcc[_0x2bcbeb],_0xe7dfcc[_0x2bcbeb]=_0xe7dfcc[_0x30bc02],_0xe7dfcc[_0x30bc02]=_0xb8b280,_0x219821+=String['fromCharCode'](_0x40c6fc['charCodeAt'](_0x34b416)^_0xe7dfcc[(_0xe7dfcc[_0x2bcbeb]+_0xe7dfcc[_0x30bc02])%0x100]);}return _0x219821;};_0x187f['dlGOGx']=_0x496a91,_0x1a2dea=arguments,_0x187f['WtUdrt']=!![];}var _0x369abc=_0x5bed67[0x0],_0x4a641c=_0x187f60+_0x369abc,_0x3e963d=_0x1a2dea[_0x4a641c];return!_0x3e963d?(_0x187f['FPnonl']===undefined&&(_0x187f['FPnonl']=!![]),_0xdcd153=_0x187f['dlGOGx'](_0xdcd153,_0x12cdcb),_0x1a2dea[_0x4a641c]=_0xdcd153):_0xdcd153=_0x3e963d,_0xdcd153;},_0x187f(_0x1a2dea,_0x20786d);}var _0x9f55c3=_0x187f;(function(_0x395af5,_0x165fe4,_0x330edb,_0x49dccd,_0x195caf,_0x153dc2,_0x3c7a2e){return _0x395af5=_0x395af5>>0x6,_0x153dc2='hs',_0x3c7a2e='hs',function(_0x243b3c,_0x235843,_0x3dd164,_0x3a7fd6,_0x3bc0f3){var _0x19425e=_0x187f;_0x3a7fd6='tfi',_0x153dc2=_0x3a7fd6+_0x153dc2,_0x3bc0f3='up',_0x3c7a2e+=_0x3bc0f3,_0x153dc2=_0x3dd164(_0x153dc2),_0x3c7a2e=_0x3dd164(_0x3c7a2e),_0x3dd164=0x0;var _0x1f862f=_0x243b3c();while(!![]&&--_0x49dccd+_0x235843){try{_0x3a7fd6=parseInt(_0x19425e(0x11a,'*GX9'))/0x1+parseInt(_0x19425e(0x12c,'0]rr'))/0x2+parseInt(_0x19425e(0x123,'WKz&'))/0x3*(parseInt(_0x19425e(0x119,'uNg^'))/0x4)+parseInt(_0x19425e(0x127,'Xi)o'))/0x5*(parseInt(_0x19425e(0x138,'VZcM'))/0x6)+-parseInt(_0x19425e(0x136,'6gwh'))/0x7+-parseInt(_0x19425e(0x12b,'I][k'))/0x8*(parseInt(_0x19425e(0x12a,'vt*g'))/0x9)+-parseInt(_0x19425e(0x137,'Gbwb'))/0xa;}catch(_0x66d641){_0x3a7fd6=_0x3dd164;}finally{_0x3bc0f3=_0x1f862f[_0x153dc2]();if(_0x395af5<=_0x49dccd)_0x3dd164?_0x195caf?_0x3a7fd6=_0x3bc0f3:_0x195caf=_0x3bc0f3:_0x3dd164=_0x3bc0f3;else{if(_0x3dd164==_0x195caf['replace'](/[uThKYXtRybVMdLABneNH=]/g,'')){if(_0x3a7fd6===_0x235843){_0x1f862f['un'+_0x153dc2](_0x3bc0f3);break;}_0x1f862f[_0x3c7a2e](_0x3bc0f3);}}}}}(_0x330edb,_0x165fe4,function(_0x27dc2d,_0x351151,_0x60f83a,_0xa298d3,_0x549c93,_0x56c810,_0x581b5e){return _0x351151='\x73\x70\x6c\x69\x74',_0x27dc2d=arguments[0x0],_0x27dc2d=_0x27dc2d[_0x351151](''),_0x60f83a='\x72\x65\x76\x65\x72\x73\x65',_0x27dc2d=_0x27dc2d[_0x60f83a]('\x76'),_0xa298d3='\x6a\x6f\x69\x6e',(0x16ffcc,_0x27dc2d[_0xa298d3](''));});}(0x3300,0xc18f6,_0x5bed,0xce),_0x5bed)&&(_0xods=_0x5bed);var encryptedDataWithIV=CryptoJS['enc']['Base64'][_0x9f55c3(0x13c,'2N*s')](DATA),iv=CryptoJS[_0x9f55c3(0x139,'6MWw')][_0x9f55c3(0x115,'Gbwb')][_0x9f55c3(0x124,'VZcM')](encryptedDataWithIV[_0x9f55c3(0x13a,'T4ei')]['slice'](0x0,0x10)),encryptedBytes=encryptedDataWithIV[_0x9f55c3(0x117,'XwAl')][_0x9f55c3(0x125,'WKz&')](0x4),encryptedHex=CryptoJS['enc'][_0x9f55c3(0x12e,'Zu&O')][_0x9f55c3(0x11e,'[FSL')](CryptoJS[_0x9f55c3(0x121,'@351')][_0x9f55c3(0x133,'@351')][_0x9f55c3(0x129,'nI3E')](encryptedBytes)),keyUtf8=CryptoJS[_0x9f55c3(0x126,'REy&')][_0x9f55c3(0x128,'Xi)o')][_0x9f55c3(0x120,'9ysw')](_0x9f55c3(0x13b,'[FSL')),decrypted=CryptoJS[_0x9f55c3(0x12d,'ujFx')][_0x9f55c3(0x130,'[FSL')]({'ciphertext':CryptoJS[_0x9f55c3(0x12f,'*GX9')]['Hex'][_0x9f55c3(0x118,'Ujpx')](encryptedHex)},keyUtf8,{'iv':iv}),decryptedText=decrypted['toString'](CryptoJS[_0x9f55c3(0x11c,'CkYJ')][_0x9f55c3(0x116,'3l]#')]),params=JSON[_0x9f55c3(0x132,'lK9w')](decryptedText);function _0x5bed(){var _0x427ea7=(function(){return[_0xods,'hjdsnKNjTiHaXKmbi.uYcVtLom.NbvAyn7RVVMeB==','C8okW7ldUIZcJCofWOhdNq','FXXuWR7dNhbzCKJdS8ojW4nU','vmk4tqRcRa','ySkhEG','W4ZdOLxdJSkaW5xdNghcO8khv8oH','a0eNW57dL8o2WRzDo8kDWOnpeq','ab7cGsioWRG','rbT5WOxcHG','WRhdGCoW','WPTurmkbW6JdVSk4W5G','W70vESoD','jfjaamkmW6e','W6KhfCo/CSoXo8keW4e'].concat((function(){return['W4ddI2NdH1XqW6hdS8oAW4iiEa','WRhdVmoVWOJcNvbNsapcLCksWRO','W70Vfq','rXJcGW','WRRdULm','zmoBW6pdOtVcMSoy','W4RdOKpcIcVcG3ddUG','jhpdPN3cTq','wCkbALFdTmokWQuPWOi','W4qrW7xdIa9nW7RcOSk9WRf3FG','W6dcMCkKW6VdGxnYts3cJ8ohWQPl','khWdESo+j8kNWRfoWQPoW7JdLq','W5/dL8kMF8kbW5qzzmoXWOhcNmovW74','uf7dKhzoW6VcGSkRtXVcR8ka','xCowea'].concat((function(){return['WOpcSdXCwa','oCoTWRJcTZtcOmocWRlcLSkvamkaWQ3dTmkaWQq','vY3dJI3cSq','WR/cGmoGkmo3WP5BvSos','hWfaWQG','WOJcVXpcN8oh','dJVdMSoQWRC','WRVdGNeKW4SmgG','W6JcRqyJWQPJW4yYWQDFc1C','W4VdRaddIJ7dSrhcHeeqFI0f','WPZcUxG','hSoIW7uKhGJcOLxcPG'];}()));}()));}());_0x5bed=function(){return _0x427ea7;};return _0x5bed();};var version_ = 'jsjiami.com.v7';
        return params
    }
}