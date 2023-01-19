const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { send } = require("process");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/wikiDB",()=>{console.log("Connected to wikiDB")});

const articleScheme = new mongoose.Schema({
    title:{
        type:String,
        // require:true
    },
    content:{
        type:String,
        // require:true
    }
});

const Article = mongoose.model("Article", articleScheme);

app.route("/articles")

.get(function(req,res){
    Article.find({},(err,articles)=>{
        if(!err){
            res.send(articles)
            // res.render("articles", {articles:articles})
        }else{
            res.send(err)
        }
    });
})

.post((req,res)=>{
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    Article.findOne({title:req.body.title},(err,article)=>{
        if(!err){
            if(!article){
                newArticle.save(function(err){
                    if(!err){
                        res.send("Object was added")
                    }else{
                        res.send(err)
                    }
                });
            }
        }else{
            console.log(err)
        }
    });
})

.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if(!err){
            res.send("Everything was deleted")
        }else{
            res.send(err)
        }
    });
});

app.route("/articles/:article")
    
.get((req,res)=>{
    Article.findOne({title:req.params.article},(err,foundOne)=>{
        if(!err){
            res.send(foundOne)
        }else{
            res.send(err)
        }
    })
})

.put((req,res)=>{
    Article.replaceOne({title:req.params.article},{title:req.body.title, content:req.body.content},{overwrite:true},(err)=>{
        if(err){
            res.send(err)
        }
    });
})

.patch((req,res)=>{
    Article.updateOne({title:req.params.article},{$set:{title:req.body.title, content:req.body.content}},(err)=>{
        if(err){
            res.send(err)
        }
    });
})

.delete((req,res)=>{
    Article.deleteOne({title:req.params.article},(err)=>{
        if(!err){
            res.send("Article is successfully deleted")
        }
    });
});

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});