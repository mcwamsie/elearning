const express = require('express');
const router = express.Router();
const dao = require('../extensions')


const FacultyRepository = require('../models/FacultyRepository');
const ProgramRepository = require("../models/ProgramRepository");
const ModuleRepository = require("../models/ModuleRepository");
const StaffRepository = require("../models/StaffRepository");

const validate = require("../validate");

const facultiesSchema = require("../schemas/facultiesSchema");
const defaultIdSchema = require("../schemas/defaultIdSchema");
const programsSchema = require("../schemas/programsSchema");
const modulesSchema = require("../schemas/modulesSchema");
const staffSchema = require("../schemas/staffSchema");

const facultiesRepo = new FacultyRepository(dao)
const programsRepo = new ProgramRepository(dao)
const modulesRepo = new ModuleRepository(dao)
const staffRepo = new StaffRepository(dao)

// Get all faculties
router.get('/', async (req, res, next) => {
    try {
        let faculties = await facultiesRepo.findAll()
        res.status(200).json(faculties)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Create Faculty
router.post('/', validate(facultiesSchema), async (req, res, next) => {
    let {facultyCode, facultyName} = req.body

    //let result= await facultiesRepo.findByCode(facultyCode)

    if (await facultiesRepo.findByCode(facultyCode)) {
        return res.status(400).json({type: "Integrity Error", message: `Faculty Code: ${facultyCode} already exist`})

    }

    if (await facultiesRepo.findByName(facultyName)) {
        return res.status(400).json({type: "Integrity Error", message: `Faculty Name: ${facultyName} already exist`})

    }
    try {
        await facultiesRepo.insertOne(req.body)
        return res.json({message: "Faculty saved successfully"}).status(200)

    } catch (e) {
        return res.json({type: "Database Error", message: e.message})
    }


})

// Retrieve Faculty
router.get('/:id', validate(defaultIdSchema), async (req, res, next) => {
    let {id} = req.params
    try {
        let faculty = await facultiesRepo.findById(id)
        if (faculty)
            return res.status(200).json(faculty)
        else
            return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Get All Programs for a faculty
router.get('/:id/programs', async (req, res, next) => {
    let {id} = req.params

    if (!await facultiesRepo.findById(id)) {
        return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    }

    try {
        let programs = await programsRepo.findByFaculty(id)
        return res.status(200).json(programs)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Create program for a faculty
router.post('/:id/programs', validate(programsSchema), async (req, res, next) => {
    let {id} = req.params
    let {programCode, programName} = req.body

    if (!await facultiesRepo.findById(id)) {
        return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    }
    if (await programsRepo.findByCode(programCode))
        return res.status(400).json({type: "Integrity Error", message: `Program Code: ${programCode} already exist`})

    if (await programsRepo.findByName(programName))
        return res.status(400).json({type: "Integrity Error", message: `Program Name: ${programName} already exist`})

    try {
        await programsRepo.insertOne(req.body, id)
        return res.status(200).json({message: `Program save successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Get All Modules for a faculty
router.get('/:id/modules', async (req, res, next) => {
    let {id} = req.params

    if (!await facultiesRepo.findById(id)) {
        return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    }

    try {
        let modules = await modulesRepo.findByFaculty(id)
        return res.status(200).json(modules)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

//

// Create module for a faculty
router.post('/:id/modules', validate(modulesSchema), async (req, res, next) => {
    let {id} = req.params
    let {moduleCode, moduleName} = req.body

    let faculty = await facultiesRepo.findById(id)
    if (!faculty) {
        return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    }
    if (await modulesRepo.findByCode(moduleCode))
        return res.status(400).json({type: "Integrity Error", message: `Module Code: ${moduleCode} already exist`})

    if (await modulesRepo.findByName(moduleName))
        return res.status(400).json({type: "Integrity Error", message: `Module Name: ${moduleName} already exist`})

    try {
        await modulesRepo.insertOne(req.body, id)
        return res.status(200).json({message: `Module saved successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Get All Staff for a faculty
router.get('/:id/staff', async (req, res, next) => {
    let {id} = req.params

    if (!await facultiesRepo.findById(id)) {
        return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    }

    try {
        let staff = await staffRepo.findByFaculty(id)
        return res.status(200).json(staff)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

// Create staff for a faculty
router.post('/:id/staff', validate(staffSchema), async (req, res, next) => {
    let {id} = req.params
    let {username, email_address, national_id} = req.body

    if (!await facultiesRepo.findById(id)) {
        return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    }


    if (await staffRepo.findByNationalId(national_id))
        return res.status(400).json({type: "Integrity Error", message: `Staff member with National ID: ${national_id} already exist`})

    if (await staffRepo.findByUsername(username))
        return res.status(400).json({type: "Integrity Error", message: `Staff member with User: ${username} already exist`})

    if (await staffRepo.findByEmailAddress(email_address))
        return res.status(400).json({type: "Integrity Error", message: `Staff member with Email Address: ${email_address} already exist`})

    try {
        await staffRepo.insertOne(req.body, id)
        return res.status(200).json({message: `Staff member saved successfully`})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})


module.exports = router