const {v1} = require("uuid");

class LecturesRepository {
    constructor(dao) {
        this.dao = dao
    }
    findById(id){
        return this.dao.get(`
            SELECT *
            FROM lectures
                     left join module m on m.id = lectures.moduleId
            WHERE lectures.id = ?
        `, [id])
    }
    findByCode(code){
        return this.dao.get(`
            SELECT *
            FROM lectures
                     left join module m on m.id = lectures.moduleId
            WHERE lectures.lectureCode = ?
        `, [code])
    }
    insertOne(lecture, moduleId) {
        let {topic, startDate, endDate} = lecture
        let formattedStartTime = startDate.replace("T", " ")
        let formattedEndTime = endDate.replace("T", " ")
        let uuid = v1()

        return this.dao.run(
            `INSERT INTO lectures(topic, moduleId, startDate, endDate, lectureCode)
             VALUES (?, ?, ?, ?, ?)`,
            [topic, moduleId, formattedStartTime, formattedEndTime, uuid]
        )
    }

    findByModuleId(moduleId) {
        return this.dao.all(`
            SELECT *
            FROM lectures
                     left join module m on m.id = lectures.moduleId
            WHERE moduleId = ?
            ORDER BY startDate
        `, [moduleId])
    }

    findUpcomingByModuleId(moduleId) {
        return this.dao.all(`
            SELECT *
            FROM lectures
                     left join module m on m.id = lectures.moduleId
            WHERE moduleId = ?
              AND lectures.endDate >= datetime('now')
            ORDER BY startDate
        `, [moduleId])
    }

    addToRoom({socketId, lectureId, type, id}) {
        let studentId = type === "STUDENT" && id
        let staffId = type === "STAFF" && id

        return this.dao.run(
            `INSERT INTO lectureRoom(socketId, lectureId, staffId, studentId, lastSeen)
             VALUES (?, ?, ?, ?, ?)`,
            [socketId, lectureId, staffId, studentId, 'online']
        )
    }



    addStaffToRoom(socketId, roomId, staffId){
        return this.dao.run(
            `INSERT INTO staffRoom(socketId, lectureId, staffId, lastSeen)
             VALUES (?, ?, ?, ?)`,
            [socketId, roomId, staffId,  'online']
        )
    }
    updateStaffSocketId(socketId, roomId, staffId){
        return this.dao.run(
            `UPDATE staffRoom SET socketId=?, lastSeen=? WHERE lectureId=? AND staffId= ?`,
            [socketId,'online', roomId, staffId]
        )
    }
    updateStudentSocketId(socketId, roomId, studentId){
        return this.dao.run(
            `UPDATE studentRoom SET socketId=?, lastSeen=? WHERE lectureId=? AND studentId= ?`,
            [socketId,'online', roomId, studentId]
        )
    }
    findStaffInRoom(staffId, roomId){
        return this.dao.get(
            `SELECT r.socketId, r.socketId, s.surname, s.first_name, s.username  FROM staffRoom r
            LEFT JOIN staff s on s.id = r.staffId
            WHERE staffId = ? AND lectureId= ?`,
            [staffId, roomId]
        )
    }
    findStudentInRoom(studentId, roomId){
        return this.dao.get(
            `SELECT * FROM studentRoom WHERE studentId = ? AND lectureId= ?`,
            [studentId, roomId]
        )
    }
    findAllStudentsInRoom(roomId){
        return this.dao.all(
            `SELECT r.socketId, s.first_name, s.surname, s.regNumber, s.id studentId FROM studentRoom r
                LEFT JOIN student s on s.id = r.studentId
            WHERE lectureId= ?`,
            [roomId]
        )
    }
    findLecturerInRoom(roomId){
        return this.dao.get(
            `SELECT r.socketId, s.surname, s.first_name, s.username FROM staffRoom r
left join staff s on s.id = r.staffId
            WHERE lectureId= ?`,
            [roomId]
        )
    }
    addStudentToRoom(socketId, roomId, studentId){
        return this.dao.run(
            `INSERT INTO studentRoom(socketId, lectureId, studentId, lastSeen)
             VALUES (?, ?, ?, ?)`,
            [socketId, roomId, studentId,  'online']
        )
    }
    addMessageToRoom(messageText,roomId, studentId, staffId){
        return this.dao.run(
            `INSERT INTO roomMessages(messageText,roomId, studentId, staffId, createdAt)
             VALUES (?, ?, ?, ?, DATETIME('now'))`,
            [messageText,roomId, studentId, staffId ]
        )
    }
    findMessageById(id){
        return this.dao.get(
            `SELECT * FROM  roomMessages WHERE id= ?`,
            [id ]
        )
    }

    updateSocketId(id, socketId){
        return this.dao.run(
            `UPDATE lectureRoom SET socketId=?, lastSeen=? WHERE id= ?`,
            [socketId,"online", id]
        )
    }

    updateLastSeen(socketId){
        return this.dao.run(
            `UPDATE lectureRoom SET lastSeen=datetime('now') WHERE id= ?`,
            [socketId]
        )
    }

    findOthersInRoom(roomId, id){
        return this.dao.all(
                `SELECT * FROM lectureRoom 
                LEFT JOIN student s2 on lectureRoom.studentId = s2.id
                LEFT JOIN staff s on s.id = lectureRoom.staffId

                WHERE lectureId = ? AND lectureRoom.id !=? AND lastSeen=?
                `,
                [ roomId, id, "online"]
            )
    }

    findInRoom({lectureId, type, id}) {
        if(type === "STUDENT")
            return this.dao.get(
                `SELECT * FROM lectureRoom WHERE lectureId = ? AND studentId = ?`,
                [lectureId, id]
            )
        if(type === "STAFF")
            return this.dao.get(
                `SELECT * FROM lectureRoom WHERE lectureId = ? AND staffId = ?`,
                [lectureId, id]
            )
    }

}

module.exports = LecturesRepository