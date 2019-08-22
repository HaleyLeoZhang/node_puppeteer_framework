import Base, { sequelize, Sequelize } from './base'

class Temp_CollegeExam extends Base {}
Temp_CollegeExam.init({}, {
    sequelize,

    timestamps: false,

    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,

    tableName: 'weibo_alk_college_exam',
    freezeTableName: true,
    // 参数
});


export default Temp_CollegeExam;