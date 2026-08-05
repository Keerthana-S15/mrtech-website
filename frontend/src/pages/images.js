// // // helper: /images/<folder>/1.jpg ... 10.jpg
// // const make = (folder, count = 10) =>
// //   Array.from({ length: count }, (_, i) => `/images/${folder}/${i + 1}.jpg`);

// // const galleries = {
// //   "gcare-atm":      { title: "G Care Health ATM Launch", images: make("gcare-atm", 10) },
// //   "ai-agri":        { title: "AI Agriculture Pilot",     images: make("ai-agri", 10) },
// //   "health-camp":    { title: "Community Health Camp",    images: make("health-camp", 10) },
// //   "tech-conf":      { title: "Tech Conference 2024",     images: make("tech-conf", 10) },
// //   "cha-training":   { title: "CHA Training Program",     images: make("cha-training", 10) },
// //   "impact-awards":  { title: "Social Impact Awards",     images: make("impact-awards", 10) },
// // };

// // export default galleries;



// // helper: generates /images/<folder>/1.jpg ... 10.jpg automatically
// const make = (folder, count = 10) =>
//   Array.from({ length: count }, (_, i) => `/images/${folder}/${i + 1}.jpg`);

// const galleries = {
//   "gcare-atm":      { title: "G Care Health ATM Launch", images: make("gcare-atm", 9) },
//   "ai-agri":        { title: "AI Agriculture Pilot",     images: make("ai-agri", 10) },
//   "health-camp":    { title: "Community Health Camp",    images: make("health-camp", 10) },
//   "tech-conf":      { title: "Tech Conference 2024",     images: make("tech-conf", 10) },
//   "cha-training":   { title: "CHA Training Program",     images: make("cha-training", 10) },
//   "impact-awards":  { title: "Social Impact Awards",     images: make("impact-awards", 10) },
// };

// export default galleries;





// Single prefix helper (original)
const make = (folder, count = 20, ext = "jpeg", prefix = "") =>
  Array.from({ length: count }, (_, i) => `/images/${folder}/${prefix}${i + 1}.${ext}`);

// Multi-prefix helper (NEW - for folders with multiple prefixes)
const makeMulti = (folder, configs) => {
  const images = [];
  configs.forEach(({ prefix = "", count, ext = "jpg", startFrom = 1 }) => {
    for (let i = 0; i < count; i++) {
      images.push(`/images/${folder}/${prefix}${startFrom + i}.${ext}`);
    }
  });
  return images;
};

const galleries = {
  "gcare-atm": { 
    title: "G Care Health ATM Launch", 
    images: make("gcare-atm", 9, "jpg") 
  },
  
  "ai-agri": { 
    title: "AI Agriculture Pilot", 
    images: make("ai-agri", 19, "jpeg", "a") 
  },
  
  "health-camp": { 
    title: "Community Health Camp", 
    images: makeMulti("health-camp", [
      { prefix: "d", count: 2, ext: "jpg", startFrom: 1 },              // d1.jpg, d2.jpg
      { prefix: "IMG-20250218-WA00", count: 41
        , ext: "jpg", startFrom:1 }  // IMG-20250218-WA0056.jpg to WA00101.jpg
    ])
  },
  
  "tech-conf": { 
    title: "Tech Conference 2024", 
    images: make("tech-conf", 10, "jpeg") 
  },
  
  "cha-training": { 
    title: "CHA Training Program", 
    images: make("cha-training", 18, "jpeg", "c") 
  },
  
  "impact-awards": { 
    title: "Social Impact Awards", 
    images: make("impact-awards", 14, "jpeg") 
  },
};

export default galleries;