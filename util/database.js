const mongodb = require('mongodb');
const MongoClient=mongodb.MongoClient
let _db;
const mongoConnect=callback=>{
MongoClient.connect('mongodb+srv://sarkartrisha200_db_user:iSDaFHcqvBktUSpw@cluster0.dlu2ota.mongodb.net/shop?appName=Cluster0')
.then(client=>{
console.log('Connected')
_db=client.db()
callback()
}).catch(err=>{
    console.log(err)
    throw err;
})
}
const getDb=()=>{
    if(_db){
        return _db;
    }
    throw "No connection found"
}
exports.mongoConnect=mongoConnect
exports.getDb=getDb