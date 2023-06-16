const express = require('express')
const router = express.Router()
const dao = require("../extensions");
const validate = require("../validate");

const ProgramRepository = require("../models/ProgramRepository");
const StudentRepository = require("../models/StudentRepository");
const StaffRepository = require("../models/StaffRepository");
const ModuleRepository = require("../models/ModuleRepository");
const FacultyRepository = require("../models/FacultyRepository");
const LectureRepository = require("../models/LecturesRepository");
const AssignmentRepository = require("../models/AssignmentRepository");
const QuizRepository = require("../models/QuizRepository");

const programUpdateSchema = require("../schemas/programUpdateSchema");
const defaultIdSchema = require("../schemas/defaultIdSchema");
const programStudentSchema = require("../schemas/programStudentsSchema");
const studentAddSchema = require("../schemas/studentAddSchema");
const programAddModuleSchema = require("../schemas/programAddModuleSchema");
const moduleUpdateSchema = require("../schemas/moduleUpdateSchema");
const modulesAddStaffSchema = require("../schemas/moduleAddStaffSchema");
const newQuizSchema = require("../schemas/newQuizSchema");
const assignmentSchema = require("../schemas/assignmentSchema");
const scoreSchema = require("../schemas/scoreSchema");
const {authenticateStaffToken} = require("../jwtTokens");

const programsRepo = new ProgramRepository(dao)
const studentRepo = new StudentRepository(dao)
const moduleRepo = new ModuleRepository(dao)
const assignmentRepo = new AssignmentRepository(dao)
const staffRepo = new StaffRepository(dao)
const lectureRepo = new LectureRepository(dao)
const quizRepo = new QuizRepository(dao)


router.get('/modules', authenticateStaffToken, async (req, res) => {
    let {id} = req.user

    try {
        return res.status(200).json(await staffRepo.getModules(id))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }

})

router.get('/modules/:id/quiz', validate(defaultIdSchema), authenticateStaffToken, async (req, res) => {
    let {id} = req.user
    let moduleId = req.params.id
    try {
         if (!await staffRepo.matchByModule(id, moduleId))
            return res.status(401).json({
                type: "Unauthorised",
                message: "You are not allowed to add quiz because you are not assigned to selected module"
            })

        return res.status(200).json( await quizRepo.findByModuleId(moduleId))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }

})

router.get('/lectures', authenticateStaffToken, async (req, res) => {
    let {id} = req.user
    try {
        let lectures = []
        let modules = await staffRepo.getModules(id)
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

router.get('/assignments/:id', authenticateStaffToken, async (req, res) => {
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

router.get('/assignments/submitted/:id', authenticateStaffToken, validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        let assignment = await assignmentRepo.findById(id)
        if (!assignment)
            return res.status(404).json({type: "Not Found Error", message: `Assignment with id:${id} not found`})
        let results = await assignmentRepo.getAllSubmitted(assignment.moduleId)
        for (const result of results){
            let sub = await  assignmentRepo.checkIfSubmitted(result.id, assignment.id)
            if (sub){
                result.score = sub.score
                result.filePath = sub.filePath
                result.sId = sub.sId
            }
        }

        res.status(200).json(results)
    } catch (e) {
        return res.status(500).json({type: e.name, message: e.message})
    }
})

router.get('/assignments/score/:id/:score', authenticateStaffToken, validate(scoreSchema), async (req, res) => {
    let {id, score} = req.params
    try {
        let assignment = await assignmentRepo.findSubmittedById(id)
        if (!assignment)
            return res.status(404).json({type: "Not Found Error", message: `Submitted Assignment with id:${id} not found`})

        if (score > assignment.possibleScore)
            return res.status(404).json({type: "Value Error", message: `Score must not be greater then ${assignment.possibleScore}`})

        await assignmentRepo.updateScore(id, score)

        res.status(200).json({message: "Score updated successfully"})
    } catch (e) {
        return res.status(500).json({type: e.name, message: e.message})
    }
})

router.get('/quiz', authenticateStaffToken, async (req, res) => {
    let {id} = req.user
    try {
        let upcomingQuiz = []
        let modules = await staffRepo.getModules(id)
        for (const {moduleId} of modules) {
            let quiz = await quizRepo.findUpcomingByModuleId(moduleId)
            for (const item of quiz) {
                upcomingQuiz.push(item)
            }
        }
        upcomingQuiz = upcomingQuiz.sort(function (a, b) {
            return new Date(a.startAt) - new Date(b.startAt);
        });
        return res.status(200).json(upcomingQuiz)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.post('/quiz', authenticateStaffToken, validate(newQuizSchema), async (req, res) => {
    let {id} = req.user
    let {module, questions, type, startAt, submitBefore} = req.body
    try {

        if (!await staffRepo.matchByModule(id, module))
            return res.status(401).json({
                type: "Unauthorised",
                message: "You are not allowed to add quiz because you are not assigned to selected module"
            })


        let newQuiz = await quizRepo.insertOne(module, type, startAt, submitBefore)
        for (const question of questions) {
            let {answers, questionText, numberOfAnswers, possibleScore} = question
            let newQuestion = await quizRepo.addQuestion(newQuiz.id, questionText, numberOfAnswers, possibleScore)

            for (const answer of answers) {
                let {answerText, correct} = answer
                await quizRepo.addAnswer(newQuestion.id, answerText, correct)

            }
        }

        //
        return res.status(200).json({message: "Quiz Created successfully"})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.get('/quiz/:id', authenticateStaffToken, validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        let quiz = await quizRepo.findById(id)
        if (!quiz)
            return res.status(404).json({type: "Not Found Error", message: `Quiz with id:${id} not found`})

        let questions = await quizRepo.findAllQuestions(id)
        for(const question of questions){
            question.answers = await quizRepo.findAllAnswers(question.id)
        }
        quiz.questions = questions
        res.status(200).json(quiz)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.get('/quiz/submitted/:id', authenticateStaffToken, validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        let quiz = await quizRepo.findById(id)
        if (!quiz)
            return res.status(404).json({type: "Not Found Error", message: `Quiz with id:${id} not found`})
        res.status(200).json(await quizRepo.getAllSubmitted(id))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})
router.get('/quiz/submitted-answers/:id', authenticateStaffToken, validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        let quiz = await quizRepo.getOneSubmitted(id)
        if (!quiz)
            return res.status(404).json({type: "Not Found Error", message: `Quiz with id:${id} not found`})

        let totalScore = 0
        let questions = await quizRepo.findAllQuestions(quiz.quizId)

        for (const question of questions){
            question.submittedAnswers = await quizRepo.findSubmittedAnswersByQuestion(question.id, quiz.id)
            totalScore += question.possibleScore
        }
        console.log(questions)
        quiz.questions = questions
        quiz.totalScore= totalScore
        quiz.actualScore= quiz.score

       return res.status(200).json(quiz)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.post('/assignment', authenticateStaffToken, validate(assignmentSchema), async (req, res) => {
    let {id} = req.user
    let {module, questions, type, startAt, submitBefore} = req.body
    try {

        if (!await staffRepo.matchByModule(id, module))
            return res.status(401).json({
                type: "Unauthorised",
                message: "You are not allowed to add quiz because you are not assigned to selected module"
            })


        let newQuiz = await quizRepo.insertOne(module, type, startAt, submitBefore)
        for (const question of questions) {
            let {answers, questionText, numberOfAnswers, possibleScore} = question
            let newQuestion = await quizRepo.addQuestion(newQuiz.id, questionText, numberOfAnswers, possibleScore)

            for (const answer of answers) {
                let {answerText, correct} = answer
                await quizRepo.addAnswer(newQuestion.id, answerText, correct)

            }
        }

        //
        return res.status(200).json({message: "Quiz Created successfully"})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

module.exports = router