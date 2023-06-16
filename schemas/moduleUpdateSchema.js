const yup = require("yup");

// Hidden for simplicity

const moduleUpdateSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
  }),
    body: yup.object({
        moduleName: yup.string().required(),
        moduleCode: yup.string().required(),
        facultyId: yup.number().required()
    })
});

module.exports = moduleUpdateSchema