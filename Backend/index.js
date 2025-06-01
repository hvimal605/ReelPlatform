const express = require("express")
const app = express();

const fileUpload = require("express-fileupload")

const database = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require('cors')
const {cloudinaryConnect} = require('./config/cloudinary')

const authRoutes = require("./routes/auth");
const reelRoutes = require("./routes/Reel");
const interactionRoutes = require("./routes/Interactions");
const commentRoutes = require("./routes/Comment");
const profileRoutes = require("./routes/Profile");
// const profileRoutes = require("./routes/Profile");

const dotenv = require("dotenv")
dotenv.config()

const Port = process.env.PORT ||4000

//database connect 
database.connect()
//middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin:"https://reelvibeplatform.netlify.app",
        credentials:true,
    })
)



app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:'/tmp',
    })
)


//cloudinary connection 
cloudinaryConnect()


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reel", reelRoutes);
app.use("/api/v1/interaction", interactionRoutes);  
app.use("/api/v1/comment",commentRoutes);          
app.use("/api/v1/profile", profileRoutes);



app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
})

app.listen(Port , ()=>{
    console.log(`App is running at ${Port}`)
})


