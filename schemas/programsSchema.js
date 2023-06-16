const yup = require("yup");

// Hidden for simplicity

const programsSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
  }),
    body: yup.object({
        programName: yup.string().required(),
        programCode: yup.string().required(),
    })
});

module.exports = programsSchema