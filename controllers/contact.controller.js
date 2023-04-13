"use strict";
const db = require("../models");
const Contact = db.contact;
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

exports.searchContact = async (req, res) => {
  try {
    const search = req.body.search;
    await Contact.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        {
          mobileNo: {
            $in: search,
          },
        },
        { address: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .then((data) => {
        res.status(200).send({
          success: true,
          data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: err.message,
        });
      });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addContactByCsv = async (req, res) => {
  try {
    const csvData = [];
    fs.createReadStream(path.join(__dirname, `../assets/${req.file.filename}`))
      .pipe(csv())
      .on("data", (data) =>
        csvData.push({
          name: data["Name"],
          mobileNo: data["Mobile No"],
          email: data["Email"],
          address: data["Address"],
        })
      )
      .on("end", () => {
        Promise.all(
          csvData.map(async (c) => {
            const oldContact = await Contact.findOne({ email: c.email }).lean();
            if (oldContact) {
              await Contact.findOneAndUpdate(
                { email: oldContact.email },
                {
                  $set: {
                    name: c.name,
                    address: c.address,
                    email: c.email,
                    mobileNo: c.mobileNo,
                  },
                }
              );
            } else {
              new Contact({
                name: c.name,
                mobileNo: c.mobileNo,
                email: c.email,
                address: c.address,
              })
                .save()
                .then();
            }
          })
        );
        return res.send("file uploaded");
      });
  } catch {
    console.log(err);
    res.status(400).send({ success: false });
  }
};

exports.searchConotact = async (req, res) => {
  const page = req.query.page || 0;
  const projectPerPage = req.query.recordPerPage;
  await Contact.find()
    .sort({ name: "asc" })
    .skip(page * projectPerPage)
    .limit(projectPerPage)
    .then((d) =>
      res.status(200).send({
        success: true,
        message: "success",
        data: d,
      })
    )
    .catch((error) => res.status(500).send({ message: error.message }));
};

exports.addContact = async (req, res) => {
  try {
    console.log(req.body);
    const { name, mobileNo, email, address } = req.body;
    console.log(name, mobileNo, email, address);
    if (!(name && mobileNo && email && address)) {
      res.status(404).send({
        success: false,
        message: "Please enter all details",
      });
    } else {
      const contact = new Contact({
        name: name,
        mobileNo: mobileNo,
        email: email,
        address: address,
      })
        .save()
        .then((data) => {
          res.status(200).send({
            success: true,
            message: "Contact saved successfully",
          });
        });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
