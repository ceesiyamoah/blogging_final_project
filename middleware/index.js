const BlogModel = require('../models/blogs');

/**
 * Check if requested blog to edit is for logged in user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const checkIfBlogAuthor = async (req, res, next) => {
	try {
		const { id } = req.params;
		const blog = await BlogModel.findById(id);
		if (!blog) {
			const error = new Error('No blog found');
			error.status = 401;
			throw error;
		}

		if (blog.author.toString() === req.user.id) {
			next();
		} else {
			const error = new Error('Not author of blog');
			error.status = 401;
			throw error;
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { checkIfBlogAuthor };
