import Temp_CollegeExam from '../models/temp/CollegeExam'

// Temp_CollegeExam.findAll({
//     attributes: ['*'],
//     where: {
//         status: 0
//     }
// }).then(exams => {
//     console.log("All exams:", JSON.stringify(exams, null, 4));
// });

Temp_CollegeExam.findOne({ 

    where: {
        status: 0
    }

 }).then(exam => {
    console.log("One exam:", JSON.stringify(exam, null))
  // project will be the first entry of the Projects table with the title 'aProject' || null
})