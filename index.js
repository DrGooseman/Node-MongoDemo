const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/playground")
	.then(() => console.log("Connected to MongoDB..."))
	.catch(err => console.error("Could not connect to MongoDB", err));

const courseSchema = new mongoose.Schema({
	name: { 
	type: String, 
	required: true,
	minLength: 5,
	maxLength: 255,
	// match: /pattern/
	},
	category: {
		type: String,
		required: true,
		enum: ["web", "mobile", "network"]
	},
	author: String,
	tags: {
		type: Array,
		validate: {
			validator: function(v) {
				return v && v.length > 0;
			},
			message: "A course should have at least one tag."
		}
	},
	date: { type: Date, default: Date.now },
	isPublished: Boolean,
	price: {
		type: Number,
		required: function() { return this.isPublished; },
		min: 10,
		max: 200,
		get: v => Math.round(v),
		set: v => Math.round(v)
	}
});

const Course = mongoose.model("Course", courseSchema);


async function createCourse()
{
const course = new Course({
	name: "Node.JS Course3",
	category: "web",
	author: "Moshy",
	tags: [],
	isPublished: true,
	price: 10
});
	try{
		const result = await course.save();
	console.log(result);
	}
	catch (ex){
		for (field in ex.errors)
			console.log(ex.errors[field].message);
	}

}

async function getCourses()
{
	cont pageNumber 2;
	const pageSize = 10;

	const courses = await Course.find({ author: "Mosh", isPublished: true })
		.limit(10)
		.skip((pageNumber - 1) * pageSize)
		.limit(pageSize)
		.sort({ name: 1 })
		.select({ name: 1, tags: 1});
	console.log(courses);
}

async function getNumOfCourses()
{
	const courses = await Course.find({ author: "Mosh", isPublished: true })
		.limit(10)
		.sort({ name: 1 })
		.count();
	console.log(courses);
}

async function updateCourse(id){
	const course = await Course.findById(id);
	if(!course) return;

	course.isPublished = true;
	course.author = "Another Author";

	const result = await course.save();
	console.log(result);
}

async function updateCourse2(id){
	const result = await Course.update({_id: id}, {
		$set: {
			author: "Mosh",
			isPublished: false
		}
	});
	
	console.log(result);
}

async function removeCourse(id){
	const result = await Course.deleteOne({ _id: id });
	// const course = await Course.findByIdAndRemove(id);
	console.log(result);
}
createCourse();
//getCourses();
//getNumOfCourses();
//removeCourse("5e07c6414cac015f80b8d599");