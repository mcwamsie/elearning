const yup = require("yup");


const studentAddSchema = yup.object({
    params: yup.object({
        id: yup.number().required(),
    }),
    query: yup.object({
        level: yup.string().matches(/^[1-5][.][1-2]$/, `Level must be formatted {x}.{y}, where y is 1-5 and x is 1-2`).required('Level is required'),
    }),
    body: yup.object({
        regNumber: yup.string().matches(/^[C][1-2]\d{7}[A-Z]$/, `Reg No. must be formatted C{x}{y}{z}, where y is 1-2 and x is 0-9 length 7 and z is A-Z`).required('Reg No. is required'),
        first_name: yup.string().required(),
        surname: yup.string().required(),
        national_id: yup.string().required(),
        email_address: yup.string().email().required(),
        phone_numbers: yup.string().required(),
        contact_address: yup.string().required(),
        sex: yup.mixed().oneOf(['MALE', 'FEMALE']).required(),
        title: yup.mixed().oneOf(['MRS', 'MR', 'MISS', 'MS',  'DR', 'HON', 'ENG']).required(),
        password: yup.string().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})", "body.password must be 8 characters or longer, with at least 1 number, 1 capital letter and 1 small letter.").required(),
        role: yup.mixed().oneOf(['STUDENT']).required()
    })
});

module.exports = studentAddSchema