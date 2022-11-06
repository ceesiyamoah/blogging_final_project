const express = require('express');
const passport = require('passport');
const { getAllBlogs, getBlog, createNewBlog, updateBlog, getMyBlogs, deleteBlog } = require('../controllers/blogs');
const { checkIfBlogAuthor } = require('../middleware');
const BlogModel = require('../models/blogs');

const blogRouter = express.Router({ mergeParams: true });
// blogRouter.use((req, res, next) => {
// 	console.log(req.url);
// });

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', getBlog);

//*Routes that require authentication
blogRouter.use(passport.authenticate('jwt', { session: false }));
blogRouter.post('/', createNewBlog);

//* Routes related to user's blogs

// blogRouter.get('/me', async (req, res, next) => {
// 	console.log('works');
// });

//*Routes that require logged in user is the owner of the blog

blogRouter.put('/:id', checkIfBlogAuthor, updateBlog);
blogRouter.delete('/:id', checkIfBlogAuthor, deleteBlog);

module.exports = blogRouter;
