const User = require('../../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');


exports.signup = async(req, res) => {

  await User.findOne({ email: req.body.email })
    .exec( async (error, user) => {
      if (user) return res.status(400).json({
        message: "Admin already registered"
      });

      const {
        firstName,
        lastName,
        email,
        password
      } = req.body;
       const hash_password = await bcrypt.hash(password, '$2b$10$WS5KNEDb4orheEFQfOSl9u');
//       const hash_password = password;
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: shortid.generate(),
        role: 'admin'
      });

      await _user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            message: 'Something went wrong'
          })
        }
        if (data) {
          return res.status(201).json({
            message: 'Admin created Successfully..!'
          })
        }
      })
    })
}

exports.signin = async(req, res) => {
 await User.findOne({ email: req.body.email })
    .exec(async (error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        const isPassword = await user.authenticate(req.body.password);
        if (user.hash_password===isPassword && user.role === 'admin') {
          const token = await jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
          const { _id, firstName, lastName, email, role, fullName } = user;
          res.cookie('token', token, {expiresIn: '1d'});
          res.status(200).json({
            token,
            user: {_id, firstName, lastName, email, role, fullName}
          });
        } else {
          return res.status(400).json({
            message: 'Invalid Password'
          })
        }
      } else {
        return res.status(400).json({ message: 'Something went wrong' });
      }
    });
}

exports.signout = async(req, res) => {
  res.clearCookie('token');
  res.status(200).json({message: 'Signout successfully...!'});
}

