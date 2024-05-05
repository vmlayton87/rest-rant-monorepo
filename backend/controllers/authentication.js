const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('json-web-token')

const { User } = db

router.post('/', async (req, res) => {
    let user = await User.findOne({
        where: { email: req.body.email}
    })
    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({ 
            message: `Could not find a user with the provided username and password` 
        })
    } else {
        // req.session.userId=user.userId
        const result = await jwt.encode(process.env.JWT_SECRET, {id: user.userId})
        res.json({ user: user, token: result.value })
    }
    
    console.log("authentication post response user", user)
})

router.get('/profile', async (req, res) => {
    console.log('consolelogged userid:', req.session.userId)
    res.json(req.currentUser)
    // try {
    //     // splits the authentication header from CurrentUser fetch into [Bearer, 'token']
    //     const [authenticationMethod, token] = req.headers.authorization.split(' ') 

    //     // does something if the authorization handle is Bearer:
    //     if (authenticationMethod == 'Bearer') {

    //         // Decode the JWT to get the user id
    //         const result = await jwt.decode(process.env.JWT_SECRET, token)

    //         // Get the logged in user's id from the payload
    //         const { id } = result.value

    //         // Find the user object using their id:
    //         let user = await User.findOne({
    //             where: {
    //                 userId: id
    //             }
    //         })
    //         res.json(user)
    //     }} catch {
    //         res.json(null)
    //     }
})


module.exports = router
