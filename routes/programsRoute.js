const express = require('express')
const router = express.Router()
const dao = require("../extensions");
const validate = require("../validate");
const ProgramRepository = require("../models/ProgramRepository");
const StudentRepository = require("../models/StudentRepository");
const ModuleRepository = require("../models/ModuleRepository");
const FacultyRepository = require("../models/FacultyRepository");

const programUpdateSchema = require("../schemas/programUpdateSchema");
const defaultIdSchema = require("../schemas/defaultIdSchema");
const programStudentSchema = require("../schemas/programStudentsSchema");
const studentAddSchema = require("../schemas/studentAddSchema");
const programAddModuleSchema = require("../schemas/programAddModuleSchema");

const programsRepo = new ProgramRepository(dao)
const studentRepo = new StudentRepository(dao)
const moduleRepo = new ModuleRepository(dao)
const facultyRepo = new FacultyRepository(dao)

router.get('/', async (req, res) => {
    try {
        let programs = await programsRepo.findAll()
        return res.status(200).json(programs)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})
router.get('/:id', validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        let program = await programsRepo.findById(id)
        if (!program)
            return res.status(404).json({type: "Not Found Error", message: `Program with id:${id} not found`})

        return res.status(200).json(program)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})


router.put('/:id', validate(programUpdateSchema), async (req, res) => {
    let {id} = req.params

    try {
        if (!programsRepo.findById(id))
            return res.status(404).json({type: "Not Found Error", message: `Program with id:${id} not found`})

        await programsRepo.updateOne(req.body, id)
        return res.status(200).json({message: `Program updated successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.delete('/:id', validate(programUpdateSchema), async (req, res) => {
    let {id} = req.params

    try {
        if (!programsRepo.findById(id))
            return res.status(404).json({type: "Not Found Error", message: `Program with id:${id} not found`})

        await programsRepo.deleteOne(id)
        return res.status(200).json({message: `Program delete successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})


// Get Students from a program
router.get('/:id/students', validate(programStudentSchema), async (req, res) => {
    let {level} = req.query

    let {id} = req.params
    try {
        let program = await programsRepo.findById(id)
        if (!program)
            return res.status(404).json({type: "Not Found Error", message: `Program with id:${id} not found`})

        let students = await programsRepo.getStudentByLevel(id, level)
        students.forEach((student) => {
            delete student.password
        })
        return res.status(200).json(students)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Create student for a program
router.post('/:id/students', validate(studentAddSchema), async (req, res) => {
    let {level} = req.query
    let {id} = req.params
    let {regNumber, email_address, national_id} = req.body

    try {
        let program = await programsRepo.findById(id)
        if (!program)
            return res.status(404).json({type: "Not Found Error", message: `Program with id:${id} not found`})

        if (await studentRepo.findByNationalId(national_id))
            return res.status(400).json({
                type: "Integrity Error",
                message: `Student with National ID: ${national_id} already exist`
            })

        if (await studentRepo.findByRegNumber(regNumber))
            return res.status(400).json({
                type: "Integrity Error",
                message: `Student with User: ${regNumber} already exist`
            })

        if (await studentRepo.findByEmailAddress(email_address))
            return res.status(400).json({
                type: "Integrity Error",
                message: `Student with Email Address: ${email_address} already exist`
            })

        await studentRepo.insertOne(req.body, id, level)
        return res.status(200).json({message: `Student saved successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

//Get Modules for program Level
router.get('/:id/modules', validate(programStudentSchema), async (req, res) => {
    let {level} = req.query
    let {id} = req.params

    try {

        if (!await programsRepo.findById(id))
            return res.status(404).json({type: "Not Found Error", message: `Program with id:${id} not found`})

        return res.status(200).json(await programsRepo.getModules(id, level))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Create Module for a program
router.post('/:id/modules', validate(programAddModuleSchema), async (req, res) => {
    let {level} = req.query
    let {id} = req.params
    let {moduleCode, moduleName, facultyId} = req.body

    try {

        if (!await programsRepo.findById(id))
            return res.status(404).json({type: "Not Found Error", message: `Program with id:${id} not found`})

        if (!await facultyRepo.findById(facultyId))
            return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})

        if (await moduleRepo.findByCode(moduleCode))
            return res.status(400).json({
                type: "Integrity Error",
                message: `Module with Code: ${moduleCode} already exist`
            })
        if (await moduleRepo.findByName(moduleName))
            return res.status(400).json({
                type: "Integrity Error",
                message: `Module with Name: ${moduleName} already exist`
            })

        let module = await moduleRepo.insertOne({moduleCode, moduleName}, facultyId)
        await programsRepo.addModule(id, module.id, level)

        return res.status(200).json({message: `Module saved successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})


module.exports = router