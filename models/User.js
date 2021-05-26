const mongoose = require("mongoose");
const validator = require("email-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: (value) => {
                if (!validator.validate(value)) {
                    throw new Error("Invalid Email Address");
                }

            },

        },
        firstName: { type: String, required: true, maxLength: 40 },
        lastName: { type: String, required: true, maxLength: 40 },
        phoneNumber: { type: String, required: true },
        password: { type: String, required: true },
        billerFirstName: { type: String, required: false },
        billerLastName: { type: String, required: false },
        billerEmail: { type: String, required: false },
        isAdmin: {type:Boolean, required: false},
        voucher: {type:Array, required:false,
                    value:{ type:{type: String,required:false},
                            delivery:{type: String,required:false},
                            date:{type:Date, requried:false },
                            comment:{type:String, required:false},
                            status:{type:String, required:false}

                    }}
    }
);

// export the model
mongoose.model("users", userSchema);
