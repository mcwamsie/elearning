const yup = require("yup");

// Hidden for simplicity

const programUpdateSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
  }),
    body: yup.object({
        programName: yup.string().required(),
        programCode: yup.string().required(),
        facultyId: yup.number().required(),
    })
});

module.exports = programUpdateSchema