const mongoose = require('mongoose')

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
    this.isCached = true
    return this
}

mongoose.Query.prototype.exec = function () {

    console.log(this.getQuery())
    console.log("isCached? : ", this.isCached)
    return exec.apply(this, arguments)
}