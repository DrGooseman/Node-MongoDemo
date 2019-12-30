const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/playground")
	.then(() => console.log("Connected to MongoDB..."))
	.catch(err => console.error("Could not connect to MongoDB", err));

const courseSchema = new mongoose.Schema({
	name: String,
	author: String,
	tags: [ String ],
	date: { type: Date, default: Date.now },
	isPublished: Boolean
});

const Course = mongoose.model("Course", courseSchema);
const course = new Course({
	name: "Angular Course",
	author: "Mosh",
	tags: ["angular", "frontend"],
	isPublished: true
});

async function createCourse()
{
	const result = await course.save();
	console.log(result);
}

async function getCourses()
{
	const courses = await Course.find({ author: "Mosh", isPublished: true })
		.limit(10)
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

//getCourses();
//getNumOfCourses();
removeCourse("5e07c6414cac015f80b8d599");