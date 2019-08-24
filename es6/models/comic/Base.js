import { DSN_COMIC } from '../../conf/db/mysql'
import BaseModel from '../BaseModel'


class Base extends BaseModel {
    static get_pool(){
        return this.set_pool(DSN_COMIC)
    }
}

export default Base;