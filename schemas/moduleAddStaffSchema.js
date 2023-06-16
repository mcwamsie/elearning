const yup = require("yup");


const modulesAddStaffSchema = yup.object({
    params: yup.object({
        id: yup.number().required(),
    }),
    query: yup.object({
        staffId:yup.number().required(),
    })
});

module.exports = modulesAddStaffSchema