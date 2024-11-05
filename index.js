const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.get(express.json());

app.get('/', (req,res) => {
    res.send('coffee making server is running')
})
app.listen(port,()=>{
    console.log(`coffee server is running on port:${port}`)
})