const FormikError = ({errors, name, touched,help_text})=>{
    return(
        <small className={
                    errors[name] && touched[name] ?
                        "form-text text-danger"
                        : "form-text text-muted opacity-0"
                }
                >
                    {
                        errors[name] && touched[name] ?
                            errors[name] :
                            help_text
                    }
                </small>
    )
}

export default FormikError