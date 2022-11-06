const express = require('express');
const passport = require('passport');
const { getMyBlogs } = require('./controllers/blogs');
const { connectToMongoDb } = require('./db');
const authRouter = require('./routes/auth');
const blogRouter = require('./routes/blogs');
require('dotenv').config();
require('./authentication/auth');

const PORT = process.env.PORT;
connectToMongoDb();

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
	res.send(`<div>
		<h1>Blog API</h1>
		<p>use postman to test the various routes</p>
		<p>See documentation <a target="_blank" rel="noopener noreferrer" href='https://github.com/ceesiyamoah/blogging_final_project#readme'>here</a></p>

	</div>`);
});
app.use('/auth', authRouter);

//* Route to get blogs of current user
app.get('/blogs/me', passport.authenticate('jwt', { session: false }), getMyBlogs);

app.use('/blogs', blogRouter);

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({ message: err.message });
});

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`);
});
