
const mysql = require('mysql')
const config = require('../configs/connection');
const express = require('express');
const router = express.Router();


const {response_payload} = require('../methods/global')


/** INSERT DATA Health Check */
router.post('/', async (req, res)=>{
    try{
        const connection = await mysql.createConnection(config);
        const sql = 'INSERT INTO health_check(`student_number`,`temp`,`fever`,`cough`,`body_pain`,`sore_throat`,`tiredness`,`headache`,`diarrhea`,`ageusia`,`anosmia`,`dyspnea`,`dizziness`,`cold`,`acquired_symptoms`,`covid_interaction`,`caring_infected_patient`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        const health_check = {
            student_number : req.body.student_number,
            temp : req.body.temp,
            fever : req.body.fever,
            cough : req.body.cough,
            body_pain : req.body.body_pain,
            sore_throat: req.body.sore_throat,
            tiredness : req.body.tiredness,
            headache : req.body.headache,
            diarrhea : req.body.diarrhea,
            ageusia : req.body.ageusia,
            anosmia : req.body.anosmia,
            dyspnea : req.body.dyspnea,
            dizziness : req.body.dizziness,
            cold : req.body.cold,
            acquired_symptoms : req.body.acquired_symptoms,
            covid_interaction : req.body.covid_interaction,
            caring_infected_patient : req.body.caring_infected_patient
        };

        connection.query({
            sql: sql,
            timeout: 5000,
            values: [health_check.student_number, health_check.temp, health_check.fever, health_check.cough, health_check.body_pain, health_check.sore_throat, health_check.tiredness,health_check.headache, health_check.diarrhea, health_check.ageusia, health_check.anosmia, health_check.dyspnea, health_check.dizziness, health_check.cold, health_check.acquired_symptoms, health_check.covid_interaction, health_check.caring_infected_patient]
        }, function (error, results){
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to Insert Data"))
                throw error;
                
            }else{
                res.status(200).send(response_payload(null, "Success", "Successfully Inserted Data"))
            }
        })
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})


router.get('/', async (req, res)=>{
    try{
        const connection = await mysql.createConnection(config);
        const sql = 'SELECT * FROM health_check';
        connection.query(sql, (error, results)=>{
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to read Data"))
                throw error;
            }else{
                if(results.length != 0) res.status(200).send(response_payload(results, "Success", "Successfully Retrieved Data"))
                else res.status(404).send(response_payload(null, "Error", "Unable to Retrieved Data"))
            }
        })
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})

//SPECIFIC
router.get('/:student_number', async (req, res)=>{
    try{
        let stud_num = req.params.student_number;
        const connection = await mysql.createConnection(config);
        const sql = 'SELECT * FROM health_check WHERE `student_number`=?';
        connection.query(sql, stud_num,(error, results)=>{
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to read Data"))
                throw error;
            }else{
                if(results.length != 0) res.status(200).send(response_payload(results, "Success", "Successfully Retrieved Data"))
                else res.status(404).send(response_payload(null, "Error", "Unable to Retrieved Data"))
            }
        })
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})




module.exports = router;