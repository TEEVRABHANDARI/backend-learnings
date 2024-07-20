import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname) //original name ki file jo user ne bheja hai
    }
  })
  
export const upload = multer({ storage, })