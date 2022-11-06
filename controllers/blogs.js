const BlogModel = require('../models/blogs');
const paginator = require('../utils/paginator');
const ObjectId = require('mongoose').Types.ObjectId;

const getAllBlogs = async (req, res, next) => {
	try {
		const { page, limit, tags, title, sortBy, order } = req.query;
		const sort = {};
		if (['read_count', 'reading_time', 'timestamp'].includes(sortBy)) {
			sort[sortBy] = order === 'desc' ? -1 : 1;
		}

		const pageOptions = {
			page: page || 1,
			limit: limit || 20,
		};

		const filter = {
			state: 'published',
		};
		if (tags) {
			filter['tags'] = { $in: tags.split(',').map((tag) => tag.toLowerCase()) };
		}
		if (title) filter['title'] = { $regex: title };

		//search by author first_name from BlogModel
		const { count, items, total_pages } = await paginator(BlogModel, pageOptions.limit, pageOptions.page, filter, sort);
		const blogs = await items.populate('author');
		const body = { count, blogs, total_pages };

		res.json(body);
	} catch (error) {
		next(error);
	}
};

const getBlog = async (req, res, next) => {
	try {
		const { id } = req.params;
		const blog = await BlogModel.findById(id).populate('author');
		blog.read_count++;
		blog.save();
		res.json(blog);
	} catch (error) {
		next(error);
	}
};

const createNewBlog = async (req, res, next) => {
	try {
		const { id } = req.user;
		const newBlog = await BlogModel.create({
			author: id,
			...req.body,
		});
		res.json(newBlog);
	} catch (error) {
		next(error);
	}
};

const updateBlog = async (req, res, next) => {
	try {
		const body = req.body;
		const { id } = req.params;
		const blog = await BlogModel.findByIdAndUpdate(id, body, { new: true });
		res.json(blog);
	} catch (error) {
		next(error);
	}
};

const getMyBlogs = async (req, res, next) => {
	try {
		const { id } = req.user;
		const { state, limit, page } = req.query;

		const filter = {
			author: new ObjectId(id),
		};
		if (state) filter['state'] = state;
		const { count, items, total_pages } = await paginator(BlogModel, limit, page, filter);
		const blogs = await items.populate('author');
		res.json({ count, blogs, total_pages });
	} catch (error) {
		next(error);
	}
};

const deleteBlog = async (req, res, next) => {
	try {
		const { id } = req.params;
		await BlogModel.findByIdAndDelete(id);
		res.json({ message: 'Blog successfully deleted' });
	} catch (error) {
		next(error);
	}
};

module.exports = { getAllBlogs, getBlog, createNewBlog, updateBlog, getMyBlogs, deleteBlog };
