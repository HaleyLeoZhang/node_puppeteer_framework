const Sequelize = require('sequelize');


import DSN_TEMP from '../../conf/db/mysql'

// const sequelize = new Sequelize('database', null, null, DSN_TEMP)

const sequelize = new Sequelize('temp', 'root', '602466', {
  host: '127.0.0.1',
  dialect: 'mysql'
})


class Base extends Sequelize.Model {
    static get_instance() {
        return sequelize.sync();
    }
}
// User.init({
//   username: Sequelize.STRING,
//   birthday: Sequelize.DATE
// }, { sequelize, modelName: 'user' });

export default Base;

export {sequelize, Sequelize};