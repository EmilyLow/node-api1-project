//!!Confused why we have to restart server each time
  
// this import is now pulling from node_modules instead of the Node stdlib
const express = require("express")

const db = require("./database")

// create an express server instance
const server = express()

// this allows us to parse request JSON bodies,
// we'll talk about this further later
server.use(express.json())

server.get("/", (req, res) => {
	res.json({ message: "Hello, World" })
})

server.get("/users", (req, res) => {
	// simulate a real call to a database to fetch data
	const users = db.getUsers()
    // return this "fake" data to the client (browser, insomnia, etc.)
    if(users) {
        res.json(users)
    }
    else {
        res.status(500).json({errorMessage: "The users information could not be retrieved.",})
    }
	
})

server.get("/users/:id", (req, res) => {
	const id = req.params.id
	const user = db.getUserById(id)

    //!! I don't know how to tell teh difference between a user with id not being found, and not retrieving user from database
	// make sure user exists before we try to send it back
	if (user) {
		res.json(user)
	} else {
		res.status(404).json({{ message: "The user with the specified ID does not exist." })
	}
})

server.post("/users", (req, res) => {
    
    if(!req.body.name || !req.body.bio) {
        res.status(400).json({
			errorMessage: "Please provide name and bio for the user.",
		})
    } 
    //!! I don't know if this is returning correctly
    //!! Also I don't know how to check for an error during saving
    else {
        const newUser = db.createUser({
            name: req.body.name, bio:req.body.bio
        })
        //!! I don't know if this correctly checks if saved
        if (!newUser) {
            res.status(500).json({
                errorMessage: "There was an error while saving the user to the database"
            })
        }
        else {
            res.status(201).json(newUser)
        }
       
    }
    
    
})

server.put("/users/:id", (req, res) => {
	const id = req.params.id
	const user = db.getUserById(id)

	if (user) {
		const updatedUser = db.updateUser(id, {
			name: req.body.name,
		})

		res.json(updatedUser)
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

server.delete("/users/:id", (req, res) => {
	const id = req.params.id
	const user = db.getUserById(id)

	if (user) {
		db.deleteUser(id)
		// 204 means a successful empty response
		res.status(204).end()
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

// web servers need to be continuously listening
server.listen(8080, () => {
	console.log("server started")
})
