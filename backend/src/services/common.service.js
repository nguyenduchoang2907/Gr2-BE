const { cloudinary } = require('../configs/cloudinary.config');
const { MAX } = require('../constant');
const { convertPackInfoToQueryStr } = require('../helper/word-pack.helper');
const VerifyCodeModel = require('../models/account.model/verifyCode.model');
const SentenceModel = require('../models/sentence.model');
const WordModel = require('../models/word.model');

// Dịch vụ upload hình ảnh lên Cloudinary
exports.uploadImage = async (imgSrc, folderName = '', config = {}) => {
  try {
    const result = await cloudinary.uploader.upload(imgSrc, {
      folder: folderName,
      ...config,
    });
    const { secure_url = null } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};
//kiểm tra xem từ có trong database không
exports.isExistWord = async (word = '', type = '') => {
  try {
    if (word === '' || type === '') {
      return false;
    }

    return await WordModel.exists({ word, type });
  } catch (error) {
    throw error;
  }
};
//kiểm tra câu có tồn tại trong database không?
exports.isExistSentence = async (sentence = '') => {
  if (sentence === '') return false;
  const newRegex = new RegExp(sentence, 'i');
  return await SentenceModel.exists({ sentence: newRegex });
};
// Lấy danh sách từ (word pack) dựa trên thông tin pack, kèm các tham số khác như skip, limit, sort, select

exports.getWordPack = async (
  packInfo = {},
  skip = 0,
  limit = 500,
  select = '',
  sortType = null,
  expandQuery = null,
) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);// có thể thay sang parse

    // add expand query
    if (expandQuery && typeof expandQuery === 'object') {
      Object.assign(query, expandQuery);
    }
    // Thực hiện truy vấn tìm kiếm trong WordModel với điều kiện query

    const packList = await WordModel.find(query)
      .sort({ word: sortType })
      .skip(skip)
      .limit(limit)
      .select(select);

    return packList;
  } catch (error) {
    throw error;
  }
};

exports.countWordPack = async (packInfo = {}) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);
    return await WordModel.countDocuments(query);
  } catch (error) {
    throw error;
  }
};
//lưu mã xác thực vào user và xoá cái cũ tạo cái mới
exports.saveVerifyCode = async (code = '', email = '') => {
  try {
    // delete old code
    await VerifyCodeModel.deleteOne({ email });

    const newItem = await VerifyCodeModel.create({
      code,
      email,
      createdDate: new Date(),
    });
    return newItem;
  } catch (error) {
    throw error;
  }
};

exports.checkVerifyCode = async (code = '', email = '') => {
  try {
    const item = await VerifyCodeModel.findOne({ email, code });

    if (!item) {
      return { status: false, message: 'Hãy gửi mã để nhận mã xác thực.' };
    }

    if (item.code !== code) {
      return { status: false, message: 'Mã xác thực không đúng.' };
    }

    const d = new Date().getTime(),
      createdDate = new Date(item.createdDate).getTime();

    if (d - createdDate > MAX.VERIFY_TIME) {
      return {
        status: false,
        message: 'Mã xác thực đã hết hiệu lực. Hãy lấy một mã khác',
      };
    }

    return { status: true, message: 'valid' };
  } catch (error) {
    throw error;
  }
};

exports.removeVerifyCode = async (email = '') => {
  await VerifyCodeModel.deleteOne({ email });
};
