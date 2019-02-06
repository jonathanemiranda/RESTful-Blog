let port = 1337, 
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
express = require("express"),
app = express();


//APP CONFIG
mongoose.connect("mongodb+srv://jonathanemiranda:jaxheW-fowsyt-vyhqo8@jonathanemiranda-ozsyo.mongodb.net/restful_blog_app?retryWrites=true");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");


//MONGOOSE/SCHEMA CONFIG
let blogSchema = new mongoose.Schema({
	title: String,
	image: String, 
	body: String,
	created: {type: Date, default: Date.now} 
});
let Blog = mongoose.model("Blog", blogSchema);


//////////////ROUTES////////////////

app.get("/", function(req, res){
	res.redirect("/blogs");
});


//INDEX ROUTE
app.get("/blogs", function(req, res){
	//GET ALL BLOG POSTS FROM DB
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index", {blogs: blogs});			
		}
	});
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
	//Sanitize and create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else{
			//Redirect to index
			res.redirect("blogs");
		}
	})
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findOneAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findOneAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});



//LISTENER
app.listen(port, function(){
	console.log("The RESTful Blog App server has started");
});





