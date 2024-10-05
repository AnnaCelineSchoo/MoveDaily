import express from "express";
import axios from "axios";
import bodyParser from "body-parser"


const app = express();
const port =3000;

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.render("index.ejs")
});

const data = {
    "language" : 2,
    "equipment" : 7
}

const training_schedule = {
    1: {"sets": 3, "reps": "12-15", "rest_time": "60-90 seconds"},
    2: {"sets": 3, "reps": "12-15", "rest_time": "60-90 seconds"},
    3: {"sets": 4, "reps": "10-12", "rest_time": "60-90 seconds"},
    4: {"sets": 4, "reps": "8-10", "rest_time": "90 seconds"},
    5: {"sets": 5, "reps": "6-8", "rest_time": "90 seconds"},
    6: {"sets": 3, "reps": "10-12", "rest_time": "60-90 seconds"},
    7: {"sets": 4, "reps": "10-12", "rest_time": "60-90 seconds"},
    8: {"sets": 4, "reps": "8-10", "rest_time": "90 seconds"},
    9: {"sets": 5, "reps": "6-8", "rest_time": "90-120 seconds"},
    10: {"sets": 5, "reps": "3-5", "rest_time": "90-120 seconds"},
}

const exercises = {};

app.post("/excersises", async (req, res) =>{
    try{
    const weekNr = req.body.week;
    const response = await axios.get("https://wger.de/api/v2/exercise/?language=2&equipment=4,7");
    const result = response.data.results;
    // add 10 excersises incl description 
    while (Object.keys(exercises).length < 10){ 
        const excersise = result[Math.round(Math.random() * result.length)];
        const excersiseName = excersise.name;
        const excersiseDescription = excersise.description.replace(/\n/g, ' ').replace((/&nbsp;/g, ' ')).trim();
        //console.log(excersise)
        if (!exercises.hasOwnProperty(excersiseName)){
            exercises[excersiseName] = excersiseDescription;
        }
    }
    //console.log(exercises) 
    res.render("index.ejs", {
        activityDict:exercises,
        reps: training_schedule[weekNr]["reps"],
        sets: training_schedule[weekNr]["sets"],
        restTime: training_schedule[weekNr]["rest_time"],
        weekNr: weekNr
    })
    }
    catch (error){
        console.log(error.response ? error.response.data : error.message);
        res.status(500).send("An error occurred while fetching exercises.");
    }
    
})

app.post("/information", async (req,res) =>{
    const excersiseName = req.body.exerciseName;
    const descrption = exercises[excersiseName];
    res.render("information.ejs", {
        exerciseInfo : descrption
    })
})

app.listen(port, async () => {
    console.log(`app listening on port ${port}`)
}
);