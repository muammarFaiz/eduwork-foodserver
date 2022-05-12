const userdb = require('./model.js');
const bcp = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// register
// required: username, email, password, role
const insert1 = async (req, res, next) => {
  try {
    console.log(req.body.data);
    // checking the email cannot on the chema.pre because it will be called when updating too,
    // because of that it will return error email already exist
    console.log('check email');
    const findDuplicate = await userdb.find({email: req.body.data.email});
    if(findDuplicate.length) res.json({failed: 1, message: 'email already exist'});
    else {
      console.log('email available, saving data...');
      const tosave = new userdb(req.body.data);
      const result = await tosave.save();
      console.log('data saved');
      console.log(result);
      const exclude = ({password, token, ...cut}) => cut;
      const public = exclude(result._doc)
      res.json({success: 1, result: public});
    }
  } catch(e) {
    console.log(e.message);
    res.json({failed: 1, message: e.message})
  }
};

// verify if user allowed to edit...
const editUser = async (req, res, next) => {
  console.log('edit user running');
  const email = req.body.email, password = req.body.password
  if(email && password) {
    const user = await userdb.findOne({email: email})
    if(user) {
      console.log('user found');
      if( await bcp.compare(req.body.password, user.password)) {
        console.log('password accepted');
        if(req.user.id == user._id.valueOf()) {
          console.log('jwt accepted');         
          res.json({status: 'accepted', message: 'jwt accepted'})
        } else {
          console.log('jwt rejected');
          res.json({status: 'rejected', message: 'jwt rejected'})
        }
      } else {
        console.log('password rejected');
        res.json({status: 'rejected', message: 'wrong password'})
      }
    } else {
      console.log('user not found');
      res.json({status: 'rejected', message: 'user not found'})
    }
  }
};

const updateUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const result = await userdb.myOverwrite({_id: req.user.id}, {...req.body})
    console.log(result);
    res.json({...result._doc, status: 'ok'})
  } catch (error) {
    console.log(error);
    res.send('server error...')
  }
}

const login = (req, res, next) => {
  // passport.authenticate gets user from the local strategy authenticate function
  passport.authenticate('local', async (err, user) => {
    console.log('passport.authenticate running...');
    if(err) {
      console.log('authenticate error');
      return next(err);
    } else {
      if(!user) {
        res.json({error: 1, message: 'wrong email or password'});
      } else {
        console.log('user exist, producing jwt token and saving to db...');
        console.log(user);
        const signed = jwt.sign({...user}, process.env.ACCESS_TOKEN_SECRET);
        const userWithToken = await userdb.myAddToken({_id: user.id}, signed);
        if(userWithToken.message == 1) {
          res.json({message: 'token adding failed', user: userWithToken})
        }
        console.log('success adding token, sending res.json()');
        // TODO: when the app is finish res.json should only return the token
        const exc = ({password, ...cut}) => cut;
        const public = exc(userWithToken._doc);
        res.json({message: 'token added', user: public});
      }
    }
  })(req, res, next);
};

const verifyUser = async (req, res, next) => {
  console.log('verifyUser route running, reading req.headers.authorization...');
  // console.log(req.body);
  const token = req.headers.authorization ?
    req.headers.authorization.replace('Bearer ', '') :
    null;
  if(token !== null) {
    let decoded;
    try {
      // console.log(token);
      console.log('token found, verifying jwt...');
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // overwriting req.user...
      req.user = decoded
      console.log('jswt verified, req.user result:');
      // console.log(req.user);
      console.log('finding token in db...');
      const user = await userdb.findOne({token: {$in: [token]}});
      if(user) {
        console.log('token found in db, next()');
        next();
      } else {
        console.log('token not found in db, res.send(done)');
        res.json({tokenStatus: 'expired', message: 'token accepted but not found in db'});
      }
    } catch(e) {
      console.log(e);
      res.json({status: 'server error', message: e.message});
    }
  } else {
    console.log('token not exist??');
    res.json({status: 'rejected', message: 'jwt token not found'})
  }
};

// logout do: removing token
const logout = async (req, res, next) => {
  console.log('logout route running\n reading token in req.headers.authorization...');
  const token = req.headers.authorization ?
    req.headers.authorization.replace('Bearer ', '') :
    null;
  if(token) {
    console.log('token found, searching for the related user...');
    const user = await userdb.findOne({token: {$in: [token]}});
    const exc = ({password, token, ...cut}) => cut;
    if(user) {
      console.log('user found, removing the token...');
      user.token = user.token.filter(item => item !== token);
      const result = await user.save();
      const public = exc(result._doc);
      console.log('token removed, res.json()');
      res.json({status: 'token removed', user: public});
    } else {
      console.log('no user related this token, res.json()');
      res.json({status: 'no user related to this token'});
    }
  } else {
    console.log('token not found in req.headers.authorization, res.json()');
    res.json({status: 'token not found in request, you are now logged out'});
  }
};

const reportLoginStatus = (req, res, next) => {
  res.json({loggedIn: true})
}

const sendUserData = async (req, res, next) => {
  const result = await userdb.findOne({_id: req.user.id})
  if(result) {
    console.log('user found');
    res.json({username: result.username, email: result.email})
  } else {
    console.log('user not found, wrong token?');
    res.json({status: 'wrong token'})
  }
}

module.exports = {
  insert1,
  editUser,
  login,
  verifyUser,
  logout,
  reportLoginStatus,
  sendUserData,
  updateUser
};
