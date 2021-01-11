const multer = require("multer");

const storageCompany = (field) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${field}`);
    },
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      let filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
  });

const uploadCompany = multer({
  storage: storageCompany("company"),
});

const addFilesToBody = (req, res, next) => {
  if (req.files)
    req.body["images"] = req.files.map((file) => file.path.replace("\\", "/"));

  if (req.file) req.body["image"] = req.file.path.replace("\\", "/");
  next();
};

module.exports = (field) => {
  return {
    uploadCompany: [uploadCompany.single(field), addFilesToBody],
  };
};
