const bcrypt = require('bcrypt');
const saltRounds = bcrypt.genSaltSync(10);

class StaffRepository {
    constructor(dao) {
        this.dao = dao
    }

    findAll() {
        return this.dao.all(
            `SELECT student.*,
                    p.programName,
                    p.programCode
             FROM student
                      LEFT JOIN program p on student.programId = p.id
            `,
        )
    }

    insertOne(student, programId, level) {
        const {
            regNumber, first_name, surname, national_id,
            email_address, phone_numbers, contact_address,
            title, sex, password, role
        } = student
        let hashedPassword = bcrypt.hashSync(password, saltRounds)
        return this.dao.run(
            `INSERT INTO student (regNumber,
                                  first_name, surname, national_id,
                                  email_address, phone_numbers, contact_address,
                                  title, sex, password, role, level, programId)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [regNumber,
                first_name, surname, national_id,
                email_address, phone_numbers, contact_address,
                title, sex, hashedPassword, role, level, programId]
        )
    }
    updateOne(student, id) {
        const {
            regNumber, first_name, surname, national_id,
            email_address, phone_numbers, contact_address,
            title, sex, programId, level
        } = student
        return this.dao.run(
            `UPDATE student SET regNumber=?, first_name=?, surname=?,
                   national_id=?,email_address =?, phone_numbers = ?,
                   contact_address=?,title=?, sex=?, programId=?, level=?
                   WHERE id =?
                   `,
            [regNumber, first_name, surname, national_id,
            email_address, phone_numbers, contact_address,
            title, sex, programId, level, id]
        )
    }

    findById(id) {
        return this.dao.get(
            `SELECT *
             FROM student
             WHERE id = ?`,
            [id]
        )
    }

    findByLevel(programId, level) {
        return this.dao.all(
            `SELECT *
             FROM student
             WHERE programId = ?
               AND level = ?`,
            [programId, level]
        )
    }

    findByNationalId(nationId) {
        return this.dao.get(
            `SELECT *
             FROM student
             WHERE national_id = ?`,
            [nationId]
        )
    }

    findByRegNumber(regNumber) {
        return this.dao.get(
            `SELECT *
             FROM student
             WHERE regNumber = ?`,
            [regNumber]
        )
    }

    findByEmailAddress(email_address) {
        return this.dao.get(
            `SELECT *
             FROM student
             WHERE email_address = ?`,
            [email_address]
        )
    }
}

module.exports = StaffRepository
