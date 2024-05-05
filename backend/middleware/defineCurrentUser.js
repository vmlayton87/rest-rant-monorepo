const db = require("../models")
const jwt = require('json-web-token')

const { User } = db;

async function defineCurrentUser(req, res, next){
    try {

        // splits the authentication header from CurrentUser fetch into [Bearer, 'token']
        const [authenticationMethod, token] = req.headers.authorization.split(' ') 

        // does something if the authorization handle is Bearer:
        if (authenticationMethod == 'Bearer') {

            // Decode the JWT to get the user id
            const result = await jwt.decode(process.env.JWT_SECRET, token)

            // Get the logged in user's id from the payload
            const { id } = result.value

            // Find the user object using their id:
            let user = await User.findOne({
                where: {
                    userId: id
                }
            })
            req.currentUser = user
        }
        next()
    } catch(err){
        req.currentUser = null
        next() 
    }
}

module.exports = defineCurrentUser