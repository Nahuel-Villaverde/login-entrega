import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://nahuel:12345@cluster0.n6uawfv.mongodb.net/login?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;
