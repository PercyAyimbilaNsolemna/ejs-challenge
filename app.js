//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const lodash = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connects to mongodb 
const URL = 'mongodb+srv://<userName>:<Password>@cluster0.az84zbp.mongodb.net/blogDB?retryWrites=true&w=majority';
mongoose.connect(URL);
console.log('Successfully connected to mongodb');

//Creates a post schema
const postsSchema = {
  title: String,
  body: String
}

//Defines a model for the schema
const Post = mongoose.model('Post', postsSchema);

//Creates a get method for the various posts 
app.get('/posts/:postId', async function(req, res) {
  let requestedPostId = req.params.postId;
  const requestedPost = await Post.findById(requestedPostId).exec();
  //Throw an error if the message is not found
  res.render('post', {
      postTitle: requestedPost.title,
      postBody: requestedPost.body
  });
});
//Creates a get method for the home/root route
app.get('/', async function(req,res) {
  const foundPosts = await Post.find({}).exec();
  res.render('home', {
    homeStartingContent: homeStartingContent, 
    posts: foundPosts
  });
});

//Creates a get method for the about route
app.get('/about', function(req, res) {
  res.render('about', {aboutContent: aboutContent});
});

//Creates a get method for the contact route
app.get('/contact', function(req, res) {
  res.render('contact', {contactContent: contactContent});
});

//Creates a get method for the compose route
app.get('/compose', function(req, res) {
  res.render('compose');
})

//Creates a post method for the compose route
app.post('/compose', async function(req, res) {

  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  //Adds every new post to the posts array
  const newPost = new Post({
    title: postTitle,
    body: postBody
  })
  await newPost.save();
  res.redirect('/');

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
