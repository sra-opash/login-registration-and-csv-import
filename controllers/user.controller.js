"Use strict";
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const environment = require("../utils/environment");

exports.get_user = (req, res) => {
  res.send("Success");
};

exports.registerUser = async (req, res) => {
  try {
    console.log("Registering",req.body)
    const userDetails =  { 
      fName: req.body.fName,
       lName: req.body.lName,
       userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      };
    if (!(userDetails)) {
      res.status(400).send("Please insert all the fileds");
    }
    const oldUser = await User.findOne({
      email: userDetails.email,
    }).lean();
    if (oldUser) {
      return res.status(400).send({
        success: false,
        message: "User Already Exist. Please Login",
      });
    } else {
      const token = jwt.sign(
        {
          data: userDetails.email.toString(),
        },
        environment.jwt.secret,
        {
          expiresIn: environment.jwt.expiresIn || '1d',
        }
      );
      const encryptedPassword = await bcrypt.hash(userDetails.password, 10);
      // const bitmapImage = fs.readFileSync(userDetails.image.path)
      // const base64Image = Buffer(bitmapImage).toString("base64");
     
      const user = new User({
        fName: userDetails.fName,
        lName: userDetails.lName,
        email: userDetails.email.toString(),
        userName: userDetails.userName,
        password: encryptedPassword,
        // image: {
        //   data: base64Image,
        //   contentType: "image/jpg",
        // }
      }).save().then(async (response)=> {
        // const transpoter = await nodemailer.createTransport({
        //   host: process.env.HOST,
        //   port: 587,
        //   secure: false,
        //   auth: {
        //     user: process.env.USER, // generated ethereal user
        //     pass: process.env.PASSWORD, // generated ethereal password
        //   },
        // });
  
        // const info = await transpoter.sendMail({
        //   from: process.env.MAIL_SENDER_EMAIL, // sender address
        //   to: response.email, // list of receivers
        //   subject: "Hello", // Subject line
        //   text: "Hello ", // plain text body
        //   html: `<h1>Hello ${response.fName}</h1>
        //               <a href="localhost:5000/user/verify-email/${response.id}">
        //                <h3>verify your mail ${response.email}</h3>
        //                </a`,
        // });

        res.status(200).send({
          success: true,
          message: 'Registration successfully',
          response,
          token
        });
      })
      // res.send(info);
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password, userName } = req.body;

    if (!((email || userName) && password)) {
      return res.status(502).send({
        success: false,
        message: "user detail is required",
      });
    }
    const user = await User.findOne({
      $or : [
        {userName: userName},
        {email: email}
      ]
    }).lean();
    console.log("user", user);
    console.log("password", await bcrypt.hash(password, 10));
      if (await bcrypt.compare(password,user.password)) {
          const token = jwt.sign(
            {
              user_id: user._id,
              email,
            },
            environment.jwt.secret,
            {
              expiresIn: environment.jwt.expiresIn || '1d',
            }
          )
          await User.findOneAndUpdate({
            userName: userName
          },
          {
            $set :{
              isMarkImportant: true
            }
          })
          await res.status(200).send({
            success: true,
            message: "login successful",
            token
          });
      } else {
        res.status(500).send({
          success: false,
          message: "Invalid credentials",
        });
      }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email,userName, newPasswoprd, password } = req.body;

    if (!((email || userName) && password && newPasswoprd)) {
      res.status(400).send("Please insert all the fileds");
    }
    const oldUser = await User.findOne({
      $or: [
        {email: email},
        {userName: userName}
      ]
    }).lean();
    const encryptedNewPassword = await bcrypt.hash(newPasswoprd, 10);
    if (((email || userName) && (oldUser.email || oldUser.userName)) && bcrypt.compare(password, oldUser.password)) {
      User.findByIdAndUpdate(
        oldUser._id,
        {
          password: encryptedNewPassword,
        },
        {
          new: true,
        }
      ).then((data) => {
        res.status(200).send({
          success: true,
          message: "Password Update successfully",
        });
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Bad request",
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
