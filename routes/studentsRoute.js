const express = require('express')
const router = express.Router()
const dao = require("../extensions");
const validate = require("../validate");
const {shuffle} = require("lodash")

const ProgramRepository = require("../models/ProgramRepository");
const StudentRepository = require("../models/StudentRepository");
const StaffRepository = require("../models/StaffRepository");
const ModuleRepository = require("../models/ModuleRepository");
const FacultyRepository = require("../models/FacultyRepository");
const LectureRepository = require("../models/LecturesRepository");
const AssignmentRepository = require("../models/AssignmentRepository");
const QuizRepository = require("../models/QuizRepository");


const defaultIdSchema = require("../schemas/defaultIdSchema");
const programStudentSchema = require("../schemas/programStudentsSchema");
const studentAddSchema = require("../schemas/studentAddSchema");
const programAddModuleSchema = require("../schemas/programAddModuleSchema");
const moduleUpdateSchema = require("../schemas/moduleUpdateSchema");
const modulesAddStaffSchema = require("../schemas/moduleAddStaffSchema");
const submitAssignmentSchema = require("../schemas/submitAssignmentSchema");
const {authenticateStudentToken} = require("../jwtTokens");
const {authenticateStaffToken} = require("../jwtTokens");

const programsRepo = new ProgramRepository(dao)
const studentRepo = new StudentRepository(dao)
const assignmentRepo = new AssignmentRepository(dao)
const lectureRepo = new LectureRepository(dao)
const quizRepo = new QuizRepository(dao)


router.get('/', async (req, res) => {
    try {
        let students = await studentRepo.findAll()

        for (const student of students)
            delete student.password

        return res.status(200).json(students)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }

})

router.get('/profile/:id',  validate(defaultIdSchema), async (req, res) => {
    try {
        let {id} = req.params
        let student = await studentRepo.findById(id)

        if (!student)
            return res.status(404).json({type: "Not Found Error", message: `Student with id:${id} not found`})
        delete student.password
        return res.status(200).json(student)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }

})
router.patch('/profile/:id',  validate(defaultIdSchema), async (req, res) => {
    try {
        let {id} = req.params
        let data = req.body
        let student = await studentRepo.findById(id)

        if (!student)
            return res.status(404).json({type: "Not Found Error", message: `Student with id:${id} not found`})
        await studentRepo.updateOne(data, id)
        return res.status(200).json({message: `Student saved successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }

})

router.get('/modules', authenticateStudentToken, async (req, res) => {
    let {program, level} = req.user
    try {

        return res.status(200).json(await programsRepo.getModules(program.id, level))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }

})

router.get('/quiz', authenticateStudentToken, async (req, res) => {
    let {program, level, id} = req.user
    let quiz = []
    try {
        let modules = await programsRepo.getModules(program.id, level)
        for (const module of modules) {
            const moduleQuiz = await quizRepo.findUpcomingByModuleId(module.id)

            console.log(moduleQuiz)
            for (const item of moduleQuiz) {

                if (!await quizRepo.checkIfSubmitted(id, item.id)) {
                    item.submitted = false
                    quiz.push(item)
                }
            }
        }
        return res.status(200).json(quiz)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }

})

router.get('/lectures', authenticateStudentToken, async (req, res) => {
    let {program, level} = req.user
    try {
        let lectures = []
        let modules = await programsRepo.getModules(program.id, level)
        for (const module of modules) {
            let moduleLectures = await lectureRepo.findUpcomingByModuleId(module.moduleId)
            for (const lecture of moduleLectures) {
                lectures.push(lecture)
            }
        }
        lectures = lectures.sort(function (a, b) {
            return new Date(a.startDate) - new Date(b.startDate);
        });
        return res.status(200).json(lectures)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})
router.get('/assignments', authenticateStudentToken, async (req, res) => {
    let {id: studentId,program, level} = req.user
    try {
        let assignments = []
        let modules = await programsRepo.getModules(program.id, level)
        for (const module of modules) {

            let moduleAssignmentRepo = await assignmentRepo.findByModuleId(module.moduleId)
            for (const assignment of moduleAssignmentRepo) {
                let submission = await assignmentRepo.findByStudentSubmission(studentId, assignment.id)
                console.log(submission)
                assignment.submission = submission
                assignments.push(assignment)
            }
        }
        assignments = assignments.sort(function (a, b) {
            return new Date(a.startDate) - new Date(b.startDate);
        });
        return res.status(200).json(assignments)
    } catch (e) {
        return res.status(500).json({type: e.name, message: e.message})
    }
})
router.get('/assignments/:id', authenticateStudentToken, async (req, res) => {
    let {id} = req.params
    try {
        let assignment = await assignmentRepo.findById(id)
        if (!assignment)
            return res.status(404).json({type: "Not Found Error", message: `Assignment with id:${id} not found`})

        return res.status(200).json(assignment)
    } catch (e) {
        return res.status(500).json({type: e.name, message: e.message})
    }
})
router.post('/assignments/:id', authenticateStudentToken, validate(submitAssignmentSchema), async (req, res) => {
     let {id} = req.params
     let {id: studentId} = req.user
    let file;
    let uploadPath;
    try {

        //console.log(req)
        let assignment = await assignmentRepo.findById(id)
        if (!assignment) {
            return res.status(404).json({type: "Not Found Error", message: `Assignment with id:${id} not found`})
        }

        if (await assignmentRepo.checkIfSubmitted(studentId, id)) {
            return res.status(400).json({type: "Client Side Error", message: `Student already submitted the assignment`})
        }

        if (new Date(assignment.endDate) < new Date())
            return res.status(400).json({type: "Client Side Error", message: `This submission is overdue, no longer acceptable`})
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        file = req.files.file;
        let newName = new Date().getTime()+"." + file.name.split('.').pop()
        uploadPath = './public/uploads/assignments/student-submissions/'+ newName ;

        // Use the mv() method to place the file somewhere on your server
        await file.mv(uploadPath);
        await assignmentRepo.insertStudentSubmission(newName, studentId, id)
        return res.status(200).json({message: "Assignment Submitted successfully"})

    } catch (e) {
        return res.status(500).json({type: e.name, message: e.message})
    }
})

router.get('/quiz/:id', authenticateStudentToken, validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    let studentId = req.user.id
    try {
        let quiz = await quizRepo.findById(id)
        if (!quiz)
            return res.status(404).json({type: "Not Found Error", message: `Quiz with id:${id} not found`})
        if (await quizRepo.checkIfSubmitted(studentId, id))
            return res.status(404).json({type: "Client Side Error", message: `Student already submitted answers for this quiz`})

        let questions = shuffle(await quizRepo.findAllQuestions(id))
        for (const question of questions) {
            question.answers = shuffle(await quizRepo.findAllAnswers(question.id))
            //console.log(_.shuffle(array));
            for (const answer of question.answers) {
                delete answer.correct
            }
        }
        quiz.questions = questions
        res.status(200).json(quiz)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.post('/quiz/submit/:id', authenticateStudentToken, validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params;
    let studentId = req.user.id
    let data = req.body
    try {
        let quiz = await quizRepo.findById(id)
        if (!quiz)
            return res.status(404).json({type: "Not Found Error", message: `Quiz with id:${id} not found`})
        if (await quizRepo.checkIfSubmitted(studentId, id))
            return res.status(404).json({type: "Client Side Error", message: `Student already submitted answers for this quiz`})

        let submittedQuiz =await quizRepo.insertSubmittedOne(id, studentId, 0, true)

        let total_score = 0
        for (const submittedQuestions of data) {
            if (quiz.type === "MULTIPLE CHOICE") {
                if (typeof submittedQuestions?.values === "string") {
                    let answer = await quizRepo.findAnswerById(submittedQuestions?.values)

                    let score = 0
if (!answer){
                        return res.status(500).json({type: "Internal Server Error", message:"Ooops Answer not found"})
                    }
                    if (answer.correct === 1) {
                        score = 1
                    }
                    total_score += score

                     console.log("Single answer",answer)
                    await quizRepo.addSubmittedAnswer(submittedQuestions?.id, answer.answerText, score, 1, submittedQuiz.id)
                }
                else {
                    for (const answer of submittedQuestions?.values) {

                        let new_answer = await quizRepo.findAnswerById(answer)

                        let score = 0
if (!new_answer){
                        return res.status(500).json({type: "Internal Server Error", message:"Ooops Answer not found"})
                    }
                        if (new_answer.correct === 1) {
                            score = 1
                        }
                        total_score += score

                        console.log("Array answer",new_answer)
                        await quizRepo.addSubmittedAnswer(submittedQuestions?.id, new_answer.answerText, score, 1, submittedQuiz.id)
                    }
                }

            }
            else {
                if (typeof submittedQuestions?.values === "string") {
                    await quizRepo.addSubmittedAnswer(id, submittedQuestions?.values, 1, 0)
                }
                else {
                    for (const answer of submittedQuestions?.values) {

                        await quizRepo.addSubmittedAnswer(id, answer.answerText, 1, 0)
                    }
                }

            }


        }
        await  quizRepo.UpdateScore(submittedQuiz.id, total_score)
        return res.status(200).json({message: "Quiz Submitted successfully"})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.get('/quiz/submit/:id', authenticateStudentToken, validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params;
    let studentId = req.user.id

    try {
        let quiz = await quizRepo.findById(id)
        if (!quiz)
            return res.status(404).json({type: "Not Found Error", message: `Quiz with id:${id} not found`})
        let submitted = await quizRepo.checkIfSubmitted(studentId, id)
        if (!submitted)
            return res.status(404).json({type: "Client Side Error", message: `Student has not submitted answers for this quiz`})
        let totalScore = 0
        let questions = await quizRepo.findAllQuestions(quiz.id)

        for (const question of questions){
            question.submittedAnswers = await quizRepo.findSubmittedAnswersByQuestion(question.id, submitted.id)
            totalScore += question.possibleScore
        }
        quiz.questions = questions
        quiz.totalScore= totalScore
        quiz.actualScore= submitted.score

       return res.status(200).json(quiz)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})




module.exports = router