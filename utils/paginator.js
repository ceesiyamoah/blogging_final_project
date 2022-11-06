/**
 *@param {Model}model
 * @param {number} limit
 * @param {number} page
 * @param {{}} filter find conditons
 * @returns {count,items (Promise),total_pages}
 */
const paginator = async (model, limit = 20, page = 1, filter = {}, sort = {}) => {
	const count = await model.find(filter).countDocuments();
	const items = model
		.find(filter)
		.limit(limit)
		.sort(sort)
		.skip(limit * (page - 1));
	const total_pages = Math.ceil(count / limit);
	return { count, items, total_pages };
};

module.exports = paginator;
