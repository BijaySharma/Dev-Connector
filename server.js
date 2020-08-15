import express from 'express';
import connectDB from './config/db';

// Import Route Handlers
import UserRouter from './routes/api/users';
import ProfileRouter from './routes/api/profile';
import AuthRouter from './routes/api/auth';
import PostsRouter from './routes/api/posts';

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

//Init Middlewares
app.use(express.json({ extended: true }));

// @route   GET /
// @desc    Root Route
// @access  public
app.get('/', (req, res) => {
  res.status(200).send('API RUNNING');
});

// Define Routes
app.use('/api/users', UserRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/posts', PostsRouter);

// HTTP Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
