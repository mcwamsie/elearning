const yup = require("yup");


const studentEditSchema = yup.object({
    params: yup.object({
        id: yup.number().required(),
    }),
    body: yup.object({
        regNumber: yup.string().matches(/^[C][1-2]\d{7}[A-Z]$/, `Reg No. must be formatted C{x}{y}{z}, where y is 1-2 and x is 0-9 length 7 and z is A-Z`).required('Reg No. is required'),
        programId: yup.number('Program is required').required('Program is required'),
        level: yup.string().matches(/^[1-5][.][1-2]$/, `Level must be formatted {x}.{y}, where y is 1-5 and x is 1-2`).required('Level is required'),
        first_name: yup.string().required("First Name is required"),
        surname: yup.string().required("Surname is required"),
        national_id: yup.string().required("National Id Number is required"),
        email_address: yup.string().email().required("Email Address is required"),
        phone_numbers: yup.string().required("Phone Number is required"),
        contact_address: yup.string()
            .required("Home Address is required"),
        sex: yup.mixed().oneOf(['MALE', 'FEMALE'])
            .required("Sex is required"),
        title: yup.mixed().oneOf(['MRS', 'MR', 'MISS', 'MS', 'DR', 'HON', 'ENG'])
            .required("Title is required"),
    })
});

module.exports = studentEditSchema