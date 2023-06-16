const yup = require("yup");


const programStudentSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
  }),
    query: yup.object({
      level: yup.string().matches(/^[1-5][.][1-2]{1}$/, `Level must be formatted {x}.{y}, where y is 1-5 and x is 1-2`).required('Level is required'),
  }),
});

module.exports = programStudentSchema