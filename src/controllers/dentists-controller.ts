import DentistSchema, { Dentist } from "../schemas/dentists";
import { MessageException } from "../exceptions/MessageException";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { MessageHandler,MessageData } from "../utilities/types-utils";

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
      message: "Dentist already exists",
    });
  }

  if (!password) {
    throw new MessageException({
      code: 403,
      message: "Password is wrong",
    });
  }
  const passwordHash = await bcrypt.hash(`${password}`, 10);
  const dentist = new DentistSchema({
    firstName,
    lastName,
    SSN,
    email,
    password: passwordHash
  
  });

  dentist.save();

  return dentist;
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

  // if Dentist exists and passwords match
  if (!(await bcrypt.compare(password, dentist.password))) {
    throw new MessageException({
      code: 401,
      message: "Invalid records",
    });
  }
  return dentist;
};

// return user with a specific ID
const getDentist:MessageHandler =async  (data)=> {
  
  const {dentist_id}= data;
    const dentist = await DentistSchema.findById(dentist_id)

    if (!dentist) {
      throw new MessageException({
        code: 400,
        message: 'Invalid user ID',
      })
    }

    if (dentist === null) {
      throw new MessageException({
        code: 400,
        message: 'User does not exist',
      })
    }

    return dentist
  }

  // delete user with a specific ID
const deleteDentist: MessageHandler = async  (data)=> {
  
    const {dentist_id}= data;
    
    const dentist = await DentistSchema.findByIdAndDelete(dentist_id)

    if (!dentist) {
      throw new MessageException({
        code: 400,
        message: 'Invalid id',
      })
    }

    if (dentist === null) {
      throw new MessageException({
        code: 400,
        message: 'Dentist does not exist',
      })
    }

    return 'Dentist has been deleted'
  }


// updates a dentist with given the ID
const  updateDentist :MessageHandler=async (data)=> {
  
  const { dentist_id, firstName, lastName, SSN, email} = data
  const dentist = await DentistSchema.findByIdAndUpdate(
    dentist_id,
    { firstName, lastName, SSN, email},
    { new: true }
  )
  return dentist

}

const verifyToken:MessageHandler=async (data)=> {

  const parsed = JSON.stringify(data)
  const token = JSON.parse(parsed)
  const decoded = jwt.verify(token.token, 'secret')
  return decoded

}


export default { createDentist, login,getDentist,updateDentist,deleteDentist,verifyToken };
