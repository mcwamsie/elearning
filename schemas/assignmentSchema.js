const yup = require("yup")

function formatDate(date) {
    return new Date(date).toLocaleString()
}
const MAX_FILE_SIZE = 1024000; //100KB

const validFileExtensions = { file: ["zip","plain","rtf","pdf","jpeg","png","jpg","ogg","json","csv"] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

const assignmentSchema = yup.object({
    params: yup.object({
        id: yup.number().required()
    }),
    body: yup.object({
        title: yup.string().required("Title is required"),
    startDate: yup.date().min(new Date(), ({min}) => `Start Date needs to be after ${formatDate(min)}!!`)
        .required("Start Date is required."),
        possibleScore: yup.number().required("Possible Score is required"),
    endDate: yup.date().min(
        yup.ref('startDate')
        ,
        ({min}) => `End Date needs to be after ${formatDate(min)}!!`,
    ).required("End Date is required."),

    }),
    files: yup.object({
        file: yup
      .mixed()
      .required("Required")
      .test("is-valid-type", "Not a valid file type",
        value => isValidFileType(value && value.name.toLowerCase(), "file"))
      .test("is-valid-size", "Max allowed size is 100KB",
        value => value && value.size <= MAX_FILE_SIZE)
    })
})

module.exports = assignmentSchema