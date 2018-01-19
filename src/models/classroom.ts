import * as mongoose from 'mongoose'
const { Schema } = mongoose

const ClassroomSchema = new Schema({
  day: Number,
  data: Schema.Types.Mixed
})

/**
 * 通过 day 判断更新对象，并返回
 */
ClassroomSchema.statics.updateByDay = async function ({ data, day = 0 }: { data: string, day: number }) {
  await this.findOneAndUpdate({ day }, { $set: { data } }).exec()
}

/**
 * 按需获取数据库中的数据
 */
ClassroomSchema.statics.getByDay = async function ({ day = 0 }) {
  let ret = await this.findOne({ day }, { data: 1, _id: 0 }).exec()

  return ret
}

export default mongoose.model('classroom', ClassroomSchema)
