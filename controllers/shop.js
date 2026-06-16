const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find().then(products=>{
   res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
  }
  ).catch(err=>console.log(err))
};

// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findAll({where:{id:prodId}}).then(
//     products=>{
//       res.render('shop/product-detail', {
//         product: products[0],
//         pageTitle: products[0].title,
//         path: '/products'
//       });
//     }
//   ).catch(err => console.log(err));
//   // Product.findByPk(prodId)
//   //   .then((product) => {
//   //     res.render('shop/product-detail', {
//   //       product: product,
//   //       pageTitle: product.title,
//   //       path: '/products'
//   //     });
//   //   })
//   //   .catch(err => console.log(err));
// };
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
 Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
  }
exports.getIndex = (req, res, next) => {
  Product.find().then(products=>{
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      }); 
  }
  ).catch(err=>console.log(err))

};

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')//will fetch all product details inside productId object
  .then(user=>{
    console.log(user.cart.items)
    const products=user.cart.items
    res.render('shop/cart', {
         path: '/cart',
         pageTitle: 'Your Cart',
         products: products
       });
  }).catch(err=>console.log(err))
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product=>{
    return req.user.addToCart(product)
  }).then(result=>{
    console.log(result)
    res.redirect("/cart")
  })
  // let fetchedCart;
  // let newQuantity=1
  // // Product.findById(prodId, product => {
  // //   Cart.deleteProduct(prodId, product.price);
  // //   res.redirect('/cart');
  // // });
  // req.user.getCart().then(
  //   cart=>{
  //     fetchedCart=cart;
  //     return cart.getProducts({where:{id:prodId}})
  //   }).then(
  //     products=>{
  //       let product;
  //       if(products.length>0){
  //         product=products[0]
  //       }
        
  //       if(product){
  //         const oldQuantity=product.cartItem.quantity;
  //         newQuantity=oldQuantity+1
  //         return product;
  //       }
        
  //       return Product.findByPk(prodId).then(product=>{
  //         return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})
  //       }

  //       ).catch(err=>console.log(err))
  //     }
  // ).then(product=>{
  //   return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})
  // }).then(()=>{
  //   res.redirect("/cart")
  // })
  // .catch(err=>console.log(err))
  // // Product.findById(prodId, product => {
  // //   Cart.addProduct(prodId, product.price);
  // // });
  // // res.redirect('/cart');

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
  req.user.removeFromCart(prodId)
  .then(result=>{
    res.redirect("/cart")
  }).catch(err=>console.log(err))
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
  .then(orders=>{
    console.log(orders)
      res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders:orders
  });
  }).catch(err=>console.log(err))

};

exports.postOrder=(req,res,next)=>{
  req.user
  .populate('cart.items.productId')//will fetch all product details inside productId object
  .then(user=>{
    console.log(user.cart.items)
    const products=user.cart.items.map(i=>{
      return {
        product:{...i.productId._doc},//to pull out all data in the document we retrieved
        quantity:i.quantity
      }
    })
    const order=new Order({
      user:{
      name:req.user.name,
      userId:req.user//mongoose will take id auto
    },
      products:products,
    })
    return order.save()
}).then(result=>{
  return req.user.clearCart()
}).then(()=>{
  res.redirect("/orders")
}).catch(err=>console.log(err))
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
