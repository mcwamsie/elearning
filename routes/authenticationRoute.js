const express = require('express');
const bcrypt = require('bcrypt');


const saltRounds = bcrypt.genSaltSync(10);
const router = express.Router();
const dao = require("../extensions");
const validate = require("../validate");
const {generateAccessToken} = require("../jwtTokens");

const StaffRepository = require("../models/StaffRepository");
const StudentRepository = require("../models/StudentRepository");
const ProgramRepository = require("../models/ProgramRepository");

const loginSchema = require("../schemas/loginSchema");
const studentLoginSchema = require("../schemas/studentLoginSchema");

const staffRepo = new StaffRepository(dao)
const studentRepo = new StudentRepository(dao)
const programRepo = new ProgramRepository(dao)



router.post('/staff/login', validate(loginSchema), async (req, res) => {
    let {username, password} = req.body
    try {
        let staff = await staffRepo.findByUsername(username)

        if (!staff)
            return res.status(401).json({type: "Authentication Error", message: `Invalid credentials`})


        if (!await bcrypt.compare(password, staff.password))
            return res.status(401).json({type: "Authentication Error", message: `Invalid credentials`})

        delete staff.password
        return res.status(200).json({token:generateAccessToken(staff)})
    } catch (e) {
        return res.status(500).send({type: "Database Error", message: e.message})
    }
})
router.post('/student/login', validate(studentLoginSchema), async (req, res) => {
    let {password, regNumber} = req.body
    try {
        let student = await studentRepo.findByRegNumber(regNumber)

        if (!student)
            return res.status(401).json({type: "Authentication Error", message: `Invalid credentials`})


        if (!await bcrypt.compare(password, student.password))
            return res.status(401).json({type: "Authentication Error", message: `Invalid credentials`})




        let program = await programRepo.getProgramAndFaculty(student.programId)
        delete student.password
        delete student.programId
        student.program = program


        return res.status(200).json({token:generateAccessToken(student)})
    } catch (e) {
        return res.status(500).send({type: "Database Error", message: e.message})
    }
})
module.exports = router;