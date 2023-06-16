const yup = require("yup");

const studentLoginSchema = yup.object({
    body: yup.object({
        regNumber: yup.string().matches(/^[C][1-2]\d{7}[A-Z]$/, `Reg No. must be formatted C{x}{y}{z}, where y is 1-2 and x is 0-9 length 7 and z is A-Z`).required('Reg No. is required'),
        password: yup.string().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})", "Password must be 8 characters or longer, with at least 1 number, 1 capital letter and 1 small letter.")
            .required("Password is required"),
    }),
});
module.exports = studentLoginSchema
