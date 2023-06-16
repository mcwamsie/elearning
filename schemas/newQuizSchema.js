const {object, string, boolean, array, number, ...yup} = require("yup");

function formatDate(date) {
    return new Date(date).toLocaleString()
}

const answerValidationSchema = object().shape({
    answerText: string().required('Answer Text is required'),
    correct: boolean().required('Correct is required')
})

const questionValidationSchema = object().shape({
    questionText: string().required('Question Text is required'),
    numberOfAnswers: number("Number Of Answers must be a number")
        .min(1, "Number Of Answers must be a number less or equal to 1")
        .required('Number of answers is required'),
    possibleScore: number("Possible Score must be a number")
        .min(1, "Possible Score must be a number less or equal to 1")
        .required('Possible Score is required'),
    answers: array().of(answerValidationSchema)
})

const newQuizSchema = object().shape({

    body: object().shape({
        module: string().required("Module is required"),
        type: string().required("Type is required"),
        startAt: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
            .required("Start Date is required."),
        submitBefore: yup.date().min(
            yup.ref('startAt')
            ,
            ({min}) => `Submission Deadline needs to be after ${formatDate(min)}!!`,
        ).required("Submission Deadline is required."),
        questions: array().of(questionValidationSchema)
    })

});

module.exports = newQuizSchema