import passport from "passport";
import googleOAuth from "passport-google-oauth20";

import {UserModel} from "../database/allModels";

const GoogleStrategy = googleOAuth.Strategy;

export default (passport)=> {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIEN_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/google/callback"
        },
        async(accessToken, refreshToken,profile, done)=> {
            const newUserm={
                fullname: profile.displayName,
                email: profile.email[0].value,
                profilePic: profile.photos[0].value
            };
            try{
                const user = await UserModel.findOne({email: newUserm,email});
                const token = user.generateJwtToken();
                if(user){
                    done(null,{user,token});
                }else {
                    const user = await UserModel.create(newUser);
                    done(null,{user,token});
                }
                }    catch(error)         {
                    done(error, null);
                }
        }
        )
    );
    passport.serializeUser((userData,done) => done(null, {...userData}));
    passport.deserializeUser((id, done) => done(null, id));
}