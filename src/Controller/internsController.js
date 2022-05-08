const InternModel = require("../Model/InternModel");
const collegeModel = require("../Model/collegeModel");

////POST /functionup/interns
const CreateInterns = async function (req, res) {
  try {
    let data = req.body;
    console.log(data);
    if (!data) {
      return res
        .status(400)
        .send({ status: false, massege: "plz enter a valid data" });
    }
    if(Object.keys(data).length == 0 || data.length == 0){
      return res.status(400).send({status:false, massege:"plz enter a valid data"})
    }
    if (!data.name) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid Name" });
    }
    if (Object.keys(data.name).length == 0 || data.name.length == 0) {
      return res.status(400).send({ status: false, msg: "plz enter Name" });
     }
     if (!/^([a-zA-Z]+)/.test(data.name)) {
      return res.status(400).send({ status: false, massege: "plz enter name" });
    }
     if (!data.email) {
       return res
         .status(400)
         .send({ status: false, message: "EmailId is required" });
     }
     if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
       return res
         .status(400)
         .send({ status: false, message: "plz enter a valid Email" });
     }
     let checkemailExist = await InternModel.find({ email: data.email });
     if (checkemailExist.length != 0) {
      return res
         .status(400)
         .send({ status: false, data: "email already exist" });
     }
    if (!data.mobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile No. is required" });
    }
    if (
      !/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(data.mobile)
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile No is required" });
    }
    let checkmobileExist = await InternModel.find({ mobile: data.mobile });
    if (checkmobileExist.length != 0) {
      return res
        .status(400)
        .send({ status: false, data: "mobile already exist" });
    }
    if (!data.collegeName) {
      return res
        .status(400)
        .send({ status: false, message: "collegeName is required" });
    }
    let collegeName = await collegeModel.find({name:req.body.collegeName}).select({_id:true})
    console.log(collegeName)
    if(collegeName.length == 0){
      return res.status(400).send({status:false, massege:"No any such college"})
    }
    if (Object.keys(collegeName).length == 0 || collegeName.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "enter a valid collegeName" });
    }

    
    let saved = await InternModel.create({name:data.name, email:data.email, mobile:data.mobile, collegeId:collegeName[0]});
    let name = saved.name;
    let email = saved.email;
    let mobile = saved.mobile;
    let collegeId = saved.collegeId;
    let isDeleted = saved.isDeleted;
    res.status(201).send({ status: true, data:{isDeleted,name,email,mobile,collegeId} });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.massege });
  }
};

module.exports.CreateInterns = CreateInterns;
