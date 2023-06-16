class AssignmentRepository {
    constructor(dao) {
        this.dao = dao
    }

    insertOne({startDate, endDate, title, possibleScore, filePath}, moduleId) {
        return this.dao.run(`
            INSERT INTO assignments (moduleId, startDate, endDate, title, possibleScore, filePath)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [moduleId, startDate, endDate, title, possibleScore, filePath])
    }

    findByModuleId(moduleId) {
        return this.dao.all(`
            SELECT a.*, m.moduleCode, m.moduleName
            FROM assignments a
                     left join module m on m.id = a.moduleId
            WHERE a.moduleId = ?
            ORDER BY a.startDate
        `, [moduleId])
    }

    findUpcomingByModuleId(moduleId) {
        return this.dao.all(`
            SELECT *
            FROM assignments
                     left join module m on m.id = assignments.moduleId
            WHERE moduleId = ?
              AND assignments.startDate >= datetime('now')
              AND assignments.endDate >= datetime('now')
            ORDER BY startDate
        `, [moduleId])
    }


    insertStudentSubmission(filePath, studentId, assignmentId) {
        return this.dao.run(`INSERT INTO studentAssignments(studentId, assignmentId, filePath, submittedAt)
                             VALUES (?, ?, ?, ?)`,
            [studentId, assignmentId, filePath, new Date()])

    }

    findByStudentSubmission(studentId, assignmentId) {
        return this.dao.get(`
            SELECT sa.score, sa.marked, sa.filePath submittedFilepath
            FROM studentAssignments sa
            WHERE sa.assignmentId = ?
              AND sa.studentId = ?
        `, [assignmentId, studentId])
    }

    findById(id) {
        return this.dao.get(
            `SELECT assignments.*, moduleName, moduleCode
             FROM assignments
                      left join module m on assignments.moduleId = m.id
             WHERE assignments.id = ?`,
            [id]
        )
    }

    checkIfSubmitted(studentId, assignmentId) {
        return this.dao.get(
            `SELECT  sa.filePath,
                    sa.score,
                    sa.id sId
             FROM studentAssignments sa
             WHERE sa.studentId = ?
               AND sa.assignmentId = ?`,
            [studentId, assignmentId]
        )
    }

    getAllSubmitted(id) {
        return this.dao.all(
            `SELECT distinct s.*,
                    p.programCode,
                    p.programName
             FROM student s
                  left join program_module pm on s.programId = pm.programId and s.level = pm.level
                      LEFT JOIN program p on s.programId = p.id
             WHERE pm.moduleId = ?

            `,
            [id]
        )
    }

    updateScore(id, score){
        this.dao.run(`UPDATE studentAssignments SET score=?, marked=1 WHERE id=?`, [score, id])
    }
    findSubmittedById(id) {
        return this.dao.get(
            `SELECT sa.*, a.possibleScore  FROM studentAssignments sa left join assignments a on a.id = sa.assignmentId  WHERE sa.id = ?`,
            [id]
        )
    }


}

module.exports = AssignmentRepository