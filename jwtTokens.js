const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports = {
    generateAccessToken: (username) => {
        return jwt.sign(username, process.env["TOKEN_SECRET"], {expiresIn: '605800s'});
    },
    authenticateStaffToken: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.status(403)
            .json({type: "Unauthorised", message: "Token is required"})

        jwt.verify(token, process.env["TOKEN_SECRET"], (err, user) => {

            if (err)
                return res.status(403).json({type: "Unauthorised", message: err.message})
            let {role} = user

            if (role === "STUDENT" )
                return res.status(403).json({type: "Unauthorised", message: "Students are not allowed for this part"})
            req.user = user

            next()
        }
    )
    },
    authenticateStudentToken: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.status(403)
            .json({type: "Unauthorised", message: "Token is required"})

        jwt.verify(token, process.env["TOKEN_SECRET"], (err, user) => {

            if (err)
                return res.status(403).json({type: "Unauthorised", message: err.message})
            let {role} = user
            if (role === "LECTURER" || role === "TEACHING ASSISTANT" )
                return res.status(403).json({type: "Unauthorised", message: "This part is for students only"})
            req.user = user

            next()
        }
    )
    }
}