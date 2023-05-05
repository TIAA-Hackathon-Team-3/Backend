const jwt = require('jsonwebtoken')

module.exports =(EmployeeDetails)=>{
    return jwt.sign({EmployeeDetails},process.env.JWT_SECRETKEY,{expiresIn : '4h'})
}
