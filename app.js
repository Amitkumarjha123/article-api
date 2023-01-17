const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wikiDB");
const wikiSchema = new mongoose.Schema({
  title : String,
  content : String
});

const Article = mongoose.model("Article",wikiSchema);


app.get("/articles", function(req,res){
  Article.find({}, function(err,foundArticles){
    if (!err){
    res.send(foundArticles);
  } else {
    res.send(err);
  }
});
});

app.post("/articles", function(req,res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("No error, successfully added");
    } else {
      res.send(err);
    }
  });

});

app.delete("/articles", function (req, res){
  Article.deleteMany({}, function(err){
    if (!err){
      console.log("Successfully deleted all");
    } else {
      console.log(err);
    }
  });
});

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle}, function(err,foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else {
      console.log("No such article found");
    }
  });
})
.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title :req.body.title, content : req.body.content},

    function(err, updated){
      if (!err){
        res.send("successfully updated");
      } else{
        res.send(err);
      }
    }
  )
})
.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set : req.body},
    function(err,respond){
      if (!err){
        res.send("successfully replaced");
      } else{
        res.send(err);
      }
    }
  )
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle}, function(err){
    if (!err){
      res.send("Sucessfully deleted");
    } else {
      res.send(err);
    }
  });
});



app.listen("3000", function (){
  console.log("Server started on port 3000");
})
