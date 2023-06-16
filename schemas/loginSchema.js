const yup = require("yup");

const loginSchema = yup.object({
    body: yup.object({
        username: yup.string().required("Username is required"),
        password: yup.string().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})", "Password must be 8 characters or longer, with at least 1 number, 1 capital letter and 1 small letter.")
            .required("Password is required"),
    }),
});
module.exports = loginSchema
