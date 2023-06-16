class FacultyRepository {
    constructor(dao) {
        this.dao = dao
    }
    insertOne(faculty) {
        let {facultyName, facultyCode} = faculty
        return this.dao.run(
            `INSERT INTO faculty (facultyName,facultyCode)
             VALUES (?, ?)`,
            [facultyName, facultyCode]
        )

    }
    findAll(){
        return this.dao.all(
            `SELECT * FROM faculty`,
        )
    }

    findById(id){
        return this.dao.get(
            `SELECT * FROM faculty WHERE id = ?`,
            [id]
        )
    }

    programs(id){
        return this.dao.all(
            `SELECT * FROM program WHERE facultyId= ?`,
            [id]
        )
    }

    findByCode(facultyCode){
        return this.dao.get(
            `SELECT * FROM faculty WHERE facultyCode = ?`,
            [facultyCode]
        )
    }
    findByName(facultyName){
        return this.dao.get(
            `SELECT * FROM faculty WHERE facultyName = ?`,
            [facultyName]
        )
    }




}

module.exports = FacultyRepository