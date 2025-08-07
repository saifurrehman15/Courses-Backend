import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oidc";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
      failureRedirect: "http://localhost:3000/login",
    },
    (issuer, profile, cb) => {
      return cb(null, profile);
    }
  )
);



passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
