const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
 const bcrypt = require('bcryptjs');
const shortid = require('shortid');

const generateJwtToken = (_id, role) => {
  return jwt.sign({_id, role}, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = async(req, res) => {
  await User.findOne({ email: req.body.email })
    .exec( async (error, user) => {
      if (user) return res.status(400).json({
        message: "User already registered"
      });

      const {
        firstName,
        lastName,
        email,
        password
      } = req.body;
      const hash_password = await bcrypt.hash(password, '$2b$10$WS5KNEDb4orheEFQfOSl9u');
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate()
      });

      await _user.save((error, user) => {
        if (error) {
          return res.status(400).json({
            massage: 'Something went wrong'
          })
        }
        if (user) {
          const token = generateJwtToken(user._id, user.role);
          const { _id, firstName, lastName, email, role, fullName } = user;
          return res.status(201).json({
            token,
            user: { _id, firstName, lastName, email, role, fullName }
          });
        }
      });
    });
}

exports.signin = async(req, res) => {
  await User.findOne({ email: req.body.email })
    .exec(async (error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
         const isPassword = await user.authenticate(req.body.password);
        if (user.hash_password===isPassword && user.role === 'user') {
          // const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
          const token = generateJwtToken(user._id, user.role);
          const { _id, firstName, lastName, email, role, fullName } = user;
          res.status(200).json({
            token,
            user: {_id, firstName, lastName, email, role, fullName}
          });
        } else {
          return res.status(400).json({
            message: 'Something went wrong'
          })
        }
      } else {
        return res.status(400).json({ message: 'Something went wrong' });
      }
    });
}

