
const mysql = require('mysql')
const config = require('../configs/connection');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {response_payload} = require('../methods/global')

/** Create Student */
router.post('/', async (req, res)=>{
    try{
        const connection = await mysql.createConnection(config);
        const sql = 'INSERT INTO student(`student_number`,`student_fname`,`student_lname`,`student_password`) VALUES(?,?,?,?)';
        const hashed_password = await bcrypt.hash(req.body.student_password, 10);
        const student = {
            student_number : req.body.student_number,
            student_fname : req.body.student_fname,
            student_lname : req.body.student_lname,
            student_password : hashed_password
        };

        
        connection.query({
            sql: sql,
            timeout: 5000,
            values: [student.student_number, student.student_fname, student.student_lname, student.student_password]
        }, function (error, results){
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to Insert Data"))
                throw error;
                
            }else{
                res.status(200).send(response_payload(null, "Success", "Successfully Inserted Data"))
            }
        })

        connection.end()
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})

/** Read all student */
router.get('/', async (req, res)=>{
    try{
        const connection = await mysql.createConnection(config);
        const sql = 'SELECT student_number,student_fname,student_lname, student_password FROM student';
        connection.query(sql, (error, results)=>{
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to read Data"))
                throw error;
            }else{
                if(results.length != 0) res.status(200).send(response_payload(results, "Success", "Successfully read Data"))
                else res.status(404).send(response_payload(null, "Error", "There are no data"))
            }
        })
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})


/** Read Specific */
router.get('/:student_number', async (req, res)=>{
    try{
        let stud_num = req.params.student_number
        const connection = await mysql.createConnection(config);
        const sql = 'SELECT student_number,student_fname,student_lname FROM student WHERE `student_number`=?';
        connection.query(sql, stud_num,(error, results)=>{
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to read Data"))
                throw error;
            }else{
                if(results.length != 0) res.status(200).send(response_payload(results, "Success", "Successfully read Data"))
                else res.status(404).send(response_payload(null, "Error", "There is no such student"))
            }
        })

        connection.end()
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})

/** Delete student */
router.delete('/:student_number', async (req, res)=>{
    try{
        let stud_num = req.params.student_number
        const connection = await mysql.createConnection(config);
        const sql = 'DELETE FROM student WHERE `student_number`=?';
        
        connection.query(sql, stud_num,(error, results)=>{
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to delete Data"))
                throw error;
            }else{
                if(results.length != 0) res.status(200).send(response_payload(null, "Success", "Successfully deleted Data"))
                else res.status(404).send(response_payload(null, "Error", "There is no such student"))
            }
        })

        connection.end()
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})

/** Update */
router.put('/:student_number', async (req, res)=>{
    try{
        const student = {
            student_number : req.params.student_number,
            student_fname : req.body.student_fname,
            student_lname : req.body.student_lname
        };
        const connection = await mysql.createConnection(config);
        const sql = 'UPDATE `student` SET `student_fname`=?,`student_lname`=? WHERE `student_number`= ?';
        connection.query({
            sql: sql,
            timeout: 5000,
            values: [student.student_fname, student.student_lname, student.student_number]
        },(error, results)=>{
            if(error){
                res.status(400).send(response_payload(null, "Error", "Failed to update Data"))
                throw error;
            }else{
                if(results.length != 0) res.status(200).send(response_payload(null, "Success", "Successfully updated Data"))
                else res.status(404).send(response_payload(null, "Error", "There is no such student"))
            }
        })

        connection.end()
    }catch{
        res.status(500).send(response_payload(null, "Error", "Server Crashed"))
    }
})

module.exports = router;