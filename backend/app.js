//BOOKING backend

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://sinchanahemanthcs23:JymvyrlDD2s8KASN@fwdcluster.1mw7z.mongodb.net/?retryWrites=true&w=majority&appName=FwdCluster")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

const bookingSchema = new mongoose.Schema({
  date: String,
  people: Number,
  email: String,
  restaurantName: String,  // Store restaurant name instead of ObjectId
  location: String, // Store restaurant location
  timeSlot: String,
});

const Restaurant = mongoose.model("Restaurant", new mongoose.Schema({
    name: String,
    location: String,
  }));
  

const Booking = mongoose.model("Booking", bookingSchema);

//contact us
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);


app.post("/book", async (req, res) => {
    const { date, people, email, restaurantName, location, timeSlot } = req.body;
  
    // Check availability for the booking
    const bookings = await Booking.find({ date, restaurantName, location, timeSlot});
    if (bookings.length >= 10) {
      return res.status(400).send({ message: "Sorry, we are booked." });
    }
  
    // Save booking with restaurant info
    const booking = new Booking({ date, people, email, restaurantName, location, timeSlot });
    await booking.save();
  
    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tastequest2024@gmail.com",
        pass: "yjjg eygl eehe kpbx", // use environment variables 
      },
    });
  
    const mailOptions = {
      from: "tastequest2024@gmail.com",
      to: email,
      subject: "Booking Confirmation",
      text: `
        Your booking for ${restaurantName} on ${date} has been confirmed!
        
        Location: ${location}
        Number of People: ${people}
        Time Slot: ${timeSlot}
        NOTE: Arrival after 15 minutes of ${timeSlot} shall cancel your booking

        Thank you for choosing ${restaurantName}!
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ message: "Error sending email" });
      } else {
        return res.status(200).send({ message: "Booking confirmed!" });
      }
    });
  });

  
//contact us
app.post("/contact", async (req, res) => {
  const { name, phone, message } = req.body;

  try {
    const newContact = new Contact({ name, phone, message });
    await newContact.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tastequest2024@gmail.com",
        pass: "yjjg eygl eehe kpbx", // Use environment variables in production
      },
    });

    const mailOptions = {
      from: "tastequest2024@gmail.com",
      to: "tastequest2024@gmail.com", // Replace later with admin email
      subject: "New Contact Message",
      text: `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({ message: "Error sending email" });
      } else {
        console.log("Email sent successfully:", info.response);
        return res.status(200).send({ message: "Message sent successfully!" });
      }
    });
  } catch (error) {
    console.error("Error in /contact endpoint:", error);
    res.status(500).send({ message: "Failed to send message" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});

//for quiz
// Add a Quiz schema to MongoDB
const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const QuizResultSchema = new mongoose.Schema({
  userEmail: String,
  score: Number,
});

const Quiz = mongoose.model("Quiz", quizSchema);
const QuizResult = mongoose.model("QuizResult", QuizResultSchema);

// Add sample quiz questions to MongoDB (run this code once, then comment it out)
(async () => {
  const existingQuestions = await Quiz.countDocuments();
  if (existingQuestions === 0) {
    const sampleQuestions = [
      {
        question: "Which is the most common drink in Karnataka?",
        options: ["Coffee", "Tea", "Majjige", "Elaneeru"],
        correctAnswer: 0,
      },
      {
        question: "During which festival foods like holige and payaasa will be prepared?",
        options: ["Christmas", "Diwali", "Ugadi", "Ramadan"],
        correctAnswer: 2,
      },
      {
        question: "Udupi is known for?",
        options: ["Toys", "Fish", "Ragi", "Tea"],
        correctAnswer: 1,
      },
      {
        question: "Which drink is prepared with lemon and jaggery?",
        options: ["Kashaya", "Majjige", "Panaka", "Mojito"],
        correctAnswer: 2,
      },
      {
        question: "Which is the creamy desert made from rice/ragi coconut and jaggery?",
        options: ["Haalbai", "Paayasa", "Jamun", "Raveunde"],
        correctAnswer: 0,
      },
      {
        question: "Which Karnataka pickle is made from raw mango?",
        options: ["Avakaya", "Uppinakayi", "Pachadi", "Chutney"],
        correctAnswer: 1,
      },
      {
        question: "What is the Karnataka name for flattened rice?",
        options: ["Avalakki", "Poha", "Chura", "Atukulu"],
        correctAnswer: 0,
      },
      {
        question: "Which city in Karnataka is known for its unique style of Benne Masala Dose?",
        options: ["Mysuru", "Davangere", "Mangalore", "Mandya"],
        correctAnswer: 1,
      },
      {
        question: "Which is a famous sweet of Karnataka?",
        options: ["Kajukatli", "Rasmalai", "MysorePak", "Badusha"],
        correctAnswer: 2,
      },
      {
        question: "Which is the staple grain used in Karnataka's rural cuisine?",
        options: ["Wheat", "Rice", "Jowar", "Ragi"],
        correctAnswer: 3,
      },
    ];

    await Quiz.insertMany(sampleQuestions);
    console.log("Sample questions added to the database");
  } else {
    console.log("Questions already exist in the database");
  }
})();

// Endpoint to fetch quiz questions
app.get("/quiz", async (req, res) => {
  const questions = await Quiz.find({}, { question: 1, options: 1 });
  res.json(questions);
});

// Endpoint to submit quiz answers
app.post("/submit-quiz", async (req, res) => {
  const { userEmail, answers } = req.body;

  const questions = await Quiz.find();
  let score = 0;

  // Calculate score
  questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      score++;
    }
  });

  // Save result in database
  const result = new QuizResult({ userEmail, score });
  await result.save();

  res.json({ message: "Quiz submitted successfully!", score });
});