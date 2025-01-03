const { ACCOUNT_TYPES, MAX } = require('../constant');
const { hashPassword } = require('../helper');
const AccountModel = require('../models/account.model/account.model');
const UserModel = require('../models/account.model/user.model');
const { uploadImage } = require('./common.service');
//check acc tồn tại
exports.isExistAccount = async (email) => {
  try {
    return await AccountModel.exists({ email });
  } catch (error) {
    throw error;
  }
};
//tìm acc
exports.findAccount = async (email) => {
  try {
    return await AccountModel.findOne({ email });
  } catch (error) {
    throw error;
  }
};
//tạo tài khoản
exports.createAccount = async (
  email,
  password,
  authType = ACCOUNT_TYPES.LOCAL,
) => {
  try {
    const newAccount = await AccountModel.create({
      email,
      password,
      authType,
      createdDate: new Date(),
    });
    if (newAccount && newAccount._id) return newAccount._id;
    return null;
  } catch (error) {
    throw error;
  }
};
//thêm user
exports.createUser = async (accountId, username, name, avt = '') => {
  try {
    const newUser = await UserModel.create({ accountId, name, username, avt });
    if (newUser && newUser._id) return newUser;
    return null;
  } catch (error) {
    throw error;
  }
};
// Kiểm tra từ yêu thích có tồn tại trong danh sách yêu thích của người dùng không

exports.isExistWordInFavorites = async (word, username) => {
  try {
    const regex = new RegExp(word, 'i');//tránh nhận biết chữ hoa thường
    const isExist = await UserModel.exists({
      username,
      favoriteList: {
        $in: regex,
      },
    });

    return isExist;
  } catch (error) {
    throw error;
  }
};
// Cập nhật danh sách yêu thích của người dùng

exports.isLimitedFavorites = async (word, username) => {
  try {
    // check limit amount
    const user = await UserModel.findOne({ username }).select('favoriteList');
    const { favoriteList = null } = user;

    if (
      Array.isArray(favoriteList) &&
      favoriteList.length >= MAX.FAVORITES_LEN
    ) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateFavoriteList = async (word, username, isAdd = false) => {
  try {
    if (isAdd) {
      return await UserModel.updateOne(
        { username },
        { $push: { favoriteList: word } },
      );
    }

    return await UserModel.updateOne(
      { username },
      { $pull: { favoriteList: { $in: word } } },
    );
  } catch (error) {
    throw error;
  }
};
//update số lượng coin
exports.updateUserCoin = async (newCoin = 0, username = '') => {
  try {
    if (
      newCoin < 0 ||
      newCoin > MAX.USER_COIN ||
      !username ||
      username === ''
    ) {
      return false;
    }

    const updateRes = await UserModel.updateOne(
      { username },
      { coin: newCoin },
    );

    if (updateRes.ok) {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = async (email = '', newPassword = '') => {
  try {
    const hashPw = await hashPassword(newPassword);

    const res = await AccountModel.updateOne({ email }, { password: hashPw });

    if (res.ok) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};
// Cập nhật ảnh đại diện của người dùng

exports.updateAvt = async (username = '', avtSrc = '') => {
  try {
    const picture = await uploadImage(avtSrc, 'dynonary/user-avt');
    const isUpdated = await UserModel.updateOne({ username }, { avt: picture });
    if (isUpdated.n && isUpdated.ok) return picture;

    return false;
  } catch (error) {
    throw error;
  }
};
// Cập nhật hồ sơ người dùng với tên và username mới

exports.updateProfile = async (
  username = '',
  newName = '',
  newUsername = '',
) => {
  try {
    if (username.toLowerCase() !== newUsername.toLowerCase()) {
      const isExist = await UserModel.exists({ username: newUsername });
      if (isExist) {
        return { status: false, message: 'username đã được sử dụng' };
      }
    }

    const isUpdated = await UserModel.updateOne(
      { username },
      { name: newName, username: newUsername },
    );

    if (isUpdated.n && isUpdated.ok)
      return { status: true, message: 'success' };

    return false;
  } catch (error) {
    throw error;
  }
};

exports.getProfile = async (accountId = '') => {
  try {
    const account = await AccountModel.findById(accountId).select(
      'email createdDate',
    );
    return account;
  } catch (error) {
    throw error;
  }
};
