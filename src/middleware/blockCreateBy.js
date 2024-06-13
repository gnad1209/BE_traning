// Middleware để chặn cập nhật trường createdBy
const blockCreateBy = (userSchema) => {
    function preventUpdateCreatedBy(next) {
        const update = this.getUpdate();
        if (update.$set && update.$set.createdBy) {
            delete update.$set.createdBy;
        } else if (update.createdBy) {
            delete update.createdBy;
        }
        next();
    }

    userSchema.pre('updateOne', preventUpdateCreatedBy);
    userSchema.pre('updateMany', preventUpdateCreatedBy);
    userSchema.pre('findOneAndUpdate', preventUpdateCreatedBy);
    userSchema.pre('findByIdAndUpdate', preventUpdateCreatedBy);
}

module.exports = blockCreateBy