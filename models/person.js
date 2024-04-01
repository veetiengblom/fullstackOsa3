require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

//Muuta environment variableksi
const url = process.env.MONGODB_URI;

const numberValidator = (value) => {
  const regex = /^[0-9]{2,3}-[0-9]{5,}$/;
  //const regex = /^\d{2,3}-\d{5,}$/;
  if (!regex.test(value)) {
    return false;
  }
  // if (value.length < 8) {
  //   return false;
  // }
  const parts = value.split("-");
  const firstPart = parts[0];

  // Check if the first part is 2-3 characters long
  if (firstPart.length < 2 || firstPart.length > 3) {
    return false;
  }

  return true;
};

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minlength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: numberValidator,
      message:
        "User input must be in correct format: for ex. 09-1234556, 040-22334455",
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
