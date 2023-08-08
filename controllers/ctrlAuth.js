const {User} = require("../models/user");
const path = require("path");
const {ctrlWrapper, HttpError} = require("../helpers");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");

const gravatar = require("gravatar")

const {SECRET_KEY} = process.env;

const bcrypt = require("bcrypt");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");


const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

if(user) {
    throw HttpError(409, "Email alredy in use")
  }
  const hashPassword = await bcrypt.hash(password,10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({...req.body, password: hashPassword, avatarURL});
  
  res.status(201).json({
    email: newUser.email,
    password: newUser.password,
  })
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({
        token,
    })
}

const getCurrent = async(req,res) => {
  const {email} = req.user;

  res.json({
    email
  })
}

const logout = async(req, res) => {
   const {_id} = req.user;
   await User.findByIdAndUpdate(_id, {token: ""});

   res.json({
    message: "Logout success",
   })
}

const updateAvatar = async(req, res) => {
     const {_id} = req.user;
     const {path: tempUpload, originalname} = req.file;
     const filename = `${_id}_${originalname}`;

     try {
      const reworkedAvatar = await Jimp.read(tempUpload);
      await reworkedAvatar
        .autocrop()
        .cover(
          250,
          250,
          Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
        )
        .writeAsync(tempUpload);

     const resultUpload = path.join(avatarsDir, filename);
     await fs.rename(tempUpload, resultUpload);
     const avatarURL = path.join("avatars", filename);
     await User.findByIdAndUpdate(_id, {avatarURL});

     res.json({
      status: "OK",
      code: 200,
      message: "Avatar was updated",
      data: {
        avatarURL,
      },
    });
  } catch (error) {
    await fs.unlink(tempUpload);

    res.status(417).json({
      status: "Expectation Failed",
      code: 417,
    });
  }
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}