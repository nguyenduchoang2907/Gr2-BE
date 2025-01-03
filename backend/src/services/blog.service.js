const BlogModel = require('../models/blog.model');
// Dịch vụ lấy danh sách các blog, nhưng không bao gồm nội dung HTML của mỗi blog

exports.getBlogListService = async () => {
  try {
    const blogs = await BlogModel.find({}).select('-html');
    return blogs;
  } catch (error) {
    throw error;
  }
};
// Dịch vụ lấy nội dung HTML của một blog dựa trên _id
exports.getBlogHtmlService = async (_id) => {
  try {
    if (!Boolean(_id)) return null;
    const { html = '' } = await BlogModel.findById(_id).select('-_id html');
    return html;
  } catch (error) {}
};
