const yup = require("yup")

function formatDate(date) {
    return new Date(date).toLocaleString()
}

const lectureSchema = yup.object({
    params: yup.object({
        id: yup.number().required()
    }),
    body: yup.object({
        topic: yup.string().required("Topic is required"),
        startDate: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
            .required("Start Date is required."),
        endDate: yup.date().min(
            yup.ref('startDate'),
            ({min}) => `Date needs to be after ${formatDate(min)}`,
        ).required("End Date is required."),
    })

})

module.exports = lectureSchema