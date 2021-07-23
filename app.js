const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const morgan = require('morgan');
app.use(morgan('dev'));



app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/uploads', express.static('uploads'));


app.use(( req, res, next) =>{
	
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
	"Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	
	if (req.method === 'OPTIONS') {
		
		res.header('Access-Control-Allow-Methods',
			       'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});

		}

        next();
	});



const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.hccy1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                 {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
		         }
		         );



app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);



app.use((req, res, next)=>{

	const error = new Error('Not Found');
	error.status = 404;
	next(error);

});

app.use((error, req, res, next)=>{
	
	res.status(error.status || 500);
	res.json({
		error: {
			message : error.message
			}
	});
	

});

module.exports = app;
