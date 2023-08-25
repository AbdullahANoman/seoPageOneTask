const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");

//middleWare
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

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

    app.get("/incomplete", async (req, res) => {
      const result = await incompleteCollection.find().toArray();
      res.send(result);
    });

    app.patch("/updateCount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: data,
      };
      const result = await incompleteCollection.updateOne(query, updateDoc, options);
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
