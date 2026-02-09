const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First Name is required"],
    minlength: [5, "First Name must be at least 5 characters long"],
    lowercase: true,
    trim: true
  },
  lastname: {
    type: String,
    required: [true, "Last Name is required"],
    minlength: [5, "Last Name must be at least 5 characters long"],
    lowercase: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  city:{
    type: String,
    required: [true, "City is required"],
    lowercase: true,
    trim: true
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    lowercase: true,
    trim: true
    //enum: ['Manager', 'Team Lead', 'Developer', 'Intern'],
  },
  salary: {
  type: Number,
  min: [0, "Salary cannot be negative"],
  max: [1000000, "Salary must be at most 1,000,000"]
},
  created: { 
    type: Date
  },
  updatedat: { 
    type: Date
  },
});

//Declare Virtual Fields
EmployeeSchema.virtual('fullname').get(function() {
  return `${this.firstname} ${this.lastname}`;
});

EmployeeSchema.virtual('salaryDisplay').get(function() {
  return `$${this.salary}`;
});

//Custom Schema Methods
//1. Instance Method Declaration
EmployeeSchema.methods.getFullName = function() {
  return `${this.firstname} ${this.lastname}`;
};


//2. Static method declararion
EmployeeSchema.statics.getEmployeeByFirstname = function() {
  return this.find({firstname: name});
}


//Writing Query Helpers

EmployeeSchema.query.byFirstName = function(name) {
    return this.where({firstName: new RegExp(name, 'i')})
}

//Middlewares
EmployeeSchema.pre('save', (next) => {
  console.log("Before Save")
  let now = Date.now()
   
  this.updatedat = now
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now
  }

  // Call the next function in the pre-save chain
  next()
});

EmployeeSchema.pre('findOneAndUpdate', () => {
  console.log("Before findOneAndUpdate")
  let now = Date.now()
  this.updatedat = now
  console.log(this.updatedat)
  next()
});


EmployeeSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

EmployeeSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

EmployeeSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

EmployeeSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;