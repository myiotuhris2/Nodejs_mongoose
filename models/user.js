const {ObjectId}=require('mongodb')
const mongodb=require('mongodb')
const getDb = require('../util/database').getDb;
class User{
constructor(username,email,cart,id){
    this.username=username
    this.email=email
    this.cart=cart?cart: { items: [] }; 
    this._id=id
}
addToCart(product){
const rawItems = this.cart && this.cart.items ? this.cart.items : [];
const cartItems = Array.isArray(rawItems) ? rawItems : Object.values(rawItems);
const cartIndex=cartItems.findIndex(cp=>{return cp.productId.toString()===product._id.toString()})
const updatedCartItems=[...cartItems]
let updatedQuantity=1
if(cartIndex>=0){
updatedQuantity=cartItems[cartIndex].quantity+1
updatedCartItems[cartIndex].quantity=updatedQuantity
}else{
    updatedCartItems.push({productId:new ObjectId(product._id),quantity:updatedQuantity})
}
const updatedCart={items:updatedCartItems}
const db=getDb()
db.collection('users').updateOne(
    {_id:new ObjectId(this._id)},
    {$set:{cart:updatedCart}}
)
}
save(){
const db=getDb()
return db.collection('users').insertOne(this)
}
getCart(){
    const db=getDb()
    const productIds=this.cart.items.map(i=>{return i.productId})
    return db.collection('products')
    .find({_id:{$in:productIds}}).toArray()
    .then(products=>{
        return products.map(p=>{
            return{
                ...p,
                quantity:this.cart.items.find(i=>{
                    return i.productId.toString()===p._id.toString()
                }).quantity
            }
        })
    })
}
addOrder(){
    const db=getDb()
    return this.getCart()
    .then(products=>{
        const order={items:products,
            user:{
                _id:new ObjectId(this._id),
                name:this.username
            }
        }
        return db.collection('orders').insertOne(order)
    })
    .then(result=>{
        this.cart={items:[]}
        return db.collection('users')
        .updateOne(
            {_id:new ObjectId(this._id)},
            {$set:{cart:{items:[]}}}
        )}
    )
}
getOrders(){
    const db=getDb()
    return db.collection('orders').find({'user._id':new ObjectId(this._id)}).toArray()
}
deleteItemFromCart(productId){
    var updatedCart=this.cart.items.filter(i=>{
        return i.productId.toString()!==productId.toString()
    })
    const db=getDb()
 return db.collection('users').updateOne(
    {_id:new ObjectId(this._id)},
    {$set:{cart:{items:updatedCart}}}
)
}
static findById(userId){
    const db=getDb()
    return db.collection('users').findOne({_id:new mongodb.ObjectId(userId)})
}
}
module.exports=User