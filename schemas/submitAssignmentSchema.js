const yup = require("yup")

function formatDate(date) {
    return new Date(date).toLocaleString()
}
const MAX_FILE_SIZE = 1024000; //100KB

const validFileExtensions = { file: ["zip","plain","rtf","pdf","jpeg","png","jpg","ogg","json","csv"] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

const submitAssignmentSchema = yup.object({
    params: yup.object({
        id: yup.number().required()
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

module.exports = submitAssignmentSchema