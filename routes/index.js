const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// const passport = require("passport");
// const { ensureAuth, ensureGuest } = require("../routes/authverify");

// router.get("/dashboard", ensureAuth, async (req, res) => {
//   const jobs = await Job.find({ user: req.user.id }).lean();
//   res.render("dashboard", {
//     name: req.user.firstName,
//     jobs,
//   });
// });

// router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
//   res.redirect("/dashboard");
// });

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (isEmpty(email) || isEmpty(password) || isEmpty(firstName) || isEmpty(lastName) || isEmpty(confirmPassword)) {
      return res.status(400).send({ error: "All fields are required" });
    }

    if (!isEmail(email)) {
      return res.status(400).send({ error: "Please provide a valid email" });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({ error: "Password and confirm password do not match" });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();
    const token = await jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY);
    res.status(200).send({ token, userId: user._id, firstName: user.firstName });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
      return res.status(400).send({ error: "Must provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY);
    res.status(200).send({
      token,
      userId: user._id,
      firstName: user.firstName,
    });
  } catch (err) {
    return res.status(400).send({ error: "Invalid email or password" });
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({});
    return res.status(200).send(jobs);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: err.message });
  }
});

router.post("/job", async (req, res) => {
  try {
    console.log(req.body);
    let job = await new Job({ ...req.body });

    const jobs = await Job.find({});
    return res.status(jobs);
  } catch (err) {
    console.log(err);

    return res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let jobs = await Job.findById(req.params.id).lean();

    if (!jobs) {
      res.redirect("/");
    }

    if (jobs.user != req.user.id) {
      res.redirect("/");
    } else {
      await Job.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log("error");
  }
});

router.get("/:id", ensureAuth, async (req, res) => {
  let job = await Job.findById(req.params.id).populate("user").lean();

  if (job) {
    res.render("jobs/show", {
      job,
    });
  }
});

router.get("/", (req, res) => {
  res.render("Login");
});

//     if (story.user._id != req.user.id && story.status == 'private') {
//       res.render('error/404')
//     } else {
//       res.render('stories/show', {
//         story,
//       })
//     }
//   } catch (err) {
//     console.error(err)
//     res.render('error/404')
//   }
// })

// router.delete('/:id', ensureAuth, async (req, res) => {
//     let job = await Jobs.findById(req.params.id).lean()
//     if (job) {
//       await Jobs.remove({ _id: req.params.id })
//       res.redirect('/dashboard')
//     }

// })

// router.get('/edit/:id', ensureAuth, async (req, res) => {

//     const job = await Jobs.findOne({
//       _id: req.params.id,
//     }).lean()

//     if (job) {
//       res.render('jobs/edit', {
//         job,
//     })
//   }
// })

// // Update story

// router.put('/:id', ensureAuth, async (req, res) => {

//     let job = await Jobs.findById(req.params.id).lean()

//     if (job) {
//       job = await Jobs.findOneAndUpdate({ _id: req.params.id }, req.body, {
//         new: true,
//         runValidators: true,
//       })
//       res.redirect('/dashboard')
//     }

// })

const isEmail = (email) => {
  const regEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

module.exports = router;
