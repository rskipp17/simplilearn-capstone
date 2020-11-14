// Use Express
var express = require("express");
// Use body-parser
var bodyParser = require("body-parser");
// Use MongoDB
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
// The database variable
var database;
// The products collection
var PRODUCTS_COLLECTION = "products";
// The users collection
var USERS_COLLECTION = "users";

// Create new instance of the express server
var app = express();

// Define the JSON parser as a default way 
// to consume and produce data through the 
// exposed APIs
app.use(bodyParser.json());

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Local database URI.
//const LOCAL_DATABASE = "mongodb://localhost:27017/app";
const LOCAL_DATABASE = "mongodb+srv://ryan:ryan123@cluster0.snr6f.mongodb.net/tcsdb?retryWrites=true&w=majority";
// Local port.
const LOCAL_PORT = 8080;

// Init the server
mongodb.MongoClient.connect(process.env.MONGODB_URI || LOCAL_DATABASE,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }, function (error, client) {

        // Check if there are any problems with the connection to MongoDB database.
        if (error) {
            console.log(error);
            process.exit(1);
        }

        // Save database object from the callback for reuse.
        database = client.db();
        console.log("Database connection done.");

        // Initialize the app.
        var server = app.listen(process.env.PORT || LOCAL_PORT, function () {
            var port = server.address().port;
            console.log("App now running on port", port);
        });
    });

/*  "/api/status"
 *   GET: Get server status
 *  
 */
app.get("/api/status", function (req, res) {
    res.status(200).json({ status: "UP" });
});

/*  "/api/products & users"
 *  GET: finds all products & users
 */
app.get("/api/products", function (req, res) {
    database.collection(PRODUCTS_COLLECTION).find({}).toArray(function (error, data) {
        if (error) {
            manageError(res, err.message, "Failed to get products.");
        } else {
            res.status(200).json(data);
        }
    });
});

app.get("/api/users", function (req, res) {
    database.collection(USERS_COLLECTION).find({}).toArray(function (error, data) {
        if (error) {
            manageError(res, err.message, "Failed to get users.");
        } else {
            res.status(200).json(data);
        }
    });
});

/*  "/api/products & /api/users"
 *   POST: creates a new product & user
 */
app.post("/api/products", function (req, res) {
    var product = req.body;

    if (!product.name) {
        manageError(res, "Invalid product input", "Name is mandatory.", 400);
    } else if (!product.brand) {
        manageError(res, "Invalid product input", "Brand is mandatory.", 400);
    } else if (!product.email) {
        manageError(res, "Invalid product input", "Email is mandatory.", 400);
    } else if (!product.price) {
        manageError(res, "Invalid product input", "Price is mandatory.", 400);
    } else if (!product.availible) {
        manageError(res, "Invalid product input", "Availibility is mandatory.", 400);
    } else {
        database.collection(PRODUCTS_COLLECTION).insertOne(product, function (err, doc) {
            if (err) {
                manageError(res, err.message, "Failed to create new product.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

app.post("/api/users", function (req, res) {
    var user = req.body;

    if (!user.name) {
        manageError(res, "Invalid user input", "Name is mandatory.", 400);
    } else if (!user.email) {
        manageError(res, "Invalid user input", "Email is mandatory.", 400);
    } else if (!user.uname) {
        manageError(res, "Invalid user input", "Username is mandatory.", 400);
    } else if (!user.pwd) {
        manageError(res, "Invalid user input", "Password is mandatory.", 400);
    } else {
        database.collection(USERS_COLLECTION).insertOne(user, function (err, doc) {
            if (err) {
                manageError(res, err.message, "Failed to create new user.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

/*  "/api/products/:id and /api/users/:id"
 *   DELETE: deletes product & user by id
 */
app.delete("/api/products/:id", function (req, res) {
    if (req.params.id.length > 24 || req.params.id.length < 24) {
        manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
    } else {
        database.collection(PRODUCTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
            if (err) {
                manageError(res, err.message, "Failed to delete product.");
            } else {
                res.status(200).json(req.params.id);
            }
        });
    }
});

app.delete("/api/users/:id", function (req, res) {
    if (req.params.id.length > 24 || req.params.id.length < 24) {
        manageError(res, "Invalid user id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
    } else {
        database.collection(USERS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
            if (err) {
                manageError(res, err.message, "Failed to delete user.");
            } else {
                res.status(200).json(req.params.id);
            }
        });
    }
});

/*  "/api/login/:uname"
 *   GET: get pwd of specified uname
 */
app.get("/api/login/:uname", function (req, res) {
    database.collection(USERS_COLLECTION).find({ uname: req.params.uname }).toArray(function (error, data) {
        if (error) {
            manageError(res, error.message, "Failed to get password.");
        } else {
            res.status(200).json(data[0]);
        }
    });
});

/*  "/api/wishList/:uname"
 *   GET: get wishList of specified uname
 */
app.get("/api/wishlist/:uname", function (req, res) {
    database.collection(USERS_COLLECTION).aggregate({ $match: { uname: req.params.uname } }, { $unwind: "$wishList" }).toArray(function (error, data) {
        if (error) {
            manageError(res, error.message, "Failed to get wish list.");
        } else {
            res.status(200).json(data[0].wishList);
        }
    });
});

/*  "/api/wishList/:uname/:product"
 *   POST: add item to wishList of specified uname
 */
app.post("/api/wishlist/:uname", function (req, res) {
    var product = req.body;
    database.collection(USERS_COLLECTION).find({ uname: req.params.uname, wishList: { $elemMatch: product } }).toArray(function (error, data) {
        if (error) {
            manageError(res, error.message, "Failed to find user's wish list.");
        } else {
            console.log(data)
            if (data.length == 0) {
                database.collection(USERS_COLLECTION).updateOne({ uname: req.params.uname }, { $push: { wishList: product } }, function (err, doc) {
                    if (err) {
                        manageError(res, err.message, "Failed to add product to wish list.");
                    } else {
                        res.status(201).json(doc);
                    }
                });
            }
            else{
                manageError(res, "Failed to add product to wish list.");
            }
        }
    });
});

/*  "/api/wishList/:uname/:product"
 *   DELETE: remove item from wishList of specified uname
 */
app.post("/api/wishlist/delete/:uname", function (req, res) {
    var product = req.body;
    database.collection(USERS_COLLECTION).updateOne({ uname: req.params.uname }, { $pull: { wishList: product } }, function (err, doc) {
        if (err) {
            manageError(res, err.message, "Failed to remove product from wish list.");
        } else {
            res.status(201).json(doc);
        }
    });
});


// Errors handler.
function manageError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({ "error": message });
}