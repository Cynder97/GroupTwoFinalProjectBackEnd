const express = require("express")
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const Course = require('./models/courses')
const jwt = require('jwt-simple')
const User = require('./models/users')
const secret = "supersecret"
app.use(cors())
app.use(bodyParser.json())
const router = express.Router()
app.use(express.json())

router.post("/user", async(req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).json({ error: "Missing username or password" });
    }

    const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })
    try{
        await newUser.save()
        res.sendStatus(201)
    }
    catch(err){
        res.status(400).send(err)
    }

})

router.post("/auth", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        let user = await User.findOne({ username: req.body.username });

        if (!user) {
            console.log("User not found in database:", req.body.username);
            return res.status(401).json({ error: "Username or password are incorrect" });
        }

        console.log("User found:", user);

        if (user.password !== req.body.password) {
            console.log("Password mismatch for user:", req.body.username);
            return res.status(401).json({ error: "Username or password are incorrect" });
        }

        const token = jwt.encode({ username: user.username }, secret);
        res.json({ username: user.username, token: token, auth: 1 });
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});


    router.get("/status", async(req, res) => {
        if(!req.headers["x-auth"]){
            return res.status(401).json({error: "Missing X-Auth"})
        }
        const token = req.headers["x-auth"]
        try{
            const decoded = jwt.decode(token,secret)
            const users = await User.find({}, "username status")
            res.json(users)
        }
        catch(ex){
            res.status(401).json({error: "invalid jwt"})
        }
    
    })

router.get("/courses", async(req, res) => {
    try{
        const courses = await Course.find({})
        res.send(courses)
        console.log(courses)
    }
    catch (err){
        console.log(err)
    }
})

router.get("/courses/:id", async (req, res) => {
    try{
        const course = await Course.findById(req.params.id)
        res.json(course)
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.post("/courses", async(req, res) => {
    try{const course = await new Course(req.body)
        await course.save()
        res.status(201).json(course)
        console.log(course)
    }
    catch(err){
        res.status(400).send(err)
        console.log(err)
    }
})

router.put("/courses/:id", async(req, res) => {
    try {
        const course = req.body;
        await Course.updateOne({ _id: req.params.id }, course);
        console.log(course);
        res.status(200).json(course);
    }
    catch(err) {
        res.status(400).send(err);
        console.log(err);
    }
});


router.delete("/courses/:id", async(req, res) => {
    try{
    const course = await Course.findById(req.params.id)
    await Course.deleteOne({ _id: course._id})
    res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
})

app.use("/api", router)
app.listen(3000)
