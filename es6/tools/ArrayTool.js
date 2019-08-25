// -----------------------------------------------
//     数组操作类
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