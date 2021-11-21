const express = require('express')
const router = express.Router()
const Jobs = require('../models/Job')

const passport = require('passport')
const {ensureAuth,ensureGuest} = require('../routes/authverify')



 




router.get('/',(req,res)=>{
    res.render('Login')
})

router.get('/dashboard', ensureAuth, async (req, res) => {

  const jobs = await Jobs.find({ user: req.user.id }).lean()
      res.render('dashboard', {
        name: req.user.firstName,
        jobs,
  
})
})

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)


router.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/')
})


router.get('/add', ensureAuth, (req, res) => {
  res.render('jobs/add')
})

router.post('/jobs', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Jobs.create(req.body)
    res.redirect('/dashboard')
  
  } catch (err) {
    console.log(err)

    // res.render('error/500')
  }
})


router.delete('/:id', ensureAuth, async (req, res) => {
    try {
      let jobs = await Jobs.findById(req.params.id).lean()
  
      if (!jobs) {
        res.redirect('/')
      }
  
      if (jobs.user != req.user.id) {
        res.redirect('/')
      } else {
        await Jobs.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.log("error")
    }
  })





  router.get('/:id', ensureAuth, async (req, res) => {
   
      let job = await Jobs.findById(req.params.id).populate('user').lean()
  
      if (job) {
        res.render('jobs/show', {
          job,
        })
      }
      })
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


  router.get('/edit/:id', ensureAuth, async (req, res) => {
  
      const job = await Jobs.findOne({
        _id: req.params.id,
      }).lean()
  
      if (job) {
        res.render('jobs/edit', {
          job,
      })
    }
  })
     
  
  // Update story

  router.put('/:id', ensureAuth, async (req, res) => {
  
      let job = await Jobs.findById(req.params.id).lean()
  
      if (job) {
        job = await Jobs.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
        res.redirect('/dashboard')
      }
   
  })














module.exports = router
