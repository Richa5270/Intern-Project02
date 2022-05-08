const collegeModel = require("../Model/collegeModel");
const InternModel = require("../Model/InternModel");

////POST /functionup/colleges
const CreateCollege = async function (req, res) {
  try {
    let data = req.body;
    console.log(data);
    if (!data) {
      return res
        .status(400)
        .send({ status: false, message: " college creation not allow" });//
    }
    if(Object.keys(data).length == 0 || data.length == 0){
      return res.status(400).send({status:false, massege:"plz enter a valid data"})
    }
    
    if (!data.name) {
      return res.status(400).send({ status: false, message: "Enter a Name" });
    }
    if (Object.keys(data.name).length == 0 || data.name.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid Name" });
    }
    if (!/^([a-zA-Z]+)$/.test(data.name)) {
      return res.status(400).send({ status: false, massege: "plz enter name" });
    }
    let checknameExist = await collegeModel.find({ name: data.name });
    console.log(checknameExist);
    if (checknameExist.length != 0) {
      return res
        .status(400)
        .send({ status: false, message: "name already exist" });
    }
    if (!data.fullName) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a full collegeName" }); 
    }
    if (Object.keys(data.fullName).length == 0 || data.fullName.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid full collegeName" });
    }
    if (!/^([a-zA-Z]+)/.test(data.fullName)) {
      return res.status(400).send({ status: false, massege: "plz enter FullName" });
    }
    if (!data.logoLink) {
      return res
        .status(400)
        .send({ status: false, message: "plz giving the logoLink" });
    }
    if (
      !/(http|ftp|https|www):\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(
        data.logoLink
      )
    ) {
      return res
        .status(400)
        .send({ status: false, message: "logoLink is required" });
    }
    let saved = await collegeModel.create({name:data.name, fullName:data.fullName, logoLink:data.logoLink});
    let name = saved.name;
    let fullName = saved.fullName;
    let logoLink = saved.logoLink;
    let isDeleted = saved.isDeleted;
    console.log(saved);
    res.status(201).send({ status: true, data:{name,fullName,logoLink,isDeleted}});
  } catch (err) {
    res.status(500).send({ status: false, message: err.massege });
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
        .send({ status: false, message: "Details  is not present " });
    }
    const data2 = await InternModel.find({
      collegeId: details._id,
      isDeleted: false,
    }).select({ name: 1, email: 1, mobile: 1 });
    if (!data2) {
      return res
        .status(400)
        .send({ status: false, massege: "Data not present" });
    }
    const getData = {
      name: details.name,
      fullName: details.fullName,
      logoLink: details.logoLink,
      interests: data2,
    };

    res.status(200).send({ status: true, data: getData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.CollegeDetails = CollegeDetails;
module.exports.CreateCollege = CreateCollege;
