const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express();
// app.use(mongoose)
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use('/api', authRouter);

mongoose.connect('mongodb://localhost:27017/mydatabase', {
//   authMechanism: 'GSSAPI',
//   gssapiServiceName: 'mongodb',
  authSource: '$external'
}).then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch((err) => console.error(err));

// app.get('*', (req, res) => {
//     // res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
//   });
  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      // check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // compare passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // generate token
      const token = jwt.sign({ userId: user._id }, 'mysecretkey', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      // check if user already exists
      const user = await User.findOne({ username });
      if (user) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // create new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  