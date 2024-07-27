import mongoose from "mongoose";

const connect_db =  async ()=>{
try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Mongo db database connected");
} catch (error) {
    console.log("Error connecting to Mongo Db Database");
}

}
export default connect_db