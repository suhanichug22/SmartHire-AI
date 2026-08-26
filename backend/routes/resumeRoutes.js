const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const Resume = require("../models/Resume");

const router = express.Router();



// =======================
// Multer Setup
// =======================

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },


    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);
    }

});


const upload = multer({
    storage
});





// =======================
// Upload Resume
// =======================

router.post(
    "/upload",
    upload.single("resume"),
    async(req,res)=>{

        try{


            if(!req.file){

                return res.status(400).json({

                    message:"Please select resume"

                });

            }



            const resume = await Resume.create({

                userId:req.body.userId,

                fileName:req.file.filename,

                filePath:req.file.path

            });



            res.status(201).json({

                message:"Resume uploaded successfully",

                resume

            });



        }
        catch(error){

            res.status(500).json({

                message:error.message

            });

        }


    }
);







// =======================
// Get Latest Resume
// =======================

router.get("/latest/:userId",async(req,res)=>{


    try{


        const resume = await Resume.findOne({

            userId:req.params.userId

        })
        .sort({

            uploadedAt:-1

        });



        if(!resume){

            return res.status(404).json({

                message:"No resume found"

            });

        }



        res.json({

            resume

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }


});









// =======================
// Analyze Resume
// =======================

router.get("/analyze/:resumeId",async(req,res)=>{


    try{


        const resume = await Resume.findById(
            req.params.resumeId
        );



        if(!resume){

            return res.status(404).json({

                message:"Resume not found"

            });

        }



        const dataBuffer = fs.readFileSync(
            resume.filePath
        );



        const parser = new PDFParse({

            data:dataBuffer

        });



        const data = await parser.getText();



        const text = data.text.toLowerCase();



        console.log("PDF TEXT:",text);





        const skillsList=[

            "react",
            "javascript",
            "html",
            "css",
            "node",
            "express",
            "mongodb",
            "sql",
            "java",
            "python",
            "c++",
            "dsa",
            "git",
            "github",
            "tailwind",
            "typescript"

        ];




        let skills=[];



        skillsList.forEach((skill)=>{


            if(text.includes(skill)){

                skills.push(skill);

            }


        });





        let score = skills.length * 10;



        if(score>100){

            score=100;

        }




        res.status(200).json({

            message:"Resume analyzed successfully",

            score,

            skills,

            extractedText:text.substring(0,500),

            resumeId:resume._id,

            fileName:resume.fileName

        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            message:error.message

        });


    }


});







module.exports = router;