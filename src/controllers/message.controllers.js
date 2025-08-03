const Message = require("../models/message.models.js");
const User = require("../models/user.models.js");
const cloudinary = require("../libs/cloudinary.js");
const { getReceiverSocketId } = require("../libs/socket.js");


async function usersForSideBar(req, res) {
  try {
    const myId = req.user._id;
    if (!myId) return res.json({ message: "unauthorized" });
    const allusers = await User.find({ _id: { $ne: myId } });
    if (!allusers) return res.json({ message: "No users found" });
    return res.json(allusers);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    return res.status(500).json({ message: "Internal server error" });
  
  }
}

async function getMessages(req, res) {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    return res.json(message);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function sendMessage(req, res) {
  const { text, image } = req.body;
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    let imageurl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageurl = upload.secure_url;
    }

    const newMesseage = await Message.create({
      text,
      image: imageurl,
      senderId: myId,
      receiverId: userToChatId,
    });

    const {io} = req;

    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessages", newMesseage);
      return res.json(newMesseage);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  usersForSideBar,
  getMessages,
  sendMessage,
};
