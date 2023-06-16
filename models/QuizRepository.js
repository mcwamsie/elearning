class QuizRepository {
    constructor(dao) {
        this.dao = dao
    }

    insertOne(moduleId, type, startAt, submitBefore) {
        return this.dao.run(`
            INSERT INTO quiz (moduleId, type, startAt, submitBefore, published)
            VALUES (?, ?, ?, ?, ?)
        `, [moduleId, type, startAt, submitBefore, false])
    }

    insertSubmittedOne(quizId, studentId, score, marked) {
        return this.dao.run(`INSERT INTO submitted_quiz (quizId, studentId, score, marked)
                             VALUES (?, ?, ?, ?)`,
            [quizId, studentId, score, marked])
    }

    UpdateScore(submittedId, score) {
        return this.dao.run(`UPDATE submitted_quiz SET score=? WHERE id =?`,
            [score,submittedId ])
    }



    addQuestion(quizId, questionText, numberOfAnswers, possibleScore) {
        return this.dao.run(`
            INSERT INTO quizQuestions (quizId, questionText, numberOfAnswers, possibleScore)
            VALUES (?, ?, ?, ?)
        `, [quizId, questionText, numberOfAnswers, possibleScore])
    }

    addAnswer(questionId, answerText, correct) {
        return this.dao.run(`
            INSERT INTO quizAnswer (questionId, answerText, correct)
            VALUES (?, ?, ?)
        `, [questionId, answerText, correct])
    }

    findUpcomingByModuleId(moduleId) {
        return this.dao.all(`
            SELECT quiz.*, m.moduleCode, m.moduleName
            FROM quiz
                     left join module m on quiz.moduleId = m.id
            WHERE moduleId = ?
              AND quiz.submitBefore >= datetime('now')
            ORDER BY startAt
        `, [moduleId])
    }

    findByModuleId(moduleId) {
        return this.dao.all(
            `SELECT quiz.*, m.moduleCode, m.moduleName
             FROM quiz
                      left join module m on quiz.moduleId = m.id
             WHERE moduleId = ?`,
            [moduleId]
        )
    }


    findAllQuestions(quizId) {
        return this.dao.all(
            `SELECT *
             FROM quizQuestions
             WHERE quizId = ?`,
            [quizId]
        )
    }

    findQuestionById(id) {
        return this.dao.all(
            `SELECT *
             FROM quizQuestions
             WHERE id = ?`,
            [id]
        )
    }

    findAnswerById(id) {
        return this.dao.get(
            `SELECT *
             FROM quizAnswer
             WHERE id = ?`,
            [id]
        )
    }

    addSubmittedAnswer(questionId, answerText, actual_score, possible_score, quizId) {
        console.log(questionId, answerText, actual_score, possible_score)
        return this.dao.run(`
            INSERT INTO submitted_quiz_answers (questionId, answerText, actual_score, possible_score, quizId)
            VALUES (?, ?, ?, ?, ?)
        `, [questionId, answerText, actual_score, possible_score, quizId])
    }

    findSubmittedAnswers(questionId) {
        return this.dao.all(
            `SELECT *
             FROM submitted_quiz_answers
             WHERE questionId = ?`,
            [questionId]
        )
    }
    findSubmittedAnswersByQuestion(questionId, quizId) {
        return this.dao.all(
            `SELECT *
             FROM submitted_quiz_answers
             WHERE questionId = ? AND
             quizId = ?`,
            [questionId, quizId]
        )
    }

    getAllSubmitted(id) {
        return this.dao.all(
            `SELECT j.*, s.regNumber, s.first_name, s.surname, s.level, p.programCode, p.programName
             FROM submitted_quiz j
                      left join student s on s.id = j.studentId
                      left join program p on s.programId = p.id
             WHERE j.quizId = ?`,
            [id]
        )
    }

    getOneSubmitted(id) {
        return this.dao.get(
            `SELECT j.*, s.regNumber, s.first_name, s.surname, s.level, p.programCode, p.programName, q.startAt, q.submitBefore,
    q.type,
       m.moduleName , m.moduleCode   
FROM submitted_quiz j
                      left join student s on s.id = j.studentId
                      left join program p on s.programId = p.id
                        left join quiz q on j.quizId = q.id
left join module m on q.moduleId = m.id
             WHERE j.id = ?`,
            [id]
        )
    }


    findAllAnswers(questionId) {
        return this.dao.all(
            `SELECT *
             FROM quizAnswer
             WHERE questionId = ?`,
            [questionId]
        )
    }

    findById(id) {
        return this.dao.get(
            `SELECT quiz.*, moduleName, moduleCode
             FROM quiz
                      left join module m on quiz.moduleId = m.id
             WHERE quiz.id = ?`,
            [id]
        )
    }

    checkIfSubmitted(studentId, quizId) {
        return this.dao.get(
            `SELECT *
             FROM submitted_quiz
             WHERE studentId = ?
               AND quizId = ?`,
            [studentId, quizId]
        )
    }

}

module.exports = QuizRepository