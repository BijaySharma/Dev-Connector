import express from 'express';
import connectDB from './config/db';
import path from 'path';

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


// Define Routes
app.use('/api/users', UserRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/posts', PostsRouter);

// Server static 
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

// HTTP Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
