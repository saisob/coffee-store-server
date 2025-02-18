const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yj3a8.mongodb.net/coffee?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a new collection 
    const coffeeCollection = client.db('coffees').collection('coffee');

    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee, { new: true });
      res.send(result);

      //   res.status(201).json({
      //     success: true,
      //     message: "Coffee added successfully!",
      //     data: { _id: result.insertedId, ...newCoffee }
      // });

    })

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee);
      res.send(result);
    })

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // app.get("/a",async(req,res)=>{
    //   const result = await coffeeCollection.find().toArray();
    //   console.log(result)
    //   res.send(result);
    // })

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      // console.log(id);
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    // mongodb delete a document operatin 
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// middleware 
app.use(cors());
app.get(express.json());

app.get('/', (req, res) => {
  res.send('coffee making server is running')
})
app.listen(port, () => {
  console.log(`coffee server is running on port:${port}`)
})
