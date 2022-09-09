import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import 'dotenv/config'
import functions from "firebase-functions"
import { Message } from 'firebase-functions/v1/pubsub'


const client = new MongoClient (process.env.MONGO_URI)
const database = client.db('backend-app-node')
const activities = database.collection('activity')





// const timestamp =FieldValue.serverTimeStamp();
// const newMessage = {...message, timestamp}   






client.connect()
console.log('Mongo connected')

const app = express()
app.use(cors())
app.use(express.json())

app.listen(4040, () => console.log('api listening on port 4040'))


app.get('/activity', async (req, res) => {
   const allActivities = await (await (await activities.find().toArray()).reverse())
   res.send(allActivities)
})

app.post('/activity/postactivity', async (req, res) => {
    
    await activities.insertOne(req.body )
    res.send({'Item was added to Mongo': true})
})

app.delete('/activity/deleteactivity', async (req, res) => {
    await activities.findOneAndDelete(req.query)
    res.send({'Item deleted': true})
})


app.patch('/activity/updateactivity/:id', async (req, res) => {
    
    const id = req.params.id 

    const result = await activities.findOneAndUpdate({_id: new ObjectId(id)}, {$set: req.body})

    res.send(result.value)
})


export const api = functions.https.onRequest(app)



//Post
//delete
//put