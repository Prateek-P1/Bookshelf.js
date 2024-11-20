const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req,res) => {
	res.render("login");
});

app.get("/signup", (req,res) => {
	res.render("signup");
});

app.post("/signup",async (req,res) => {
	const data = {
		name : req.body.username,
		password : req.body.password
	}

	//check if user already exists
	const existingUser = await collection.findOne({name : data.name});
	if(existingUser)
	{
		res.send("User name already exists. Please enter a different name");
	}
	else 
	{
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(data.password, saltRounds);
		data.password = hashedPassword;
		const userdata = await collection.insertMany(data);
		console.log(userdata);
	}

})

//Login user
app.post("/login", async(req,res) => {
	try
	{
		const check = await collection.findOne({name: req.body.username});
		if(!check)
		{
			res.send("User name is invalid");
		}

		const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
		if(isPasswordMatch)
		{
			res.render("home");
		}
		else
		{
			req.send("Password is incorrect");
		}		
	}
	catch
	{
		res.send("Details entered are wrong");
	}
});


const port = 5000;
app.listen(port,() => {
	console.log(`Server running on port : ${port}`);
})