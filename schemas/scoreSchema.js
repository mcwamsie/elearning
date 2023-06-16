const yup = require("yup");

// Hidden for simplicity

const scoreSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
      score: yup.number().required(),
  }),
});

module.exports = scoreSchema