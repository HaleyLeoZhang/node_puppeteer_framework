import Page from '../models/comic/Page'
import Image from '../models/comic/Image'

import Log from '../tools/Log'
import General from '../tools/General'
import OnePiece from './Curl/OnePiece'
import JieMoRen from './Curl/JieMoRen'

const CHANNEL_TENCENT = 1; // 腾讯漫画
const CHANNEL_MHN = 2; // 漫画牛 https://m.manhuaniu.com

class Comic {
    static get_images_pages_OnePiece() {
        OnePiece.get_images_pages()
            .then((info) => {
                console.log('获取成功---条数：' + info.hrefs.length);
                let data = []
                let date = General.format_time('Y-m-d h:i:s')
                for(let i = 0, len = info.hrefs.length; i < len; i++) {
                    data.push({
                        'channel': CHANNEL_TENCENT,
                        'comic_id': info.comic_id,
                        'name': info.hrefs[i],
                        'link': info.titles[i],
                        'created_at': date,
                        'updated_at': date,
                    })
                }
                Promise.all([
                    Page.insert(data)
                ]).then(first_insert_id => {
                    Log.log('first_insert_id------' + first_insert_id)
                }).catch((error) => {
                    Log.error(error)
                });
            })
            .catch(exception => {
                Log.log('出现异常：Exception ')
                Log.log(exception)
            });;
    }
    static get_images_OnePiece() {
        OnePiece.get_images('https://ac.qq.com/ComicView/index/id/505430/cid/877')
            .then((imgs) => {
                // Log.log(imgs)
            })
    }

    static get_images_pages_JieMoRen() {
        JieMoRen.get_images_pages()
            .then((info) => {
                console.log('获取成功---条数：' + info.hrefs.length);
                let data = []
                let date = General.format_time('Y-m-d h:i:s')
                for(let i = 0, len = info.hrefs.length; i < len; i++) {
                    data.push({
                        'channel': CHANNEL_MHN,
                        'comic_id': info.comic_id,
                        'name': info.hrefs[i],
                        'link': info.titles[i],
                        'created_at': date,
                        'updated_at': date,
                    })
                }
                Promise.all([
                    Page.insert(data)
                ]).then(first_insert_id => {
                    Log.log('first_insert_id------' + first_insert_id)
                }).catch((error) => {
                    Log.error(error)
                });
            })
            .catch(exception => {
                Log.log('出现异常：Exception ')
                Log.log(exception)
            });;
    }
    static get_images_JieMoRen() {
        const href = 'https://m.manhuaniu.com/manhua/5830/385798.html'
        const page_id = 1
        JieMoRen.get_images(href)
            .then((imgs) => {
                Log.log(imgs);
                Log.log('获取成功-- - 条数： ' + imgs.length);
                let data = []
                let date = General.format_time('Y-m-d h:i:s')
                for(let i = 0, len = imgs.length; i < len; i++) {
                    data.push({
                        'page_id': page_id,
                        'sequence': imgs[i].sequence,
                        'src': imgs[i].src,
                        'created_at': date,
                        'updated_at': date,
                    })
                }
                Log.log(data);
                Promise.all([
                    Image.insert(data)
                ]).then(first_insert_id => {
                    Log.log('first_insert_id------' + first_insert_id)
                }).catch((error) => {
                    Log.error(error)
                });
            })
    }
}

Comic.get_images_JieMoRen()