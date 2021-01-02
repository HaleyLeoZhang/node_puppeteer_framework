import BaseTask from "../../libs/Base/BaseTask";
import GuFengService from "../../services/Comic/GuFengService";
import ContextTool from "../../tools/ContextTool";
import TaskLogic from "../../logics/ComicCurl/TaskLogic";

export default class ComicTaskTest extends BaseTask {
    // ----------------------------------------------------------------------
    // 调用示例
    // node ./es5/task.js comic_test eval_script  # 拉取基本信息
    // node ./es5/task.js comic_test supplier_image
    // ----------------------------------------------------------------------
    static async eval_script() {
        let ctx = ContextTool.initial() // 每次拉取都是一个新的上下文
        let url = "https://www.gufengmh8.com/manhua/bailianchengshen/1447913.html"
        let list = await GuFengService.get_image_list(ctx, url)
        console.log(list)
    }

    static async supplier_image() {
        let ctx = ContextTool.initial() // 每次拉取都是一个新的上下文
        let url = "https://www.gufengmh8.com/manhua/bailianchengshen/1447913.html"
        let payload = {
            "id": 14,
            "url": url,
        }
        await TaskLogic.supplier_image(ctx, payload)
    }
}