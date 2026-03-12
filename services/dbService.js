const User = require("../models/user");

async function createUser(data) {
const user = new User(data);
return await user.save();
}

async function findUserByEmail(email) {
return await User.findOne({ email });
}

module.exports = {
createUser,
findUserByEmail
};