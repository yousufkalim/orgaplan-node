const multer = require("multer");

const storage = (field) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${field}`);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

const fileFilter = (filters) => (req, file, cb) => {
  if (filters.some((item) => item === file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Wrong extension type"), false);
  }
};

async function addPathToBody(req, res, next) {
  if (req.files) {
    for (var key in req.files) {
      //  console.log("Key: " + key);
      //     console.log(JSON.stringify(req.files[key], null, 2));

      let files = [];
      Object.entries(
        req.files[key].map((file) => {
          //          console.log(JSON.stringify(item, null, 2));
          return files.push(
            file.path != undefined ? file.path.replace("\\", "/") : null
          );
        })
      );
      req.body["images"] = files;
    }
  }
  if (req.file) req.body["image"] = req.file.path.replace("\\", "/");
  next();
}

const uploadCompany = (folder) =>
  multer({
    storage: storage(folder),
    fileFilter: fileFilter([
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
    ]),
  });

module.exports = (folder, field, type = "single") => {
  return [
    type === "array"
      ? uploadCompany(folder).array(field)
      : type === "fields"
      ? uploadCompany(folder).fields(field)
      : uploadCompany(folder).single(field),
    addPathToBody,
  ];
};
