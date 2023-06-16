const AppDAO = require('./models/appDAO')
const dao = new AppDAO('./database.sqlite3')

module.exports = dao