const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");

require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleWare
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file?.originalname}`);
  },
});

const upload = multer({ storage: storage });
//mYF9KUWYHvQWdgJG
//seopageone

const uri =
  "mongodb+srv://seopageone:mYF9KUWYHvQWdgJG@cluster0.r3tx4xp.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const incompleteCollection = client
      .db("seoPageOne")
      .collection("incomplete");
    const todoCollection = client.db("seoPageOne").collection("todo");
    const doingCollection = client.db("seoPageOne").collection("doing");
    const completedCollection = client.db("seoPageOne").collection("completed");
    const uploadDataCollection = client.db("seoPageOne").collection("files");
    const underReviewCollection = client
      .db("seoPageOne")
      .collection("underReview");
    app.get("/incomplete", async (req, res) => {
      const result = await incompleteCollection.find().toArray();
      res.send(result);
    });

    app.get("/todo", async (req, res) => {
      const result = await todoCollection.find().toArray();
      res.send(result);
    });

    app.get("/doing", async (req, res) => {
      const result = await doingCollection.find().toArray();
      res.send(result);
    });

    app.get("/underReview", async (req, res) => {
      const result = await underReviewCollection.find().toArray();
      res.send(result);
    });
    app.get("/completed", async (req, res) => {
      const result = await completedCollection.find().toArray();
      res.send(result);
    });
    app.patch("/updateIncompleteCount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await incompleteCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.patch("/updateToDoCount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await todoCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });
    app.patch("/updateDoingCount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await doingCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });
    app.patch("/updateReviewCount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await underReviewCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.post("/upload", upload.array("uploaded file", 12), async (req, res) => {


      let data;
      if (req.files) {
        let path = "";
        req.files.forEach(function (files, index, arr) {
          path = path + files.path + ",";
        });
        path = path.substring(0, path.lastIndexOf(","));
        data = path;
      }


      const path = { path: data };

      const result = await uploadDataCollection.insertOne(path);
      return res.send(result);
    });
    app.patch("/updateCompletedCount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await completedCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SeoPageOne is running..");
});

app.listen(port, () => {
  console.log(`SeoPageOne running on port ${port}`);
});
