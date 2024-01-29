const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fomplst.mongodb.net/?retryWrites=true&w=majority`

const uri =
  "mongodb+srv://coffee:MP1NDYJAyDS6MS2i@cluster0.fomplst.mongodb.net/?retryWrites=true&w=majority"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    await client.connect()
    const eventCollection = client.db("Event360").collection("services")

    // services related api
    app.get("/services", async (req, res) => {
      const service = await eventCollection.find().toArray()
      res.send(service)
    })

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await eventCollection.findOne(filter)
      res.send(result)
    })
    app.post("/services", async (req, res) => {
      const service = req.body
      const result = await eventCollection.insertOne(service)
      res.send(result)
    })


    app.put("/services/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const newService = req.body
      console.log(newService)
      const options = { upsert: true }
      const updatedService = {
        $set: {
          name: newService.name,
          title: newService.title,
          subtitle: newService.subtitle,
          topservicetitle: newService.topservicetitle,
          topserviceDescription: newService.topserviceDescription,
          whatWedoDescription: newService.whatWedoDescription,
          productsDescription: newService.productsDescription,
          image: newService.image,
          description: newService.description,
        },
      }

      const services = await eventCollection.updateOne(
        filter,
        updatedService,
        options
      )
      res.send(services)
    })
    //  signle services api
    app.get("/singleservices", async (req, res) => {
      const result = await singleServiceCollection.find().toArray()
      res.send(result)
    })

    app.get("/single/services/:id", async (req, res) => {
      const id = req.params.id
      console.log(id)
      const filter = { _id: new ObjectId(id) }
      const result = await singleServiceCollection.findOne(filter)
      res.send(result)
    })

    app.post("/seo", async (req, res) => {
      const { name } = req.body
      const filter = { name }
      const result = await aboutCollection.findOne({ filter })
      console.log(result)
      res.send(result)
    })

    app.post("/singleservices", async (req, res) => {
      const service = req.body
      const result = await singleServiceCollection.insertOne(service)
      res.send(result)
    })
    app.put("/singleservices/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const newSingleServices = req.body
      const options = { upsert: true }
      const updatedSingleServices = {
        $set: {
          category: newSingleServices.category,
          title: newSingleServices.title,
          subtitle: newSingleServices.subtitle,
          image: newSingleServices.image,
          description: newSingleServices.description,
        },
      }

      const services = await singleServiceCollection.updateOne(
        filter,
        updatedSingleServices,
        options
      )
      res.send(services)
    })
    app.delete("/singleservices/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await singleServiceCollection.deleteOne(filter)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 })
    console.log(" You successfully connected to MongoDB!")
  } finally {
  }
}
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Event-360 is running now  ")
})

app.listen(port, () => {
  console.log("Event-360 is running now ")
})
