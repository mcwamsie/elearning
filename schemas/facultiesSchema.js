const yup = require("yup");

// Hidden for simplicity

const facultiesSchema = yup.object({
  body: yup.object({
      facultyName: yup.string().required(),
      facultyCode: yup.string().required(),
  }),
});

module.exports = facultiesSchema