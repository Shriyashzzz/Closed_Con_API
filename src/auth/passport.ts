import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      //check strategy
    } catch (e) {
      //send the error to error logger method
    }
  }),
);

const serializer = (user, done) => {
  return done(null, user.id);
};

const derserializer = async (id, done) => {
  try {
    //fetch user

    if (!user) {
      //if user not found
      return (null, false);
    }

    return done(null, user);
  } catch (e) {
    //send the error to error logger method
  }
};

export const handleLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};
