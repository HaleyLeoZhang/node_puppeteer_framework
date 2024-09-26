import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "https://www.manhua3.com" // 爬取地址  https://www.manhua3.com/woweixiedi


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
                        console.log(link)
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
        console.log(result)
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
                // 原始数据在这里
                let srcpt_tpls = html.match(/var DATA='(.*?)';/)
                // console.log('srcpt_tpls', srcpt_tpls)
                let js_code = srcpt_tpls[0]
                // 见 params.images 参数结果  https://manhuami.cc/template/pc/manhuawang/js/pic2.js
                // 解密所需库
                var decode_code_tool = `
                var CryptoJS=CryptoJS||(function(Math,undefined){var crypto;if(typeof window!=='undefined'&&window.crypto){crypto=window.crypto}if(typeof self!=='undefined'&&self.crypto){crypto=self.crypto}if(typeof globalThis!=='undefined'&&globalThis.crypto){crypto=globalThis.crypto}if(!crypto&&typeof window!=='undefined'&&window.msCrypto){crypto=window.msCrypto}if(!crypto&&typeof global!=='undefined'&&global.crypto){crypto=global.crypto}if(!crypto&&typeof require==='function'){try{crypto=require('crypto')}catch(err){}}var cryptoSecureRandomInt=function(){if(crypto){if(typeof crypto.getRandomValues==='function'){try{return crypto.getRandomValues(new Uint32Array(1))[0]}catch(err){}}if(typeof crypto.randomBytes==='function'){try{return crypto.randomBytes(4).readInt32LE()}catch(err){}}}throw new Error('Native crypto module could not be used to get secure random number.');};var create=Object.create||(function(){function F(){}return function(obj){var subtype;F.prototype=obj;subtype=new F();F.prototype=null;return subtype}}());var C={};var C_lib=C.lib={};var Base=C_lib.Base=(function(){return{extend:function(overrides){var subtype=create(this);if(overrides){subtype.mixIn(overrides)}if(!subtype.hasOwnProperty('init')||this.init===subtype.init){subtype.init=function(){subtype.$super.init.apply(this,arguments)}}subtype.init.prototype=subtype;subtype.$super=this;return subtype},create:function(){var instance=this.extend();instance.init.apply(instance,arguments);return instance},init:function(){},mixIn:function(properties){for(var propertyName in properties){if(properties.hasOwnProperty(propertyName)){this[propertyName]=properties[propertyName]}}if(properties.hasOwnProperty('toString')){this.toString=properties.toString}},clone:function(){return this.init.prototype.extend(this)}}}());var WordArray=C_lib.WordArray=Base.extend({init:function(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined){this.sigBytes=sigBytes}else{this.sigBytes=words.length*4}},toString:function(encoder){return(encoder||Hex).stringify(this)},concat:function(wordArray){var thisWords=this.words;var thatWords=wordArray.words;var thisSigBytes=this.sigBytes;var thatSigBytes=wordArray.sigBytes;this.clamp();if(thisSigBytes%4){for(var i=0;i<thatSigBytes;i++){var thatByte=(thatWords[i>>>2]>>>(24-(i%4)*8))&0xff;thisWords[(thisSigBytes+i)>>>2]|=thatByte<<(24-((thisSigBytes+i)%4)*8)}}else{for(var j=0;j<thatSigBytes;j+=4){thisWords[(thisSigBytes+j)>>>2]=thatWords[j>>>2]}}this.sigBytes+=thatSigBytes;return this},clamp:function(){var words=this.words;var sigBytes=this.sigBytes;words[sigBytes>>>2]&=0xffffffff<<(32-(sigBytes%4)*8);words.length=Math.ceil(sigBytes/4)},clone:function(){var clone=Base.clone.call(this);clone.words=this.words.slice(0);return clone},random:function(nBytes){var words=[];for(var i=0;i<nBytes;i+=4){words.push(cryptoSecureRandomInt())}return new WordArray.init(words,nBytes)}});var C_enc=C.enc={};var Hex=C_enc.Hex={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var hexChars=[];for(var i=0;i<sigBytes;i++){var bite=(words[i>>>2]>>>(24-(i%4)*8))&0xff;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&0x0f).toString(16))}return hexChars.join('')},parse:function(hexStr){var hexStrLength=hexStr.length;var words=[];for(var i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<(24-(i%8)*4)}return new WordArray.init(words,hexStrLength/2)}};var Latin1=C_enc.Latin1={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var latin1Chars=[];for(var i=0;i<sigBytes;i++){var bite=(words[i>>>2]>>>(24-(i%4)*8))&0xff;latin1Chars.push(String.fromCharCode(bite))}return latin1Chars.join('')},parse:function(latin1Str){var latin1StrLength=latin1Str.length;var words=[];for(var i=0;i<latin1StrLength;i++){words[i>>>2]|=(latin1Str.charCodeAt(i)&0xff)<<(24-(i%4)*8)}return new WordArray.init(words,latin1StrLength)}};var Utf8=C_enc.Utf8={stringify:function(wordArray){try{return decodeURIComponent(escape(Latin1.stringify(wordArray)))}catch(e){throw new Error('Malformed UTF-8 data');}},parse:function(utf8Str){return Latin1.parse(unescape(encodeURIComponent(utf8Str)))}};var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm=Base.extend({reset:function(){this._data=new WordArray.init();this._nDataBytes=0},_append:function(data){if(typeof data=='string'){data=Utf8.parse(data)}this._data.concat(data);this._nDataBytes+=data.sigBytes},_process:function(doFlush){var processedWords;var data=this._data;var dataWords=data.words;var dataSigBytes=data.sigBytes;var blockSize=this.blockSize;var blockSizeBytes=blockSize*4;var nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){nBlocksReady=Math.ceil(nBlocksReady)}else{nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0)}var nWordsReady=nBlocksReady*blockSize;var nBytesReady=Math.min(nWordsReady*4,dataSigBytes);if(nWordsReady){for(var offset=0;offset<nWordsReady;offset+=blockSize){this._doProcessBlock(dataWords,offset)}processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady}return new WordArray.init(processedWords,nBytesReady)},clone:function(){var clone=Base.clone.call(this);clone._data=this._data.clone();return clone},_minBufferSize:0});var Hasher=C_lib.Hasher=BufferedBlockAlgorithm.extend({cfg:Base.extend(),init:function(cfg){this.cfg=this.cfg.extend(cfg);this.reset()},reset:function(){BufferedBlockAlgorithm.reset.call(this);this._doReset()},update:function(messageUpdate){this._append(messageUpdate);this._process();return this},finalize:function(messageUpdate){if(messageUpdate){this._append(messageUpdate)}var hash=this._doFinalize();return hash},blockSize:512/32,_createHelper:function(hasher){return function(message,cfg){return new hasher.init(cfg).finalize(message)}},_createHmacHelper:function(hasher){return function(message,key){return new C_algo.HMAC.init(hasher,key).finalize(message)}}});var C_algo=C.algo={};return C}(Math));
                `

                // 解码用
                let decode_code = `
var _0xods='jsjiami.com.v7';function _0x187f(_0x1a2dea,_0x20786d){var _0x5bed67=_0x5bed();return _0x187f=function(_0x187f60,_0x12cdcb){_0x187f60=_0x187f60-0x115;var _0xdcd153=_0x5bed67[_0x187f60];if(_0x187f['WtUdrt']===undefined){var _0x49ca55=function(_0x47a04e){var _0x33e7a1='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x5e94ad='',_0x3b12e1='';for(var _0x17aa3c=0x0,_0x20b494,_0x22db3b,_0x28888b=0x0;_0x22db3b=_0x47a04e['charAt'](_0x28888b++);~_0x22db3b&&(_0x20b494=_0x17aa3c%0x4?_0x20b494*0x40+_0x22db3b:_0x22db3b,_0x17aa3c++%0x4)?_0x5e94ad+=String['fromCharCode'](0xff&_0x20b494>>(-0x2*_0x17aa3c&0x6)):0x0){_0x22db3b=_0x33e7a1['indexOf'](_0x22db3b);}for(var _0x5aab44=0x0,_0x4df1c1=_0x5e94ad['length'];_0x5aab44<_0x4df1c1;_0x5aab44++){_0x3b12e1+='%'+('00'+_0x5e94ad['charCodeAt'](_0x5aab44)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3b12e1);};var _0x496a91=function(_0x40c6fc,_0x3c617f){var _0xe7dfcc=[],_0x30bc02=0x0,_0xb8b280,_0x219821='';_0x40c6fc=_0x49ca55(_0x40c6fc);var _0x2bcbeb;for(_0x2bcbeb=0x0;_0x2bcbeb<0x100;_0x2bcbeb++){_0xe7dfcc[_0x2bcbeb]=_0x2bcbeb;}for(_0x2bcbeb=0x0;_0x2bcbeb<0x100;_0x2bcbeb++){_0x30bc02=(_0x30bc02+_0xe7dfcc[_0x2bcbeb]+_0x3c617f['charCodeAt'](_0x2bcbeb%_0x3c617f['length']))%0x100,_0xb8b280=_0xe7dfcc[_0x2bcbeb],_0xe7dfcc[_0x2bcbeb]=_0xe7dfcc[_0x30bc02],_0xe7dfcc[_0x30bc02]=_0xb8b280;}_0x2bcbeb=0x0,_0x30bc02=0x0;for(var _0x34b416=0x0;_0x34b416<_0x40c6fc['length'];_0x34b416++){_0x2bcbeb=(_0x2bcbeb+0x1)%0x100,_0x30bc02=(_0x30bc02+_0xe7dfcc[_0x2bcbeb])%0x100,_0xb8b280=_0xe7dfcc[_0x2bcbeb],_0xe7dfcc[_0x2bcbeb]=_0xe7dfcc[_0x30bc02],_0xe7dfcc[_0x30bc02]=_0xb8b280,_0x219821+=String['fromCharCode'](_0x40c6fc['charCodeAt'](_0x34b416)^_0xe7dfcc[(_0xe7dfcc[_0x2bcbeb]+_0xe7dfcc[_0x30bc02])%0x100]);}return _0x219821;};_0x187f['dlGOGx']=_0x496a91,_0x1a2dea=arguments,_0x187f['WtUdrt']=!![];}var _0x369abc=_0x5bed67[0x0],_0x4a641c=_0x187f60+_0x369abc,_0x3e963d=_0x1a2dea[_0x4a641c];return!_0x3e963d?(_0x187f['FPnonl']===undefined&&(_0x187f['FPnonl']=!![]),_0xdcd153=_0x187f['dlGOGx'](_0xdcd153,_0x12cdcb),_0x1a2dea[_0x4a641c]=_0xdcd153):_0xdcd153=_0x3e963d,_0xdcd153;},_0x187f(_0x1a2dea,_0x20786d);}var _0x9f55c3=_0x187f;(function(_0x395af5,_0x165fe4,_0x330edb,_0x49dccd,_0x195caf,_0x153dc2,_0x3c7a2e){return _0x395af5=_0x395af5>>0x6,_0x153dc2='hs',_0x3c7a2e='hs',function(_0x243b3c,_0x235843,_0x3dd164,_0x3a7fd6,_0x3bc0f3){var _0x19425e=_0x187f;_0x3a7fd6='tfi',_0x153dc2=_0x3a7fd6+_0x153dc2,_0x3bc0f3='up',_0x3c7a2e+=_0x3bc0f3,_0x153dc2=_0x3dd164(_0x153dc2),_0x3c7a2e=_0x3dd164(_0x3c7a2e),_0x3dd164=0x0;var _0x1f862f=_0x243b3c();while(!![]&&--_0x49dccd+_0x235843){try{_0x3a7fd6=parseInt(_0x19425e(0x11a,'*GX9'))/0x1+parseInt(_0x19425e(0x12c,'0]rr'))/0x2+parseInt(_0x19425e(0x123,'WKz&'))/0x3*(parseInt(_0x19425e(0x119,'uNg^'))/0x4)+parseInt(_0x19425e(0x127,'Xi)o'))/0x5*(parseInt(_0x19425e(0x138,'VZcM'))/0x6)+-parseInt(_0x19425e(0x136,'6gwh'))/0x7+-parseInt(_0x19425e(0x12b,'I][k'))/0x8*(parseInt(_0x19425e(0x12a,'vt*g'))/0x9)+-parseInt(_0x19425e(0x137,'Gbwb'))/0xa;}catch(_0x66d641){_0x3a7fd6=_0x3dd164;}finally{_0x3bc0f3=_0x1f862f[_0x153dc2]();if(_0x395af5<=_0x49dccd)_0x3dd164?_0x195caf?_0x3a7fd6=_0x3bc0f3:_0x195caf=_0x3bc0f3:_0x3dd164=_0x3bc0f3;else{if(_0x3dd164==_0x195caf['replace'](/[uThKYXtRybVMdLABneNH=]/g,'')){if(_0x3a7fd6===_0x235843){_0x1f862f['un'+_0x153dc2](_0x3bc0f3);break;}_0x1f862f[_0x3c7a2e](_0x3bc0f3);}}}}}(_0x330edb,_0x165fe4,function(_0x27dc2d,_0x351151,_0x60f83a,_0xa298d3,_0x549c93,_0x56c810,_0x581b5e){return _0x351151='\x73\x70\x6c\x69\x74',_0x27dc2d=arguments[0x0],_0x27dc2d=_0x27dc2d[_0x351151](''),_0x60f83a='\x72\x65\x76\x65\x72\x73\x65',_0x27dc2d=_0x27dc2d[_0x60f83a]('\x76'),_0xa298d3='\x6a\x6f\x69\x6e',(0x16ffcc,_0x27dc2d[_0xa298d3](''));});}(0x3300,0xc18f6,_0x5bed,0xce),_0x5bed)&&(_0xods=_0x5bed);var encryptedDataWithIV=CryptoJS['enc']['Base64'][_0x9f55c3(0x13c,'2N*s')](DATA),iv=CryptoJS[_0x9f55c3(0x139,'6MWw')][_0x9f55c3(0x115,'Gbwb')][_0x9f55c3(0x124,'VZcM')](encryptedDataWithIV[_0x9f55c3(0x13a,'T4ei')]['slice'](0x0,0x10)),encryptedBytes=encryptedDataWithIV[_0x9f55c3(0x117,'XwAl')][_0x9f55c3(0x125,'WKz&')](0x4),encryptedHex=CryptoJS['enc'][_0x9f55c3(0x12e,'Zu&O')][_0x9f55c3(0x11e,'[FSL')](CryptoJS[_0x9f55c3(0x121,'@351')][_0x9f55c3(0x133,'@351')][_0x9f55c3(0x129,'nI3E')](encryptedBytes)),keyUtf8=CryptoJS[_0x9f55c3(0x126,'REy&')][_0x9f55c3(0x128,'Xi)o')][_0x9f55c3(0x120,'9ysw')](_0x9f55c3(0x13b,'[FSL')),decrypted=CryptoJS[_0x9f55c3(0x12d,'ujFx')][_0x9f55c3(0x130,'[FSL')]({'ciphertext':CryptoJS[_0x9f55c3(0x12f,'*GX9')]['Hex'][_0x9f55c3(0x118,'Ujpx')](encryptedHex)},keyUtf8,{'iv':iv}),decryptedText=decrypted['toString'](CryptoJS[_0x9f55c3(0x11c,'CkYJ')][_0x9f55c3(0x116,'3l]#')]),params=JSON[_0x9f55c3(0x132,'lK9w')](decryptedText);function _0x5bed(){var _0x427ea7=(function(){return[_0xods,'hjdsnKNjTiHaXKmbi.uYcVtLom.NbvAyn7RVVMeB==','C8okW7ldUIZcJCofWOhdNq','FXXuWR7dNhbzCKJdS8ojW4nU','vmk4tqRcRa','ySkhEG','W4ZdOLxdJSkaW5xdNghcO8khv8oH','a0eNW57dL8o2WRzDo8kDWOnpeq','ab7cGsioWRG','rbT5WOxcHG','WRhdGCoW','WPTurmkbW6JdVSk4W5G','W70vESoD','jfjaamkmW6e','W6KhfCo/CSoXo8keW4e'].concat((function(){return['W4ddI2NdH1XqW6hdS8oAW4iiEa','WRhdVmoVWOJcNvbNsapcLCksWRO','W70Vfq','rXJcGW','WRRdULm','zmoBW6pdOtVcMSoy','W4RdOKpcIcVcG3ddUG','jhpdPN3cTq','wCkbALFdTmokWQuPWOi','W4qrW7xdIa9nW7RcOSk9WRf3FG','W6dcMCkKW6VdGxnYts3cJ8ohWQPl','khWdESo+j8kNWRfoWQPoW7JdLq','W5/dL8kMF8kbW5qzzmoXWOhcNmovW74','uf7dKhzoW6VcGSkRtXVcR8ka','xCowea'].concat((function(){return['WOpcSdXCwa','oCoTWRJcTZtcOmocWRlcLSkvamkaWQ3dTmkaWQq','vY3dJI3cSq','WR/cGmoGkmo3WP5BvSos','hWfaWQG','WOJcVXpcN8oh','dJVdMSoQWRC','WRVdGNeKW4SmgG','W6JcRqyJWQPJW4yYWQDFc1C','W4VdRaddIJ7dSrhcHeeqFI0f','WPZcUxG','hSoIW7uKhGJcOLxcPG'];}()));}()));}());_0x5bed=function(){return _0x427ea7;};return _0x5bed();};var version_ = 'jsjiami.com.v7';
                `
                // console.log('decode_code_tool')
                // console.log(decode_code_tool)
                let js_real_code = `
                    ;${decode_code_tool}
                    ;${js_code} 
                    ;${decode_code}
                    ;module.exports = version_
                `
                // 当成模块动态编译js字符串
                let tmp_run_module_name = 'tmp-runtime-module';
                const tmp_module = new Module(tmp_run_module_name)
                tmp_module._compile(js_real_code, tmp_run_module_name)
                let image_list = tmp_module.exports
                console.log('version_')
                console.log('image_list')
                console.log(image_list)
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}