const yup = require("yup");

// Hidden for simplicity

const modulesSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
  }),
    body: yup.object({
        moduleName: yup.string().required(),
        moduleCode: yup.string().required(),
    })
});

module.exports = modulesSchema