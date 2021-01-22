import express, {Request,Response,NextFunction} from 'express';
import {ProductModel} from '../models/Product';
import multer from 'multer';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

var path = require('path')

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
});


const fileFilter = (req: any,file: any,cb: any) => {
  var ext = path.extname(file.originalname)
  if (ext === '.png' || ext === '.jpg' || ext === '.pdf' || ext === '.jpeg' || ext === '.mp4' || ext === '.mp3') 
  {     
    // return cb(null,true);
    cb(null, true);

  }else{
    cb('Only media files are allowed!');
  }
}


//var upload = multer({dest:'./uploads/'});

router.post('/',async(req: Request,res:Response) => {
   // let upload = multer({storage: storage, fileFilter : fileFilter});
   let upload = multer({ storage: storage, fileFilter: fileFilter }).single('data');

    function baseName(str:any) {
        var base = new String(str).substring(str.lastIndexOf('/') + 1); 
        if(base.lastIndexOf(".") != -1) {
            base = base.substring(0, base.lastIndexOf("."));
        }            
        return base;
    }
     upload(req, res, async (err: any) => {

            if (err) {             
                res.status(422).send({ message: err });

            }else{

                let newProduct = new ProductModel({
                    data: req.file
                });
                var file_ext = path.extname(req.file.originalname);
    
                /** PIXEL CONVERSION */
                var args = [req.file.originalname];

                args.forEach(async function (val, index, array) {
                    var filename = val;
                    var basename = baseName(filename);

                    /** 1. IMAGE PIXEL SPLIT */
                    if (file_ext === '.png' || file_ext === '.jpg' || file_ext === '.jpeg') {
                        ffmpeg(`./uploads/` + filename)
                            .size('640x480') // .aspect("9:16")        
                            .output(basename + '-640x480.' + file_ext)
                            .on('error', function (err: any) {
                                console.log('An error occurred: ' + err.message);
                            })
                            .on('progress', function (progress: any) {
                                console.log('... frames: ' + progress.frames);
                            })
                            .on('end', function () {
                                console.log('Finished processing');
                            })
                            .run();
                    }

                    /** 2. VIDEO PIXEL SPLIT */
                    if (file_ext === '.mp4') {
                        await ffmpeg(`./uploads/` + filename)
                            // Generate 1440 video
                            // .output(basename + '-2560 x 1440.mp4')
                            // .videoCodec('libx264')
                            // .size('2560x1440')
                            // Generate 720P video
                            // .output(basename + '-1280x720.mp4')
                            // .videoCodec('libx264')
                            // .size('1280x720')
                            // Generate 480P video
                            .output(basename + '-640x480.mp4')
                            .videoCodec('libx264')
                            // .noAudio()
                            .size('640x480')

                            .on('error', function (err: any) {
                                console.log('An error occurred: ' + err.message);
                            })
                            .on('progress', function (progress: any) {
                                console.log('... frames: ' + progress.frames);
                            })
                            .on('end', function () {
                                console.log('Finished processing');
                            })
                            .run();
                    }

                    /** 3.PDF UPLOAD */
                    // if (file_ext === '.pdf') {
                    //     sharp(`./uploads/` + filename)
                    //     .resize(320, 240)
                    //     .toFile('output.pdf',function (err: any) { 
                    //         if(err){
                    //             console.log(err)
                    //             console.log("eeeeeeee")
                    //         }else{
                    //             console.log("nooooooooo")
                    //         }
                    //     });
                                             
                    // }

                    
                   
                });
              
                await newProduct.save();            
                res.send(newProduct);
                

            }   
           
    });
    

});
export {router as ProductRoutes};

