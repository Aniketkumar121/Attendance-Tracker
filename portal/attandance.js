const express = require('express');
const app = express();
const Users = require("../model/users");
const Teacher = require('../model/teacher');
const Course = require('../model/course');
const Student = require('../model/student');
const Attendance = require('../model/Attandance');
const course = require('../model/course');
const mongoose = require('mongoose');

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Please Login to continue !");
        res.redirect('/login');
    }
}

app.get('/ProfCourses', checkAuth, async (req, res) => {
    const profData = await Teacher.findOne({ email: req.user.email });
    let ProfCoursesIds = profData.courses;
    let allCourses = [];
    for (let i = ProfCoursesIds.length - 1; i >= 0; i--) {
        data = await getCourse(ProfCoursesIds[i]);
        allCourses.push(data);
    }
    res.send(allCourses);
})

function getCourse(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const course = await Course.findById(id, { name: 1 });
            resolve(course);
        } catch (error) {
            reject(error);
        }
    });
}

app.get('/StudentCourses', checkAuth, async (req, res) => {
    const studentData = await Student.findOne({ email: req.user.email });
    console.log(studentData);
    let StudentCoursesIds = studentData.courses;
    let Courses = [];
    for (let i = StudentCoursesIds.length - 1; i >= 0; i--) {
        data = await getCourse(StudentCoursesIds[i]);
        attandanceData = await getAttandance(studentData._id, StudentCoursesIds[i]);
        Courses.push({
            "course": data,
            "attandance": attandanceData,
        })
    }
    res.send(Courses);
})


const getAttandance = async (studentId, courseId) => {
    return new Promise(async (resolve, reject) => {
        const attendance = await Attendance.aggregate([
            {
                $match: {
                    course_id: mongoose.Types.ObjectId(courseId),
                    'attendance.student_id': mongoose.Types.ObjectId(studentId)
                }
            },
            {
                $unwind: '$attendance'
            },
            {
                $match: {
                    'attendance.student_id': mongoose.Types.ObjectId(studentId)
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$date',
                    isPresent: '$attendance.isPresent'
                }
            }
        ]);

        console.log(attendance);
        resolve(attendance);
    })
};



app.get('/course', (req, res) => {
    res.render('course', { course_id: req.query.subject });
})



module.exports = app;