const db = require("../db");

const Course = db.model("Course", {
    title: {type: String, require:true},
    courseID: {type: String, require:true},
    instructor: {type: String, require:true},
    startDate: {type: Date, default:Date.now},
    endDate: {type: Date, default:Date.now},
    description: String
});

module.exports = Course;