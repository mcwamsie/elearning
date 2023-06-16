const bcrypt = require('bcrypt');
const saltRounds = bcrypt.genSaltSync(10);

class StaffRepository{
    constructor(dao) {
        this.dao = dao
    }

    insertOne(program, facultyId) {
        const {username, first_name, surname, national_id,
                   email_address, phone_numbers, contact_address,
                   title,sex, password,role} = program
        let hashedPassword = bcrypt.hashSync(password, saltRounds)
        return this.dao.run(
            `INSERT INTO staff (username,
                   first_name, surname, national_id,
                   email_address, phone_numbers, contact_address,
                   title,sex, password,role,facultyId)
             VALUES (?,?, ?, ?, ?,?,?,?,?,?, ?,?)`,
            [username, first_name, surname, national_id,
                   email_address, phone_numbers, contact_address,
                   title,sex, hashedPassword,role,facultyId]
        )
    }

    addModule(staffId, moduleId) {
        return this.dao.run(
            `INSERT INTO staff_module (staffId, moduleId)
             VALUES (?, ?)`,
            [staffId, moduleId]
        )
    }

    getModules(id){
        return this.dao.all(
            `SELECT *
             FROM staff_module 
                 LEFT JOIN
                 module m on m.id = staff_module.moduleId
                LEFT JOIN faculty f on m.facultyId = f.id
             WHERE staff_module.staffId = ?`,
            [id]
        )
    }

    findByFaculty(id) {
        return this.dao.all(
            `SELECT *
             FROM staff
             WHERE facultyId = ?`,
            [id]
        )
    }
    findById(id) {
        return this.dao.get(
            `SELECT *
             FROM staff
             WHERE id = ?`,
            [id]
        )
    }

    findByNationalId(nationId) {
        return this.dao.get(
            `SELECT *
             FROM staff
             WHERE national_id = ?`,
            [nationId]
        )
    }
    findByUsername(username) {
        return this.dao.get(
            `SELECT *
             FROM staff
            LEFT JOIN faculty f on f.id = staff.facultyId
             WHERE username = ?`

            ,
            [username]
        )
    }
    findByEmailAddress(email_address) {
        return this.dao.get(
            `SELECT *
             FROM staff
             WHERE email_address = ?`,
            [email_address]
        )
    }

    matchByModule(id, moduleId){
        return this.dao.get(
            `SELECT * FROM staff_module WHERE moduleId = ?  AND staffId =?`,
            [moduleId, id]
        )
    }
}

module.exports = StaffRepository
