const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const users = require('./model');

async function authenticateUser(email, password, done) {
  try {
    console.log('authenticateUser running... finding the user using the email');
    console.log(email);
    const user = await users.findOne({email: email})
    if(user) {
      console.log('user found, comparing password hash');
      console.log(password);
      console.log(user.password);
      const compare = await bcrypt.compare(password, user.password);
      // const public = {};
      if(compare) {
        console.log('password true, authenticateUser done(null, user)');
        const exclude = ({password, token, _id, ...cut}) => cut
        const public = {...exclude(user._doc), id: user.id}
        console.log(public);
        done(null, public);
      } else {
        console.log('password false');
        done(null, false);
      }
    } else {
      console.log('user not found');
      done(null, false);
    }
  } catch(e) {
    console.log('something wrong in bcrypt or findOne');
    done(e);
  }
}
passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));

passport.serializeUser((user, done) => {
  console.log(user);
  return done(null, user.id);
});
passport.deserializeUser( async (userid, done) => {
  return done(null, await users.findOne({_id: userid}).select('-password -token'));
});
