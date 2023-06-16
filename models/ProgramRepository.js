class ProgramRepository {
    constructor(dao) {
        this.dao = dao
    }

    insertOne(program, facultyId) {
        const {programCode, programName} = program
        return this.dao.run(
            `INSERT INTO program (programCode, programName, facultyId)
             VALUES (?, ?, ?)`,
            [programCode, programName, facultyId]
        )
    }

    updateOne(program,id ) {
        const {programCode, programName, facultyId} = program
        return this.dao.run(
            `UPDATE program SET programCode=?, programName=?, facultyId=?
             WHERE id=?`,
            [programCode, programName, facultyId, id]
        )
    }

    addModule(programId, moduleId, level) {
        return this.dao.run(
            `INSERT INTO program_module (programId, moduleId, level)
             VALUES (?, ?, ?)`,
            [programId, moduleId, level]
        )
    }
    getModules(programId, level) {
        return this.dao.all(
            `SELECT * FROM program_module 
            LEFT JOIN module m on 
                m.id = program_module.moduleId 
            WHERE level = ? AND programId=?`,
            [ level,programId]
        )
    }



    getStudentByLevel(programId, level){
        return this.dao.all(
            `SELECT *
             FROM student WHERE programId = ? AND level = ?`,
            [programId, level]
        )
    }

    deleteOne(id ) {
        return this.dao.run(
            `DELETE FROM program WHERE id=?`,
            [id]
        )
    }
    findAll(){
        return this.dao.all(
            `SELECT *
             FROM program`,

        )
    }

    findById(id) {
        return this.dao.get(
            `SELECT *
             FROM program
             WHERE id= ?`,
            [id]
        )
    }

    getProgramAndFaculty(id){
        return this.dao.get(
            `SELECT *
             FROM program LEFT JOIN faculty f on program.facultyId = f.id
             WHERE program.id= ?`,
            [id]
        )
    }

    findByFaculty(id) {
        return this.dao.all(
            `SELECT *
             FROM program
             WHERE facultyId = ?`,
            [id]
        )
    }

    findByName(programName) {
        return this.dao.get(
            `SELECT *
             FROM program
             WHERE programName = ?`,
            [programName]
        )
    }

    findByCode(programCode) {
        return this.dao.get(
            `SELECT *
             FROM program
             WHERE programCode = ?`,
            [programCode]
        )
    }
}

module.exports = ProgramRepository