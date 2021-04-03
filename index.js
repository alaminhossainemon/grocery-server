const cors = require('cors');
const express = require('express');

const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
require('dotenv').config();

const port = process.env.PORT ||4000;
app.use(cors());

app.use(bodyParser.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g33ro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("grocery").collection("products");
  const orderCollection = client.db("orders").collection("user"); 
 
 app.get('/products', (req, res)=>{
   productCollection.find()
   .toArray((err, product)=>{
    console.log(err);
    res.send(product);
   })
 });
 app.post('/order', (req, res)=>{
   const newOrder =req.body;
   console.log(newOrder);
   orderCollection.insertOne(newOrder)
   .then(result =>{
     console.log('insert',result.insertedCount);
     res.send( result.insertedCount > 0)
   })
 });
 

  app.post('/addProduct',(req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('insert',result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })
  app.delete('/deleteProduct/:id', (req, res) => {
    const id =ObjectID(req.params.id);
    productCollection.deleteOne({_id: id})
    .then(result =>{
       res.send(result);
      })
});



  
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  
})