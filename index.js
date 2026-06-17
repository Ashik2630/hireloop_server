const express = require('express');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = process.env.MONGODB_URI;

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
    // await client.connect();
    
    const database = client.db('hireloopDB');
    const jobsCollection = database.collection('jobs');


    app.get('/api/jobs', async (req, res)=> {
      const query = {};
      
      if(req.query.companyId){
        query.companyId = req.query.companyId;
      }

      if(req.query.status){
        query.status = req.query.status;
      }

      const cursor = jobsCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    })


    app.post('/api/jobs', async (req, res)=> {
      const job = req.body;
      const result = await jobsCollection.insertOne(job);
      res.json(result);
    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})