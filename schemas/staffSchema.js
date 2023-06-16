const yup = require("yup");

const staffSchema = yup.object({
  params: yup.object({
      id: yup.number().required(),
  }),
    body: yup.object({
        username: yup.string().required(),
        first_name: yup.string().required(),
        sex: yup.mixed().oneOf(['MALE', 'FEMALE']).required(),
        title: yup.mixed().oneOf(['MRS', 'MR', 'MISS', 'MS',  'DR', 'HON', 'ENG']).required(),
        surname: yup.string().required(),
        national_id: yup.string().required(),
        phone_numbers: yup.string().required(),
        contact_address: yup.string().required(),
        password: yup.string().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})", "body.password must be 8 characters or longer, with at least 1 number, 1 capital letter and 1 small letter.").required(),
        role: yup.mixed().oneOf(['LECTURER', 'TEACHING ASSISTANT']).required(),
        email_address: yup.string().email().required(),
    })
});

module.exports = staffSchema
/*username,
                   first_name, surname, national_id,
                   email_address, phone_numbers, contact_address,
                   title,sex, password,role*/