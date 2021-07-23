const express = require('express');
const router = express.Router();


const mongoose = require('mongoose');
const Product = require('../models/product');


const multer = require('multer');


const storage = multer.diskStorage({
	
	destination: function(req, file, cb){
		cb(null, './uploads/');
		},
	
	filename: function(req, file, cb){
		cb(null, Date.now() + file.originalname);
	}
	});


const fileFilter = (req, file, cb) => {
	
		if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
			
			cb(null, true);	
			
			}
		else {
			cb(null, false);
			}
		
		};

const upload = multer({ 
	storage : storage, 
	//accept files up to 5MB
	limits : {fileSize : 1024 * 1024 * 5},
	fileFilter : fileFilter
});



const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');


router.get("/", ProductsController.products_get_all);

router.get('/:productId', (req, res, next) => {
	
	const id = req.params.productId;
	Product.findById(id)
	.exec()
	.then(doc => {
		console.log(doc);
		res.status(200).json(doc);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error : err});
	});
	
});







router.post('/', checkAuth, upload.single('productImage') ,(req, res, next) => {
	
	console.log(req.file);
	// create a product as a javascript object
	
	const product = new Product({
		id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		price : req.body.price,
		productImage : req.file.path,
	});

	product.save().then(result => {
		
		console.log(result);
        res.status(201).json({
            message: ' Product Created ',
            createdProduct : product
                });
	
	})
	.catch(err => {
        
        console.log(err)
        res.status(500).json({error : err});
    
    });

	
});


router.patch('/:productId', (req, res, next) => {
	
	const id = req.params.productId;
	
     Product.findByIdAndUpdate(id, { $set: req.body }, { new: true})
    .then(result => res.status(200).json(
        {
            message : 'Product Updated',
            request : {
                type : 'GET',
                url : 'http://localhost:3000/products/' + id
            }
        }

        
        ))
    .catch(err => res.status(500).json({ error: err}))
});




router.delete('/:productId', (req, res, next) => {
	
	const id = req.params.productId;
	Product.remove({_id : id})
	.exec()
	.then(result =>{
		
		console.log(result);
		res.status(200).json({
            message : 'Product Deleted'
        });
	
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error : err});
	});

});


module.exports = router;
