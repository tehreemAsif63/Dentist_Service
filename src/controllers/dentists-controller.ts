import DentistSchema, { Dentist } from "../schemas/dentists";
import { MessageException } from "../exceptions/MessageException";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { MessageHandler } from "../utilities/types-utils";

const createDentist: MessageHandler = async (data) => {
  const { firstName, lastName, SSN, email, password, slot } =
    data;

  // validate the data of the patient
  if (
    !(firstName && lastName && SSN && email && password )
  ) {
    // throw
    throw new MessageException({
      code: 403,
      message: "Input missing data, All data required",
    });
  }

  // find a registered Dentist in DB
  const registeredDentist = DentistSchema.find({ SSN, email });

  // check if Dentist already registered in DB
  if ((await registeredDentist).length > 0) {
    throw new MessageException({
      code: 403,
      message: "dentist already exists",
    });
  }

  if (!password) {
    throw new MessageException({
      code: 403,
      message: "Password is wrong",
    });
  }

  const dentist = new DentistSchema({
    firstName,
    lastName,
    SSN,
    email,
    password,
    slot
    
  });
  const token = jwt.sign({ dentistID: dentist._id, SSN, email }, "secret", {
    expiresIn: "3h",
  });
  dentist.save();

  //connect to database

  return { ...dentist.$assertPopulated, token };
};

// Dentist login
const login: MessageHandler = async (data) => {
  const { SSN, email, password } = data;
  // Validate Dentist input
  if (typeof password != "string") {
    throw new MessageException({
      code: 400,
      message: "Invalid Data type",
    });
  }
  if (!((SSN || email) && password)) {
    throw new MessageException({
      code: 400,
      message: "All input is required",
    });
  }

  // Check if Dentist exist in our DB
  const dentist = await DentistSchema.findOne({ SSN, email });
  if (!dentist) {
    throw new MessageException({
      code: 401,
      message: "Invalid records",
    });
  }

  // if Dentist exists and passwords match, then create and assign dentist token
  if (dentist && (await bcrypt.compare(password, dentist.password))) {
    // Create token
    const token = jwt.sign({ user_id: dentist._id, SSN, email }, "secret", {
      expiresIn: "3h",
    });
    // save Dentist token
    return { ...dentist.$assertPopulated, token };
  } else {
    throw new MessageException({
      code: 401,
      message: "Invalid records",
    });
  }
};
export default { createDentist, login };
