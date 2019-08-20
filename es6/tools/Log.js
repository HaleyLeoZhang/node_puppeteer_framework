// -----------------------------------------------
// 日志类
// -----------------------------------------------

import {LOG}  from '../conf'
import Bugjs from 'node-bugjs' // Doc:  https://www.npmjs.com/package/node-bugjs

const Log = Bugjs(LOG)

export default Log