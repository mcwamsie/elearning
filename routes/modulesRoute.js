const express = require('express')
const router = express.Router()

const dao = require("../extensions");
const validate = require("../validate");

const ProgramRepository = require("../models/ProgramRepository");
const StudentRepository = require("../models/StudentRepository");
const StaffRepository = require("../models/StaffRepository");
const ModuleRepository = require("../models/ModuleRepository");
const FacultyRepository = require("../models/FacultyRepository");
const LecturesRepository = require("../models/LecturesRepository");
const AssignmentRepository = require("../models/AssignmentRepository");

const programUpdateSchema = require("../schemas/programUpdateSchema");
const defaultIdSchema = require("../schemas/defaultIdSchema");
const programStudentSchema = require("../schemas/programStudentsSchema");
const studentAddSchema = require("../schemas/studentAddSchema");
const programAddModuleSchema = require("../schemas/programAddModuleSchema");
const moduleUpdateSchema = require("../schemas/moduleUpdateSchema");
const modulesAddStaffSchema = require("../schemas/moduleAddStaffSchema");
const lectureSchema = require("../schemas/lectureSchema");
const assignmentSchema = require("../schemas/assignmentSchema");


const assignmentRepo = new AssignmentRepository(dao)
const studentRepo = new StudentRepository(dao)
const moduleRepo = new ModuleRepository(dao)
const facultyRepo = new FacultyRepository(dao)
const staffRepo = new StaffRepository(dao)
const lecturesRepo = new LecturesRepository(dao)

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(await moduleRepo.findAll())
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.get('/:id', validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    let module = await moduleRepo.findById(id)
    if (!module) {
        return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})
    }

    try {
        return res.status(200).json(module)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
});

router.put('/:id', validate(moduleUpdateSchema), async (req, res) => {
    let {moduleCode, moduleName, facultyId} = req.body
    let {id} = req.params

    if (!await facultyRepo.findById(facultyId)) {
        return res.status(404).json({type: "Not Found Error", message: `Faculty with id:${id} not found`})
    }


    try {
        await moduleRepo.updateOne(req.body, id)
        return res.status(200).json({message: "Module Updated successfully"})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})


router.get('/:id/staff', validate(defaultIdSchema), async (req, res) => {
    try {
        let {id} = req.params

        if (!await moduleRepo.findById(id)) {
            return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})
        }

        return res.status(200).json(await moduleRepo.findStaff(id))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})
router.post('/:id/staff', validate(modulesAddStaffSchema), async (req, res) => {
    try {
        let {id} = req.params
        let {staffId} = req.query
        if (!await staffRepo.findById(staffId))
            return res.status(404).json({type: "Not Found Error", message: `Staff Member with id:${id} not found`})


        if (!await moduleRepo.findById(id))
            return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})


        if (await moduleRepo.findRelatedStaff(staffId, id))
            return res.status(404).json({type: "Integrity Error", message: `Staff already assigned to module`})


        await staffRepo.addModule(staffId, id)
        return res.status(200).json({message: "Staff Added To Module successfully"})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.get('/:id/lecture', validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        if (!await moduleRepo.findById(id)) {
            return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})
        }
        return res.status(200).json(await lecturesRepo.findByModuleId(id))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})

router.post('/:id/lecture', validate(lectureSchema), async (req, res) => {
    let {id} = req.params
    try {


        if (!await moduleRepo.findById(id)) {
            return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})
        }

        await lecturesRepo.insertOne(req.body, id)

        return res.status(200).json({message: "Lecture Created successfully"})
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
});

router.get('/:id/assignment', validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        if (!await moduleRepo.findById(id)) {
            return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})
        }
        return res.status(200).json(await assignmentRepo.findByModuleId(id))
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})
router.post(
    '/:id/assignment',
    validate(assignmentSchema),
    async (req, res) => {
    let {id} = req.params
    let file;
    let uploadPath;
    try {

        //console.log(req)
        if (!await moduleRepo.findById(id)) {
            return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        file = req.files.file;
        let newName = new Date().getTime()+"." + file.name.split('.').pop()
        uploadPath = './public/uploads/assignments/'+ newName ;

        // Use the mv() method to place the file somewhere on your server
        await file.mv(uploadPath);
        let data = req.body

        data.filePath = newName;
        delete data.file

        await assignmentRepo.insertOne(data, id)
        return res.status(200).json({message: "Assignment Created successfully"})

    } catch (e) {
        return res.status(500).json({type: e.name, message: e.message})
    }
});

router.get('/:id/classes', validate(defaultIdSchema), async (req, res) => {
    let {id} = req.params
    try {
        if (!await moduleRepo.findById(id)) {
            return res.status(404).json({type: "Not Found Error", message: `Module with id:${id} not found`})
        }

        let classes = await moduleRepo.getClass(id)
        for (const item of classes) {
            let {programId, level} = item
            item.students = await studentRepo.findByLevel(programId, level)
            item.students.forEach((student) => {
                delete student.password
            })
        }

        return res.status(200).json(classes)
    } catch (e) {
        return res.status(500).json({type: "Database Error", message: e.message})
    }
})


module.exports = router