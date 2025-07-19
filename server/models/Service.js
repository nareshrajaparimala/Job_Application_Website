const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String
});
module.exports = mongoose.model("Service", serviceSchema);