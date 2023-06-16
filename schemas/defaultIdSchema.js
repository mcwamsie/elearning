const yup = require("yup");

// Hidden for simplicity

const defaultIdSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
  }),
});

module.exports = defaultIdSchema