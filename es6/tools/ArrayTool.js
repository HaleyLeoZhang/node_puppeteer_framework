// -----------------------------------------------
//     数组操作类
// -----------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// -----------------------------------------------

export default class ArrayTool {
    static column(arr, key) {
        let _return = []
        for(let i in arr) {
            _return.push(arr[i][key])
        }
        return _return
    }
}