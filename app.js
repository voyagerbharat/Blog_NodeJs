var express=require("express");
var app=express();

var override=require("method-override");
app.use(override("_method"));


var bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

var sanitize=require("express-sanitizer");
app.use(sanitize());

var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/blogs', {useNewUrlParser: true , useUnifiedTopology:true});

app.use(express.static('public'));

var Schema = mongoose.Schema({
	title:String,
	image:String,
	body:String,
	Date:{type:Date,default:Date.now}
});

var blogs=mongoose.model("blogs",Schema);

// blogs.create({
// 	title:"first trip of colg",
// 	image:"https://storage.googleapis.com/ehimages/2017/5/22/img_8c17f91cb552f8c6317848c62d5d845e_1495437964906_processed_original.jpg",
// 	body:"it was an amazing exp",
// });

app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	blogs.find({},function(err,blogs){
		if(err){console.log(err);}
		else{
			res.render("index.ejs",{blogs:blogs});
		}
	})
});

app.get("/blogs/new",function(req,res){
	res.render("new.ejs");
});

app.post("/blogs",function(req,res){
		req.body.blog.body= req.sanitize(req.body.blog.body);
	blogs.create(req.body.blog,function(err,newblog){
		if(err){
			res.render("new.ejs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id",function(req,res){
	
	blogs.findById(req.params.id,function(err,found){
		if(err){
			console.log(err);
		}
		else{
			res.render("show.ejs",{blog:found});
          }
		
	});	
});

app.get("/blogs/:id/edit",function(req,res){
	blogs.findById(req.params.id,function(err,found){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit.ejs",{blog:found});
          }});
	
});

app.put("/blogs/:id",function(req,res){
	
	req.body.blog.body= req.sanitize(req.body.blog.body);
	blogs.findByIdAndUpdate(req.params.id,
        req.body.blog, function(err,update){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
})

app.delete("/blogs/:id",function(req,res){
	
	blogs.findByIdAndRemove(req.params.id,function(err){
		if(err){res.redirect("/blogs");}
		else{
			res.redirect("/blogs");
		}
	});
	
});


app.listen(3000,function(){
	console.log("Blog Server is running");
});
	
	
	
	
	
	