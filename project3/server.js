// Import express
const express = require("express");

// Setting up body parser library
const parser = require("body-parser");
const encodedParser = parser.urlencoded({ extended: true });

// Setting up multer + fs + path
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "assets", "uploads", "images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const uploadProcessor = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Instance of express
const app = express();

// Serve BOTH public/ (styles, app.js, images) and assets/ (uploads)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));

// Setting the templating engine to use ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse form bodies
app.use(encodedParser);

// Data storage
let entries = [];
let reports = [];

// Read all saved entries
const loadEntriesFromFiles = () => {
  const dir = path.join(__dirname, "assets", "uploads", "entries");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const savedEntries = [];

  for (let file of files) {
    try {
      const data = fs.readFileSync(path.join(dir, file), "utf-8");
      const obj = JSON.parse(data);
      savedEntries.push(obj);
    } catch {
    }
  }
  // newest first if createdAt present
  savedEntries.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return savedEntries;
};

// Save JSON object to a subfolder under assets/uploads
const saveJSON = (subdir, payload) => {
  const dir = path.join(__dirname, "assets", "uploads", subdir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const id = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  const filepath = path.join(dir, id + ".json");
  fs.writeFileSync(filepath, JSON.stringify(payload, null, 2));
};

// Routes
app.get("/", (req, res) => {
  res.render("index", { active: "cover" });
});

app.get("/about", (req, res) => {
  res.render("about", { active: "about" });
});

app.get("/add-entry", (req, res) => {
  res.render("add-entry", { active: "add", added: req.query.added == "1" });
});

app.get("/report", (req, res) => {
  res.render("report", { active: "report", sent: req.query.sent == "1" });
});

app.get("/diary", (req, res) => {
  const savedEntries = loadEntriesFromFiles();
  res.render("diary", { active: "diary", entries: savedEntries });
});

// Save new diary entry 
app.post("/entries", uploadProcessor.single("catImage"), (req, res) => {
  let imageUrl = "";
  
  // Check if user uploaded a file
  if (req.file) {
    imageUrl = "/uploads/images/" + req.file.filename;
  } else if (req.body.imageUrl) {
    // Otherwise use the URL they provided
    imageUrl = (req.body.imageUrl || "").trim();
  }

  const entryData = {
    id: Date.now(),
    catName: (req.body.catName || "").trim(),
    photographer: (req.body.photographer || "").trim(),
    location: (req.body.location || "").trim(), 
    imageUrl: imageUrl,
    description: (req.body.description || "").trim(),
    createdAt: Date.now(),
  };

  saveJSON("entries", entryData);
  entries.unshift(entryData);

  res.redirect("/add-entry?added=1");
});

app.post("/reports", (req, res) => {
  const reportData = {
    id: Date.now(),
    name: (req.body.name || "").trim(),
    location: (req.body.location || "").trim(),
    issue: (req.body.issue || "").trim(),
    createdAt: Date.now(),
  };

  saveJSON("reports", reportData);
  reports.unshift(reportData);

  res.redirect("/report?sent=1");
});

app.listen(3000, () => {
  console.log(`Server started on http://localhost:3000`);
});