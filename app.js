const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require("cors");
const http = require("http");
const fileUpload = require('express-fileupload');
const {v4: uuidv4} = require("uuid");
morgan = require('morgan')


const dao = require("./extensions");
dotenv.config();
//const upload = multer();

const PORT = process.env['PORT'] | 8125

const app = express();
app.use(cors())
app.use(fileUpload());
app.use(morgan('combined'))


const LecturesRepository = require('./models/LecturesRepository')
const StaffRepository = require('./models/StaffRepository')
const StudentRepository = require('./models/StudentRepository')

const lectureRepo = new LecturesRepository(dao)
const staffRepo = new StaffRepository(dao)
const studentRepo = new StudentRepository(dao)


const server = http.createServer(app);
const socket = require("socket.io");

const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const {ExpressPeerServer} = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect(`/room/${uuidv4()}`);
});

app.get("/room/lectureRoom/:roomId", async (req, res) => {
    let {roomId} = req.params
    let lecture = await lectureRepo.findByCode(roomId)
    res.render("room2", {roomName: lecture.topic, roomId: roomId});
});

app.get("/room/staff-link", async (req, res) => {
    let {staffId, roomId} = req.query
    let profile = await staffRepo.findById(staffId)
    //console.log(req.query)
    res.render("staffLink", {displayName: profile.first_name + " " + profile.surname, roomId: roomId})
})

app.get("/room/student-link", async (req, res) => {
    let {studentId, roomId} = req.query
    let profile = await studentRepo.findById(studentId)
    //console.log(req.query)
    res.render("studentLink", {displayName: profile.first_name + " " + profile.surname, roomId: roomId})
})
//Api Routes
app.use('/api/v1/faculties', require('./routes/facultiesRoute'))
app.use('/api/v1/programs', require('./routes/programsRoute'))
app.use('/api/v1/modules', require('./routes/modulesRoute'))
app.use('/api/v1/staff', require('./routes/staffRoutes'))
app.use('/api/v1/student', require('./routes/studentsRoute'))
app.use('/api/v1/auth', require('./routes/authenticationRoute'))

// Not Found Route
app.use("*", (req, res) => {
    res.status(404).json(
        {type: "Page Not Found Error", message: "Page not found"}
    )
})

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId)
        //io.to(roomId).emit("user-connected", userId);
        socket.broadcast.to(roomId).emit("user-connected", userId)
        socket.on('disconnect', () => {
            socket.leave(roomId)
            socket.broadcast.to(roomId).emit("user-left", userId)
        });
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);

        });
    });
});
/*
const users = {};

const socketToRoom = {};
const rooms={};

io.on('connection',(socket)=>
{
    console.log("Connected");

    socket.on("join room",(roomID)=>{
        console.log("User here");
        if(rooms[roomID])
            rooms[roomID].push(socket.id);
        else
            rooms[roomID]=[socket.id];
        const otherUser = rooms[roomID].find(id => id!==socket.id);

        console.log(rooms)
        socket.emit("other user",otherUser);

    });
    socket.on("call partner",(incoming)=>{
        console.log("call partner from server");
        const payload={
            CallerID:incoming.CallerID,
            signal:incoming.signal
        }
        io.to(incoming.PartnerID).emit("caller signal", payload);
    });
    socket.on("accept call",(incoming)=>{
        console.log("accept call");
        io.to(incoming.CallerID).emit("callee signal",incoming.signal);
    });
});

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            let socketId = socket.id

            if (!(socketId in users[roomID])) {
                users[roomID].push(socketId);
            }
            console.log(users)
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

 */
/*
io.on("connection", socket => {
    socket.on('staff join room', async ({roomId, staffId}) => {
        let lecturer = await lectureRepo.findStaffInRoom(staffId, roomId)
        if (!lecturer) {
            console.log("Not Found, Now adding")
            await lectureRepo.addStaffToRoom(socket.id, roomId, staffId)

        } else {
            await lectureRepo.updateStaffSocketId(socket.id, roomId, staffId)
        }
        lecturer =await lectureRepo.findStaffInRoom(staffId, roomId)

        let students = await lectureRepo.findAllStudentsInRoom(roomId)
        for (const student of students) {
            socket.to(student.socketId).emit("staff joined", lecturer);
        }
        socket.emit("all students", students)
    })

    socket.on('student join room', async ({roomId, studentId}) => {
        let student = await lectureRepo.findStudentInRoom(studentId, roomId)
        if (!student) {
            console.log("Not Found, Now adding")
            await lectureRepo.addStudentToRoom(socket.id, roomId, studentId)
        } else {
            console.log()
            await lectureRepo.updateStudentSocketId(socket.id, roomId, studentId)
        }
        let students = await lectureRepo.findAllStudentsInRoom(roomId)
        let lecturer = await lectureRepo.findLecturerInRoom(roomId)
        socket.to(socket.id).emit("staff joined", lecturer);
        socket.emit("all students", students)
        socket.to(socket.id).emit()
    })
    socket.on("student sent message", async ({messageText, roomId, studentId})=>{
        let message = await lectureRepo
            .addMessageToRoom(messageText, roomId, studentId, null)
        let students = await lectureRepo.findAllStudentsInRoom(roomId)
        let studentProfile = await studentRepo.findById(studentId)
        for (const student of students) {
            let newMessage = await lectureRepo.findMessageById(message.id)
            //console.log(student.socketId, newMessage)
            let {first_name, surname, regNumber}= studentProfile
            newMessage.profile = {first_name, surname, regNumber}
            io.to(student.socketId).emit("new message", newMessage);
        }

    })
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("sending signal", payload => {
        console.log()
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(socket.id, "Left")
    });

});
 */
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});