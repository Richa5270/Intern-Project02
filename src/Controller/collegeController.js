const collegeModel = require("../Model/collegeModel");
const InternModel = require("../Model/InternModel");

////POST /functionup/colleges
const CreateCollege = async function (req, res) {
  try {
    let data = req.body;
    if(!data){
      return res.status(400).send({status: false, message:" college creation not allow"})
    }
    if (!data.name) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a Name" });
    }
    if (Object.keys(data.name).length == 0 || data.name.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid Name" });
    }                                       //const obj={name:sone,age:24}  //Object.keys(obj)=>[name,age]
    if (!data.fullName) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a full collegeName" }); //fullName: []
    }
    if(Object.keys(data.fullName).length == 0 || data.fullName.length == 0){
      return res.status(400).send({status:false, msg:"Enter a valid full collegeName"})
    }
    if (!data.logoLink) {
      return res
        .status(400)
        .send({ status: false, message: "plz giving the logoLink" });
    }
    if (!/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&\/\/=]*)/.test(data.logoLink)
    ) { return res
      .status(400)
      .send({ status: false, message: "logoLink is required" });
  }
    let saved = await collegeModel.create(data);
    res.status(201).send({ status: true, data: saved });
  }
  catch (err) {
    res.status(500).send({status:false, msg:err.massege})
  }
};

//GET /functionup/collegeDetails
const CollegeDetails = async function (req, res) {
  try {
    const data = req.query.collegeName;
    const details = await collegeModel.findOne({
      name: data,
      isDeleted: false,
    });
    if (!details) {
      return res
        .status(400)
        .send({ status:false, message: "Details  is not present " });
    }
    const data2 = await InternModel.find({
      collegeId: details._id,
      isDeleted: false,
    }).select({ name: 1, email: 1, mobile: 1 });
    if (!data2) {
      return res
        .status(400)
        .send({ status:false, massege: "Data not present" });
    }
    const getData = {
      name: details.name,
      fullName: details.fullName,
      logoLink: details.logoLink,
      interests: data2,
    };

    return res.status(200).send({status: true, data: getData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

module.exports.CollegeDetails = CollegeDetails
module.exports.CreateCollege = CreateCollege