const yup = require("yup");

const programAddModuleSchema = yup.object({
    params: yup.object({
        id: yup.number().required(),
    }),
    query: yup.object({
        level: yup.string().matches(/^[1-5][.][1-2]{1}$/, `Level must be formatted {x}.{y}, where y is 1-5 and x is 1-2`).required('Level is required'),
    }),
    body: yup.object({
        moduleName: yup.string().required(),
        moduleCode: yup.string().required(),
        facultyId: yup.number().required(),
    })
});

module.exports = programAddModuleSchema