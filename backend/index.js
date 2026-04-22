import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from "dotenv";
dotenv.config();

const app = express()
app.use(
    cors({
     origin: 'http://localhost:3000'
    })
)

// s3 client 

const s3 = new S3Client({
     region: process.env.AWS_REGION,
     credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
     }
})


// MULTER - MEMORY STORAGE 5 MB limit pdf only 

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter:( req, file, cb) => {
        if(file.mimetype === 'application/pdf'){
            cb(null,true)
        } else {
            cb(new Error('only PDF files are allowed'),false)
        }
    },

})

// upload route 

app.post("/post" , upload.single('file'), async(req,res) => {

      try {
        if(!req.file){
            return res.status(400).json({error: 'No file uploaded '})
        }

         
        const fileName = `uploads/${uuidv4()}-${req.file.originalname}`
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: 'application/pdf'
        })

        await s3.send(command)

        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        
        res.status(200).json({success:true, fileUrl, fileName})
      } catch (err) {
         res.status(500).json({error: err.message})
      }
})

app.get("/status", async (req, res) => {
  try {
    const fileName = req.query.fileName 
    const redactedKey = fileName.split('/').pop()

    await s3.send(new HeadObjectCommand({
      Bucket: process.env.S3_DEST_BUCKET,
      Key: redactedKey
    }))

    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.S3_DEST_BUCKET,
        Key: redactedKey,
        ResponseContentDisposition: `attachment; filename="${redactedKey}"`
      }),
      { expiresIn: 500 }
    )

    res.json({ ready: true, url })

  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return res.json({ ready: false })
    }
    res.status(500).json({ error: err.message })
  }
})


// multer error handler 

app.use(( err,req,res,next) => {
      
     if(err.code === 'LIMIT_FILE_SIZE'){
         return res.status(400).json({error: "file is to large. Max size is 5 MB "})
     }
     res.status(400).json({error: err.message})

} )

app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT} `))