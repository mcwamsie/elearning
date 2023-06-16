class ModuleRepository {
    constructor(dao) {
        this.dao = dao
    }


    insertOne(module, facultyId) {
        const {moduleCode, moduleName} = module
        return this.dao.run(
            `INSERT INTO module (moduleCode, moduleName, facultyId)
             VALUES (?, ?, ?)`,
            [moduleCode, moduleName, facultyId]
        )
    }

    updateOne(module, id) {
        const {moduleCode, moduleName, facultyId} = module
        return this.dao.run(
            `UPDATE module
             SET moduleCode=?,
                 moduleName=?,
                 facultyId=?
             WHERE id = ?`,
            [moduleCode, moduleName, facultyId, id]
        )
    }

    findAll() {
        return this.dao.all(
            `SELECT *
             FROM module`
        )
    }

    findStaff(id) {
        return this.dao.all(`SELECT *
                             FROM staff_module
                                      LEFT JOIN staff s on s.id = staff_module.staffId
                             WHERE staff_module.moduleId = ?`,
            [id])
    }

    findRelatedStaff(staffId, moduleId) {
        return this.dao.get(`SELECT *
                             FROM staff_module
                                      LEFT JOIN staff s
                                                on s.id = staff_module.staffId
                             WHERE staff_module.moduleId = ?
                               AND staff_module.staffId = ?
            `,
            [moduleId, staffId])
    }

    findById(id) {
        return this.dao.get(
            `SELECT moduleCode, moduleName, facultyId, facultyName, module.id as moduleId
             FROM module
                      left join faculty f on f.id = module.facultyId
             WHERE module.id = ?`,
            [id]
        )
    }

    getClass(id) {
        return this.dao.all(
            `SELECT *
             FROM program_module
                      LEFT JOIN program p on p.id = program_module.programId
             WHERE moduleId = ?`, [id]
        )
    }

    findByName(moduleName) {
        return this.dao.get(
            `SELECT *
             FROM module
             WHERE moduleName = ?`,
            [moduleName]
        )
    }

    findByCode(moduleCode) {
        return this.dao.get(
            `SELECT *
             FROM module
             WHERE moduleCode = ?`,
            [moduleCode]
        )
    }

    findByFaculty(id) {
        return this.dao.all(
            `SELECT *
             FROM module
             WHERE facultyId = ?`,
            [id]
        )
    }
}

module.exports = ModuleRepository