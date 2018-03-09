import * as mongoose from 'mongoose'
const { Schema } = mongoose

const Blog = new Schema({
  title: String,
  time: Date,
  href: String,
  topic: String,
  scope: String
})

type TYPE = {
  scope: string,
  topic: string,
  limit: number,
  skip: number
};

/**
 * type 最新数据的 type 属性
 */
Blog.statics.getNewestTitle = async function ({ scope, topic }: TYPE) {
  const options = { scope }
  // const options = topic ? { topic } : {}
  topic && (options.topic = topic)

  let newest = await this.findOne(
    options
  ).sort(
    { time: -1, _id: -1 }
  ).exec()

  return newest && newest.title
}

/**
 * 按需获取数据库中的数据
 */
Blog.statics.getList = async function ({ limit, skip, scope, topic }: TYPE) {
  const options = {}

  if (scope) {
    options.scope = scope
  }
  if (topic) {
    options.topic = topic
  }

  let list = await this.find(
    options,
    { _id: 0, __v: 0 }
  ).sort({
    time: -1,
    _id: -1
  })
  .limit(limit)
  .skip(skip)
  .exec()

  return list || []
}

export default Blog
