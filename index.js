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
    const eventCollection = client.db("Event360").collection("events")
    const serviceCollection = client.db("Event360").collection("services")

    // services related api
    app.get("/services", async (req, res) => {
      const service = await serviceCollection.find().toArray()
      res.send(service)
    })

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(filter)
      res.send(result)
    })
    app.post("/services", async (req, res) => {
      const service = req.body
      const result = await serviceCollection.insertOne(service)
      res.send(result)
    })
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await serviceCollection.deleteOne(filter)
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

      const services = await serviceCollection.updateOne(
        filter,
        updatedService,
        options
      )
      res.send(services)
    })
    // event related api
    app.get("/events", async (req, res) => {
      const service = await eventCollection.find().toArray()
      res.send(service)
    })

    app.get("/events/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await eventCollection.findOne(filter)
      res.send(result)
    })
    app.post("/events", async (req, res) => {
      const event = req.body
      console.log(event)
      const result = await eventCollection.insertOne(event)
      res.send(result)
    })
    app.delete("/events/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await eventCollection.deleteOne(filter)
      res.send(result)
    })

    app.put("/events/:id", async (req, res) => {
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
