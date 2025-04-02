import mongoose from "mongoose";

export default function connectDatabase(url: string) {
console.log("🚀 ~ connectDatabase ~ url:", url)

    mongoose.connect(url)
    .then(()=>{console.log('Database connected.')})
    .catch((err)=>console.log('db connect error', err))
}
