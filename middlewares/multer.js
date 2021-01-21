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
    let files = [];
    Object.entries(req.files).map((item) =>
      files.push({
        [item[0]]: item[1].map((file) => file.path.replace("\\", "/")),
      })
    );
    req.body["images"] = files;
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
