// src/config/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { prisma } from '../config/client';// Local strategy
import { getUserById, comparePassWord } from '../services/admin/user.service';
import { joinUsedRole } from '../services/client/auth.service';
import { getUserSumCart } from '../services/client/productHome.service';

passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // mặc định là 'username'
      passwordField: "password",
      passReqToCallback :true
      
    },
    async (req,username, password, callback) => {
      // session messages
      const {session} = req as any;
      if (session?.messages?.length) {
        //Reset thông báo
        session.messages = [];
      }
      
        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) {
          return callback(null, false, { message: "Invalid email  " });
        }

        const isMatch = await comparePassWord(password, user.password);
        if (!isMatch) {
          return callback(null, false, { message: "Invalid username or password " });
        }

        return callback(null, user as any);
      }
  )
);
// save data to session
// Serialize user ID to session
passport.serializeUser(function(user:any, callback) {
  callback(null,{id:user.id,username:user.username});
    });

// user client
// Deserialize user → attach user to req.user
passport.deserializeUser(async function(user:any, callback) {
 const {id}=user
 //query to database
 const userDB = await joinUsedRole(id)
 const sumCart = await getUserSumCart(id)
 return callback(null,{...userDB as Express.User,sumCart})
});
