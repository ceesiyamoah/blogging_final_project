const express = require('express');
const passport = require('passport');
const { getAllBlogs, getBlog, createNewBlog, updateBlog, getMyBlogs, deleteBlog } = require('../controllers/blogs');
const { checkIfBlogAuthor } = require('../middleware');

const blogRouter = express.Router({ mergeParams: true });

blogRouter.get('/', getAllBlogs);
blogRouter.get('/:id', getBlog);

//*Routes that require authentication
blogRouter.use(passport.authenticate('jwt', { session: false }));
blogRouter.post('/', createNewBlog);

//*Routes that require logged in user is the owner of the blog
blogRouter.put('/:id', checkIfBlogAuthor, updateBlog);
blogRouter.delete('/:id', checkIfBlogAuthor, deleteBlog);

module.exports = blogRouter;
