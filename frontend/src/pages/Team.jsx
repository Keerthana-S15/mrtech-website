// import React from "react";
// import { useParams } from "react-router-dom";
// import "./Team.css";

// // Sample team data (added "bio" for flip effect)
// const teamData = {
  
  // "ai-scientists": [
  //   { name: "Dr. Rajesh Kumar", role: "Senior AI Scientist", image: "/images/ai-scientists/rajesh.jpg" },
  //   { name: "Dr. Priya Sharma", role: "Machine Learning Expert", image: "/images/ai-scientists/priya.jpg" },
  //   { name: "Arjun Patel", role: "Deep Learning Engineer", image: "/images/ai-scientists/arjun.jpg" },
  //   { name: "Dr. Meera Singh", role: "Computer Vision Specialist", image: "/images/ai-scientists/meera.jpg" },
  //   { name: "Vikram Reddy", role: "NLP Research Scientist", image: "/images/ai-scientists/vikram.jpg" },
  //   { name: "Dr. Anitha Rao", role: "AI Research Lead", image: "/images/ai-scientists/anitha.jpg" },
  //   { name: "Karthik Nair", role: "Robotics AI Engineer", image: "/images/ai-scientists/karthik.jpg" },
  //   { name: "Dr. Sanjana Gupta", role: "Neural Network Architect", image: "/images/ai-scientists/sanjana.jpg" },
  //   { name: "Ravi Krishna", role: "AI Algorithm Developer", image: "/images/ai-scientists/ravi.jpg" },
  //   { name: "Dr. Kavitha Menon", role: "Reinforcement Learning Expert", image: "/images/ai-scientists/kavitha.jpg" },
  //   { name: "Amit Agarwal", role: "AI Software Engineer", image: "/images/ai-scientists/amit.jpg" },
  //   { name: "Dr. Shreya Iyer", role: "Cognitive Computing Specialist", image: "/images/ai-scientists/shreya.jpg" },
  //   { name: "Naveen Kumar", role: "AI Research Associate", image: "/images/ai-scientists/naveen.jpg" },
  //   { name: "Dr. Lakshmi Prasad", role: "Predictive Analytics Expert", image: "/images/ai-scientists/lakshmi.jpg" },
  //   { name: "Suresh Babu", role: "AI Solutions Architect", image: "/images/ai-scientists/suresh.jpg" },
  //   { name: "Dr. Divya Krishnan", role: "Autonomous Systems Engineer", image: "/images/ai-scientists/divya.jpg" },
  // ],

//   "healthcare": [
//   { name: "Alexander R", role: "Healthcare AI Lead", image: "/images/healthcare/Alexander R.png" },
//   { name: "Anandhababu K", role: "Medical Data Scientist", image: "/images/healthcare/Anandhababu K.png" },
//   { name: "Dhanush Raja R V", role: "Clinical Analyst", image: "/images/healthcare/Dhanush Raja R V.png" },
//   { name: "Edwin Prasanth B", role: "Healthcare Specialist", image: "/images/healthcare/Edwin Prasanth B.png" },
//   { name: "Jansi Periyanayaki M", role: "Nursing Data Expert", image: "/images/healthcare/Jansi Periyanayaki M.png" },
//   { name: "Lavakumar R", role: "Health AI Developer", image: "/images/healthcare/Lavakumar R.png" },
//   { name: "Manikandan S", role: "Medical Software Engineer", image: "/images/healthcare/Manikandan S.png" },
//   { name: "Monisha P", role: "Digital Health Scientist", image: "/images/healthcare/Monisha P.jpg" },
//   { name: "Padma G", role: "Telehealth Expert", image: "/images/healthcare/Padma G.jpg" },
//   { name: "PraveenKumar S", role: "Clinical Data Engineer", image: "/images/healthcare/PraveenKumar S.jpg" },
//   { name: "Ramkumar R", role: "Healthcare Researcher", image: "/images/healthcare/Ramkumar R.png" },
//   { name: "Santhosh D", role: "Medical App Developer", image: "/images/healthcare/Santhosh D.jpg" },
//   { name: "Shyambenadict M L", role: "AI in Medicine Specialist", image: "/images/healthcare/Shyambenadict M L.jpg" },
//   { name: "Surya P", role: "Health Informatics Analyst", image: "/images/healthcare/Surya P.png" },
//   { name: "Vignesh V", role: "Healthcare Data Engineer", image: "/images/healthcare/Vignesh V.png" }
// ],


//   "data-engineers": [
//     { name: "Anand Krishnamurthy", role: "Senior Data Engineer", image: "/images/data-engineers/anand.jpg" },
//     { name: "Sneha Raghavan", role: "Big Data Specialist", image: "/images/data-engineers/sneha.jpg" },
//     { name: "Harish Pandey", role: "Data Pipeline Engineer", image: "/images/data-engineers/harish.jpg" },
//     { name: "Deepa Srinivasan", role: "Cloud Data Architect", image: "/images/data-engineers/deepa.jpg" },
//     { name: "Sunil Mehta", role: "ETL Developer", image: "/images/data-engineers/sunil.jpg" },
//     { name: "Priyanka Jain", role: "Data Infrastructure Engineer", image: "/images/data-engineers/priyanka.jpg" },
//     { name: "Vishal Sharma", role: "Database Administrator", image: "/images/data-engineers/vishal.jpg" },
//     { name: "Swathi Reddy", role: "Data Warehouse Engineer", image: "/images/data-engineers/swathi.jpg" },
//     { name: "Manoj Singh", role: "Real-time Data Engineer", image: "/images/data-engineers/manoj.jpg" },
//     { name: "Nisha Agarwal", role: "Data Quality Engineer", image: "/images/data-engineers/nisha.jpg" },
//   ],

//   "social-entrepreneurs": [
//     { name: "Rohit Malhotra", role: "Social Impact Lead", image: "/images/social-entrepreneurs/rohit.jpg", bio: "Drives sustainable social enterprises." },
//     { name: "Kavya Shetty", role: "Community Engagement Manager", image: "/images/social-entrepreneurs/kavya.jpg", bio: "Promotes inclusive technology adoption." },
//     { name: "Arjun Varma", role: "Rural Technology Advocate", image: "/images/social-entrepreneurs/arjun.jpg" },
//     { name: "Meena Patel", role: "Digital Inclusion Specialist", image: "/images/social-entrepreneurs/meena.jpg" },
//     { name: "Siddharth Rao", role: "Social Innovation Manager", image: "/images/social-entrepreneurs/siddharth.jpg" },
//     { name: "Ritu Agarwal", role: "Sustainable Tech Advisor", image: "/images/social-entrepreneurs/ritu.jpg" },
//     { name: "Vikash Kumar", role: "Grassroots Technology Lead", image: "/images/social-entrepreneurs/vikash.jpg" },
//     { name: "Prachi Goyal", role: "Social Enterprise Consultant", image: "/images/social-entrepreneurs/prachi.jpg" },
//   ],
// };

// // Titles
// const categoryTitles = {
//   "ai-scientists": "AI Scientists",
//   "healthcare": "Healthcare Technologists",
//   "data-engineers": "Data Engineers",
//   "social-entrepreneurs": "Social Entrepreneurs",
// };

// const Team = () => {
//   const { category } = useParams();
//   const members = teamData[category] || [];

//   // If no category is selected
//   if (!category) {
//     return (
//       <div className="team-page">
//         <h1 className="team-title">Our Team</h1>
//         <p className="team-subtitle">
//           Choose a team category from the navigation menu to view our talented professionals.
//         </p>
//         <div className="team-stats">
//           {Object.entries(teamData).map(([key, teamMembers]) => (
//             <div key={key} className="team-stat-card">
//               <h3>{categoryTitles[key]}</h3>
//               <p>{teamMembers.length} Members</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="team-page">
//       <h1 className="team-title">{categoryTitles[category] || "Our Team"}</h1>
//       <p className="team-subtitle">
//         Meet our {members.length} talented {categoryTitles[category]?.toLowerCase()}
//       </p>

//       {members.length > 0 ? (
//         <div className="team-container">
//           {members.map((member, index) => (
//             <div className="team-card" key={index}>
//               <div className="team-card-inner">
//                 {/* Front */}
//                 <div className="team-card-front">
//                   <img src={member.image} alt={member.name} className="team-img" />
//                   <h3>{member.name}</h3>
//                   <p>{member.role}</p>
//                 </div>
//                 {/* Back */}
//                 <div className="team-card-back">
//                   <h3>{member.name}</h3>
//                   <p>{member.bio || "No bio available."}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="no-members">No team members available for this category.</p>
//       )}
//     </div>
//   );
// };

// export default Team;




// import React from "react";
// import { useParams } from "react-router-dom";
// import "./Team.css";

// // Sample team data (with bio, email, linkedin for flip effect)
// const teamData = {
//      "ai-scientists": [
//     { name: "Anupriya Narasimman", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Anu.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "anupriyan.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/anupriyanarasimman/"
//     },

//     { name: "Aparna Ravi", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Aparna.jpg",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "alexander@example.com",
//       linkedin: "https://linkedin.com/in/alexander"
//     },

//     { name: "Deepika Saiganesh", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Deepika.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "deepikas0707.ai@gmail.com",
//       linkedin: " https://www.linkedin.com/in/deepika-s-451897337/"
//     },

//     { name: "Dharani Velu", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Dharani.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "dharaniv.ai14@gmail.com",
//       linkedin: "https://www.linkedin.com/in/dharani-v-5bb0b8333/"
//     },

//     { name: "Divya Veerabhadram", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Divya D V.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "divyadv.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/divya-d-v-337b99331/"
//     },

//     { name: "Divya Velumani", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Divya.png", 
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "divyav16.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/divya-v-173894332/"
//     },

//     { name: "Gomathi Krishnan", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Gomathi.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "gomathik30.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/gomathi-k-997239369/" 
//     },

//     { name: "Jeyalakshmi Mariyappan", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/jeyalakshmi.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "jeyalakshmim.ai01@gmail.com",
//       linkedin: "https://www.linkedin.com/in/jeyalakshmi-m-2a3020341/"
//     },

//     { name: "Keerthana S", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Keerthana.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "keerthanas15.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/keerthana-s-2bba62303/"
//     },

//     { name: "Keerthika Sankar", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/keerthika.png", 
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "keerthis21.ai@gmail.com",
//      linkedin: "https://www.linkedin.com/in/keerthikasankar/"
//     },

//     { name: "Padmavathi Shanmugam", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Padmavathi.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "padmavathis14.ai@gmail.com",
//       linkedin: "www.linkedin.com/in/padmavathi-s-632384334"
//     },

//     { name: "Pavithra Venkateshan", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/pavi.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "pavithrav13.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/pavithravenkatesan2003"
//     },

//     { name: "Priya Venkateshan", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Priya.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "priyav63.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/priya-v-4b31b7335/"
//     },
//     { name: "Reena Poongavanam", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Reena.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "reenap21.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/reenapoongavanam/"
//     },

//     { name: "Sujatha Velayudham", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/Sujatha.jpg", 
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "sujathav2003.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/sujatha-velayutham-20a89033a/"
//     },

//     { name: "Uma Saraswathi Subramaniyan", 
//       role: "Junior Developer", 
//       image: "/images/ai-scientists/umasaraswathi.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "umasaraswathis.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/umasaraswathi-s-0850802a5/"
//      },
    
//   ],

//   "healthcare": [
//     {
//     name: "Jansi Periyanayaki M",
//     role: "general secretary",
//     image: "/images/healthcare/Jansi Periyanayaki M.png",
//     bio: "Works on nursing data management and healthcare records.",
//     email: "jansinayaki@gmail.com",
  
//   },
//   {
//     name: "Alexander R",
//     role: "Chief Technical Officer",
//     image: "/images/healthcare/Alexander R.png",
//     bio: "Leads AI-driven healthcare projects for hospitals.",
//     email: "alexander22797@gamil.com",
  
//   },

//     {
//     name: "Monisha P",
//     role: "Executive HR",
//     image: "/images/healthcare/Monisha P.jpg",
//     bio: "Researches innovations in digital healthcare.",
//     email: "monishapurusothaman6@gmail.com",
   
//   },
//   {
//     name: "Padma G",
//     role: "Executive HR",
//     image: "/images/healthcare/Padma G.jpg",
//     bio: "Expert in telemedicine and remote patient care.",
//     email: "gpadma010699@gmail.com",
   
//   },


//   {
//     name: "Lavakumar R",
//     role: "Communication Officer",
//     image: "/images/healthcare/Lavakumar R.png",
//     bio: "Builds AI-powered healthcare applications.",
//     email: "executivegcare@gmail.com",
    
//   },
//   {
//     name: "Anandhababu K",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Anandhababu K.png",
//     bio: "Specializes in predictive analytics for patient care.",
//     email: "anandhababu2024ae.gcare@gmail.com",
   
//   },
//   {
//     name: "Dhanush Raja R V",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Dhanush Raja R V.png",
//     bio: "Focuses on clinical data analysis and workflow optimization.",
//     email: "dhanushrajv2024ae.gcare@gmail.com",
  
//   },
//   {
//     name: "Edwin Prasanth B",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Edwin Prasanth B.png",
//     bio: "Expert in healthcare solutions and patient systems.",
//     email: "edwinprasanth07@gmail.com",
    
//   },

  
//   {
//     name: "Manikandan S",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Manikandan S.png",
//     bio: "Develops software solutions for medical systems.",
//     email: "manikandan2024ae.gcare@gmail.com",
  
//   },

//   {
//     name: "PraveenKumar S",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/PraveenKumar S.jpg",
//     bio: "Engineer specializing in clinical data processing.",
//     email: "praveenkumar2024ae.gcare@gmail.com",
   
//   },
//   {
//     name: "Ramkumar R",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Ramkumar R.png",
//     bio: "Conducts research in advanced healthcare systems.",
//     email: "ramkumar2024ae.gcare@gmail.com.",
   
//   },
//   {
//     name: "Santhosh D",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Santhosh D.jpg",
//     bio: "Creates mobile applications for medical services.",
//     email: "santhosh2024ae.gcare@gmail.com",
    
//   },
//   {
//     name: "Shyambenadict M L",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Shyambenadict M L.jpg",
//     bio: "Applies artificial intelligence to medical research.",
//     email: "shyambenadict2024ae.gcare@gmail.com",
    
//   },
//   {
//     name: "Surya P",
//     role: "Assistant Engineer ",
//     image: "/images/healthcare/Surya P.png",
//     bio: "Analyzes health informatics data for better care.",
//     email: "surya2024ae.gcare@gmail.com",
    
//   },
//   {
//     name: "Vignesh V",
//     role: "Assistant Engineer",
//     image: "/images/healthcare/Vignesh V.png",
//     bio: "Works on engineering data pipelines for healthcare.",
//     email: "vignesh2024ae.gcare@gmail.com",
   
//   }
// ],

//   "data-engineers": [
//     { name: "Uma Saraswathi Subramaniyan", 
//       role: "Data Engineer", 
//       image: "/images/ai-scientists/umasaraswathi.png",
//       bio: "Leads AI-driven healthcare projects for hospitals.",
//       email: "umasaraswathis.ai@gmail.com",
//       linkedin: "https://www.linkedin.com/in/umasaraswathi-s-0850802a5/"
//      },
//     // ...add others
//   ],

//     "social-entrepreneurs": [
//     { name: "Purushothaman", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s1.jpeg", bio: "Drives sustainable social enterprises." },
//     { name: "Rajan", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s2.jpeg", bio: "Promotes inclusive technology adoption." },
//     { name: "Nithya", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s3.jpeg" },
//     { name: "Meena Patel", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/meena.jpg" },
//     { name: "Siddharth Rao", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/siddharth.jpg" },
//     { name: "Ritu Agarwal", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/ritu.jpg" },
//     { name: "Vikash Kumar", role: "", image: "/images/social-entrepreneurs/vikash.jpg" },
//     { name: "Prachi Goyal", role: "Social Enterprise Consultant", image: "/images/social-entrepreneurs/prachi.jpg" },
//   ],
// };

// // Titles for categories
// const categoryTitles = {
//   "ai-scientists": "AI Scientists",
//   healthcare: "Healthcare Technologists",
//   "data-engineers": "Data Engineers",
//   "social-entrepreneurs": "Social Entrepreneurs",
// };

// const Team = () => {
//   const { category } = useParams();
//   const members = teamData[category] || [];

//   // If no category is selected
//   if (!category) {
//     return (
//       <div className="team-page">
//         <h1 className="team-title">Our Team</h1>
//         <p className="team-subtitle">
//           Choose a team category from the navigation menu to view our talented professionals.
//         </p>
//         <div className="team-stats">
//           {Object.entries(teamData).map(([key, teamMembers]) => (
//             <div key={key} className="team-stat-card">
//               <h3>{categoryTitles[key]}</h3>
//               <p>{teamMembers.length} Members</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="team-page">
//       <h1 className="team-title">{categoryTitles[category] || "Our Team"}</h1>
//       <p className="team-subtitle">
//         Meet our {members.length} talented {categoryTitles[category]?.toLowerCase()}
//       </p>

//       {members.length > 0 ? (
//         <div className="team-container">
//           {members.map((member, index) => (
//             <div className="team-card" key={index}>
//               <div className="team-card-inner">
//                 {/* Front */}
//                 <div className="team-card-front">
//                   <img src={member.image} alt={member.name} className="team-img" />
//                   <h3>{member.name}</h3>
//                   <p>{member.role}</p>
//                 </div>

//                 {/* Back */}
//                 <div className="team-card-back">
//                   <h3>{member.name}</h3>
//                   <p className="bio">{member.bio || "No bio available."}</p>
//                   {member.email && (
//                     <p className="contact">
//                       <a href={`mailto:${member.email}`}>{member.email}</a>
//                     </p>
//                   )}
//                   {member.linkedin && (
//                     <p className="contact">
//                       <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
//                         LinkedIn
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="no-members">No team members available for this category.</p>
//       )}
//     </div>
//   );
// };

// export default Team;






// import React from "react";
// import { useParams } from "react-router-dom";
// import "./Team.css";

// const teamData = {
//   "ai-scientists": [
//     { name: "Anupriya Narasimman", role: "Junior Developer", image: "/images/ai-scientists/Anu.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "anupriyan.ai@gmail.com", linkedin: "https://www.linkedin.com/in/anupriyanarasimman/" },
//     { name: "Aparna Ravi", role: "Junior Developer", image: "/images/ai-scientists/Aparna.jpg", bio: "Leads AI-driven healthcare projects for hospitals.", email: "alexander@example.com", linkedin: "https://linkedin.com/in/alexander" },
//     { name: "Deepika Saiganesh", role: "Junior Developer", image: "/images/ai-scientists/Deepika.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "deepikas0707.ai@gmail.com", linkedin: " https://www.linkedin.com/in/deepika-s-451897337/" },
//     { name: "Dharani Velu", role: "Junior Developer", image: "/images/ai-scientists/Dharani.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "dharaniv.ai14@gmail.com", linkedin: "https://www.linkedin.com/in/dharani-v-5bb0b8333/" },
//     { name: "Divya Veerabhadram", role: "Junior Developer", image: "/images/ai-scientists/Divya D V.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "divyadv.ai@gmail.com", linkedin: "https://www.linkedin.com/in/divya-d-v-337b99331/" },
//     { name: "Divya Velumani", role: "Junior Developer", image: "/images/ai-scientists/Divya.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "divyav16.ai@gmail.com", linkedin: "https://www.linkedin.com/in/divya-v-173894332/" },
//     { name: "Gomathi Krishnan", role: "Junior Developer", image: "/images/ai-scientists/Gomathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "gomathik30.ai@gmail.com", linkedin: "https://www.linkedin.com/in/gomathi-k-997239369/" },
//     { name: "Jeyalakshmi Mariyappan", role: "Junior Developer", image: "/images/ai-scientists/jeyalakshmi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "jeyalakshmim.ai01@gmail.com", linkedin: "https://www.linkedin.com/in/jeyalakshmi-m-2a3020341/" },
//     { name: "Keerthana S", role: "Junior Developer", image: "/images/ai-scientists/Keerthana.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "keerthanas15.ai@gmail.com", linkedin: "https://www.linkedin.com/in/keerthana-s-2bba62303/" },
//     { name: "Keerthika Sankar", role: "Junior Developer", image: "/images/ai-scientists/keerthika.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "keerthis21.ai@gmail.com", linkedin: "https://www.linkedin.com/in/keerthikasankar/" },
//     { name: "Padmavathi Shanmugam", role: "Junior Developer", image: "/images/ai-scientists/Padmavathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "padmavathis14.ai@gmail.com", linkedin: "www.linkedin.com/in/padmavathi-s-632384334" },
//     { name: "Pavithra Venkateshan", role: "Junior Developer", image: "/images/ai-scientists/pavi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "pavithrav13.ai@gmail.com", linkedin: "https://www.linkedin.com/in/pavithravenkatesan2003" },
//     { name: "Priya Venkateshan", role: "Junior Developer", image: "/images/ai-scientists/Priya.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "priyav63.ai@gmail.com", linkedin: "https://www.linkedin.com/in/priya-v-4b31b7335/" },
//     { name: "Reena Poongavanam", role: "Junior Developer", image: "/images/ai-scientists/Reena.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "reenap21.ai@gmail.com", linkedin: "https://www.linkedin.com/in/reenapoongavanam/" },
//     { name: "Sujatha Velayudham", role: "Junior Developer", image: "/images/ai-scientists/Sujatha.jpg", bio: "Leads AI-driven healthcare projects for hospitals.", email: "sujathav2003.ai@gmail.com", linkedin: "https://www.linkedin.com/in/sujatha-velayutham-20a89033a/" },
//     { name: "Uma Saraswathi Subramaniyan", role: "Junior Developer", image: "/images/ai-scientists/umasaraswathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "umasaraswathis.ai@gmail.com", linkedin: "https://www.linkedin.com/in/umasaraswathi-s-0850802a5/" },
//   ],

//   "healthcare": [
//     { name: "Jansi Periyanayaki M", role: "general secretary", image: "/images/healthcare/Jansi Periyanayaki M.png", bio: "Works on nursing data management and healthcare records.", email: "jansinayaki@gmail.com" },
//     { name: "Alexander R", role: "Chief Technical Officer", image: "/images/healthcare/Alexander R.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "alexander22797@gamil.com" },
//     { name: "Monisha P", role: "Executive HR", image: "/images/healthcare/Monisha P.jpg", bio: "Researches innovations in digital healthcare.", email: "monishapurusothaman6@gmail.com" },
//     { name: "Padma G", role: "Executive HR", image: "/images/healthcare/Padma G.jpg", bio: "Expert in telemedicine and remote patient care.", email: "gpadma010699@gmail.com" },
//     { name: "Lavakumar R", role: "Communication Officer", image: "/images/healthcare/Lavakumar R.png", bio: "Builds AI-powered healthcare applications.", email: "executivegcare@gmail.com" },
//     { name: "Anandhababu K", role: "Assistant Engineer", image: "/images/healthcare/Anandhababu K.png", bio: "Specializes in predictive analytics for patient care.", email: "anandhababu2024ae.gcare@gmail.com" },
//     { name: "Dhanush Raja R V", role: "Assistant Engineer", image: "/images/healthcare/Dhanush Raja R V.png", bio: "Focuses on clinical data analysis and workflow optimization.", email: "dhanushrajv2024ae.gcare@gmail.com" },
//     { name: "Edwin Prasanth B", role: "Assistant Engineer", image: "/images/healthcare/Edwin Prasanth B.png", bio: "Expert in healthcare solutions and patient systems.", email: "edwinprasanth07@gmail.com" },
//     { name: "Manikandan S", role: "Assistant Engineer", image: "/images/healthcare/Manikandan S.jpg", bio: "Develops software solutions for medical systems.", email: "manikandan2024ae.gcare@gmail.com" },
//     { name: "Ramkumar R", role: "Assistant Engineer", image: "/images/healthcare/Ramkumar R.jpg", bio: "Conducts research in advanced healthcare systems.", email: "ramkumar2024ae.gcare@gmail.com" },
//     { name: "Santhosh D", role: "Assistant Engineer", image: "/images/healthcare/Santhosh D.jpg", bio: "Creates mobile applications for medical services.", email: "santhosh2024ae.gcare@gmail.com" },
//     { name: "Shyambenadict M L", role: "Assistant Engineer", image: "/images/healthcare/Shyambenadict M L.jpg", bio: "Applies artificial intelligence to medical research.", email: "shyambenadict2024ae.gcare@gmail.com" },
//   ],

//   "data-engineers": [
//     { name: "Uma Saraswathi Subramaniyan", role: "Data Engineer", image: "/images/ai-scientists/umasaraswathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "umasaraswathis.ai@gmail.com", linkedin: "https://www.linkedin.com/in/umasaraswathi-s-0850802a5/" },
//   ],

//   "social-entrepreneurs": [
//     { name: "Purushothaman", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s1.jpeg", bio: "Drives sustainable social enterprises." },
//     { name: "Rajan", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s2.jpeg", bio: "Promotes inclusive technology adoption." },
//     { name: "Nithya", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s3.jpeg" },
//     { name: "Meena Patel", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/meena.jpg" },
//     { name: "Siddharth Rao", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/siddharth.jpg" },
//     { name: "Ritu Agarwal", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/ritu.jpg" },
//     { name: "Vikash Kumar", role: "", image: "/images/social-entrepreneurs/vikash.jpg" },
//     { name: "Prachi Goyal", role: "Social Enterprise Consultant", image: "/images/social-entrepreneurs/prachi.jpg" },
//   ],
// };

// const categoryTitles = {
//   "ai-scientists": "AI Scientists",
//   healthcare: "Healthcare Technologists",
//   "data-engineers": "Data Engineers",
//   "social-entrepreneurs": "Social Entrepreneurs",
// };

// const Team = () => {
//   const { category } = useParams();
//   const members = teamData[category] || [];

//   if (!category) {
//     return (
//       <div className="team-page">
//         <h1 className="team-title">Our Team</h1>
//         <p className="team-subtitle">
//           Choose a team category from the navigation menu to view our talented professionals.
//         </p>
//         <div className="team-stats">
//           {Object.entries(teamData).map(([key, teamMembers]) => (
//             <div key={key} className="team-stat-card">
//               <h3>{categoryTitles[key]}</h3>
//               <p>{teamMembers.length} Members</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="team-page">
//       <h1 className="team-title">{categoryTitles[category] || "Our Team"}</h1>
//       <p className="team-subtitle">
//         Meet our {members.length} talented {categoryTitles[category]?.toLowerCase()}
//       </p>

//       {members.length > 0 ? (
//         <div className="team-container">
//           {members.map((member, index) => (
//             <div className="team-card" key={index}>
//               <div className="team-card-inner">
//                 <div className="team-card-front">
//                   <img src={member.image} alt={member.name} className="team-img" />
//                   <h3>{member.name}</h3>
//                   <p>{member.role}</p>
//                 </div>
//                 <div className="team-card-back">
//                   <h3>{member.name}</h3>
//                   <p className="bio">{member.bio || "No bio available."}</p>
//                   {member.email && (
//                     <p className="contact">
//                       <a href={`mailto:${member.email}`}>{member.email}</a>
//                     </p>
//                   )}
//                   {member.linkedin && (
//                     <p className="contact">
//                       <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
//                         LinkedIn
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="no-members">No team members available for this category.</p>
//       )}
//     </div>
//   );
// };

// export default Team;



import React from "react";
import { useParams } from "react-router-dom";
import "./Team.css";

// Cache-busting version for team photos. Bump this whenever a photo is
// replaced but keeps the same filename, so browsers/CDNs fetch the new file
// instead of serving a previously cached copy.
const TEAM_IMAGE_VERSION = "2";

const teamData = {
  "ai-scientists": [
    { name: "Anupriya Narasimman", role: "Junior Developer", image: "/images/ai-scientists/Anu.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "anupriyan.ai@gmail.com", linkedin: "https://www.linkedin.com/in/anupriyanarasimman/" },
    { name: "Aparna Ravi", role: "Junior Developer", image: "/images/ai-scientists/Aparna.jpg", bio: "Leads AI-driven healthcare projects for hospitals.", email: "alexander@example.com", linkedin: "https://linkedin.com/in/alexander" },
    { name: "Deepika Saiganesh", role: "Junior Developer", image: "/images/ai-scientists/Deepika.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "deepikas0707.ai@gmail.com", linkedin: "https://www.linkedin.com/in/deepika-s-451897337/" },
    { name: "Dharani Velu", role: "Junior Developer", image: "/images/ai-scientists/Dharani.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "dharaniv.ai14@gmail.com", linkedin: "https://www.linkedin.com/in/dharani-v-5bb0b8333/" },
    { name: "Divya Veerabhadram", role: "Junior Developer", image: "/images/ai-scientists/Divya D V.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "divyadv.ai@gmail.com", linkedin: "https://www.linkedin.com/in/divya-d-v-337b99331/" },
    { name: "Divya Velumani", role: "Junior Developer", image: "/images/ai-scientists/Divya.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "divyav16.ai@gmail.com", linkedin: "https://www.linkedin.com/in/divya-v-173894332/" },
    { name: "Gomathi Krishnan", role: "Junior Developer", image: "/images/ai-scientists/Gomathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "gomathik30.ai@gmail.com", linkedin: "https://www.linkedin.com/in/gomathi-k-997239369/" },
    { name: "Jeyalakshmi Mariyappan", role: "Junior Developer", image: "/images/ai-scientists/jeyalakshmi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "jeyalakshmim.ai01@gmail.com", linkedin: "https://www.linkedin.com/in/jeyalakshmi-m-2a3020341/" },
    { name: "Keerthana S", role: "Junior Developer", image: "/images/ai-scientists/Keerthana.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "keerthanas15.ai@gmail.com", linkedin: "https://www.linkedin.com/in/keerthana-s-2bba62303/" },
    { name: "Keerthika Sankar", role: "Junior Developer", image: "/images/ai-scientists/keerthika.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "keerthis21.ai@gmail.com", linkedin: "https://www.linkedin.com/in/keerthikasankar/" },
    { name: "Padmavathi Shanmugam", role: "Junior Developer", image: "/images/ai-scientists/Padmavathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "padmavathis14.ai@gmail.com", linkedin: "www.linkedin.com/in/padmavathi-s-632384334" },
    { name: "Pavithra Venkateshan", role: "Junior Developer", image: "/images/ai-scientists/pavi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "pavithrav13.ai@gmail.com", linkedin: "https://www.linkedin.com/in/pavithravenkatesan2003" },
    { name: "Priya Venkateshan", role: "Junior Developer", image: "/images/ai-scientists/Priya.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "priyav63.ai@gmail.com", linkedin: "https://www.linkedin.com/in/priya-v-4b31b7335/" },
    { name: "Reena Poongavanam", role: "Junior Developer", image: "/images/ai-scientists/Reena.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "reenap21.ai@gmail.com", linkedin: "https://www.linkedin.com/in/reenapoongavanam/" },
    { name: "Sujatha Velayudham", role: "Junior Developer", image: "/images/ai-scientists/Sujatha.jpg", bio: "Leads AI-driven healthcare projects for hospitals.", email: "sujathav2003.ai@gmail.com", linkedin: "https://www.linkedin.com/in/sujatha-velayutham-20a89033a/" },
    { name: "Uma Saraswathi Subramaniyan", role: "Junior Developer", image: "/images/ai-scientists/umasaraswathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "umasaraswathis.ai@gmail.com", linkedin: "https://www.linkedin.com/in/umasaraswathi-s-0850802a5/" },
  ],

  "healthcare": [
    { name: "Jansi Periyanayaki M", role: "general secretary", image: "/images/healthcare/Jansi Periyanayaki M.png", bio: "Works on nursing data management and healthcare records.", email: "jansinayaki@gmail.com" },
    { name: "Alexander R", role: "Chief Technical Officer", image: "/images/healthcare/Alexander R.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "alexander22797@gamil.com" },
    { name: "Monisha P", role: "Executive HR", image: "/images/healthcare/Monisha P.jpg", bio: "Researches innovations in digital healthcare.", email: "monishapurusothaman6@gmail.com" },
    { name: "Padma G", role: "Executive HR", image: "/images/healthcare/Padma G.jpg", bio: "Expert in telemedicine and remote patient care.", email: "gpadma010699@gmail.com" },
    { name: "Lavakumar R", role: "Communication Officer", image: "/images/healthcare/Lavakumar R.png", bio: "Builds AI-powered healthcare applications.", email: "executivegcare@gmail.com" },
    { name: "Anandhababu K", role: "Assistant Engineer", image: "/images/healthcare/Anandhababu K.png", bio: "Specializes in predictive analytics for patient care.", email: "anandhababu2024ae.gcare@gmail.com" },
    { name: "Dhanush Raja R V", role: "Assistant Engineer", image: "/images/healthcare/Dhanush Raja R V.png", bio: "Focuses on clinical data analysis and workflow optimization.", email: "dhanushrajv2024ae.gcare@gmail.com" },
    { name: "Edwin Prasanth B", role: "Assistant Engineer", image: "/images/healthcare/Edwin Prasanth B.jpg", bio: "Expert in healthcare solutions and patient systems.", email: "edwinprasanth07@gmail.com" },
    { name: "Manikandan S", role: "Assistant Engineer", image: "/images/healthcare/Manikandan S.jpg", bio: "Develops software solutions for medical systems.", email: "manikandan2024ae.gcare@gmail.com" },
    { name: "Ramkumar R", role: "Assistant Engineer", image: "/images/healthcare/Ramkumar R.jpg", bio: "Conducts research in advanced healthcare systems.", email: "ramkumar2024ae.gcare@gmail.com" },
    { name: "Santhosh D", role: "Assistant Engineer", image: "/images/healthcare/Santhosh D.jpg", bio: "Creates mobile applications for medical services.", email: "santhosh2024ae.gcare@gmail.com" },
    { name: "Shyambenadict M L", role: "Assistant Engineer", image: "/images/healthcare/Shyambenadict M L.jpg", bio: "Applies artificial intelligence to medical research.", email: "shyambenadict2024ae.gcare@gmail.com" },
  ],

  "data-engineers": [
    { name: "Uma Saraswathi Subramaniyan", role: "Data Engineer", image: "/images/ai-scientists/umasaraswathi.png", bio: "Leads AI-driven healthcare projects for hospitals.", email: "umasaraswathis.ai@gmail.com", linkedin: "https://www.linkedin.com/in/umasaraswathi-s-0850802a5/" },
  ],

  "social-entrepreneurs": [
    { name: "Purushothaman", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s1.jpeg", bio: "Drives sustainable social enterprises." },
    { name: "Rajan", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s2.jpeg", bio: "Promotes inclusive technology adoption." },
    { name: "Nithya", role: "Social Entrepreneurs", image: "/images/social-entrepreneurs/s3.jpeg" },
  ],
};

const categoryTitles = {
  "ai-scientists": "AI Scientists",
  healthcare: "Healthcare Technologists",
  "data-engineers": "Data Engineers",
  "social-entrepreneurs": "Social Entrepreneurs",
};

const Team = () => {
  const { category } = useParams();
  const members = teamData[category] || [];

  if (!category) {
    return (
      <div className="team-page">
        <h1 className="team-title">Our Team</h1>
        <p className="team-subtitle">
          Choose a team category from the navigation menu to view our talented professionals.
        </p>
        <div className="team-stats">
          {Object.entries(teamData).map(([key, teamMembers]) => (
            <div key={key} className="team-stat-card">
              <h3>{categoryTitles[key]}</h3>
              <p>{teamMembers.length} Members</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="team-page">
      <h1 className="team-title">{categoryTitles[category] || "Our Team"}</h1>
      <p className="team-subtitle">
        Meet our {members.length} talented {categoryTitles[category]?.toLowerCase()}
      </p>

      {members.length > 0 ? (
        <div className="team-container">
          {members.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-card-inner">
                <div className="team-card-front">
                  <img src={`${member.image}?v=${TEAM_IMAGE_VERSION}`} alt={member.name} className="team-img" />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <div className="team-card-back">
                  <h3>{member.name}</h3>
                  <p className="bio">{member.bio || "No bio available."}</p>
                  {member.email && (
                    <p className="contact">
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                    </p>
                  )}
                  {member.linkedin && (
                    <p className="contact">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-members">No team members available for this category.</p>
      )}
    </div>
  );
};

export default Team;