import Page from '../models/comic/Page'

import Log from '../tools/Log'

// simple query
let arr = [
    {
    'comic_id' : 1,
    'name' : '测试',
    'link' : 'https://wx3.sinaimg.cn/orj360/0067jijzly1g5rh2y56v5j30ci0m8jsc.jpg',
    'created_at' : '2019-8-23 18:36:06',
    'updated_at' : '2019-8-23 18:36:13',
    },
    {
    'comic_id' : 1,
    'name' : '测试',
    'link' : 'https://wx3.sinaimg.cn/orj360/0067jijzly1g5rh2y56v5j30ci0m8jsc.jpg',
    'created_at' : '2019-8-23 18:36:06',
    'updated_at' : '2019-8-23 18:36:13',
    },
]

let obj = Page.insert(arr)

// Promise.all([
//     Page.getList()
// ]).then(function (list) {
//         Log.log('list------')
//         Log.log(list)
// }).catch((reason)=>{
//     console.error(reason)
// });

        
