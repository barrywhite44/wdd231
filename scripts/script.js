const courses = [
  { subject: "CSE", number: 110, title: "Introduction to Programming", credits: 2, completed: true },
  { subject: "WDD", number: 130, title: "Web Fundamentals", credits: 2, completed: true },
  { subject: "CSE", number: 111, title: "Programming with Functions", credits: 2, completed: true },
  { subject: "CSE", number: 210, title: "Programming with Classes", credits: 2, completed: true },
  { subject: "WDD", number: 131, title: "Dynamic Web Fundamentals", credits: 2, completed: true },
  { subject: "WDD", number: 231, title: "Web Frontend Development I", credits: 2, completed: false }
];

const courseList = document.querySelector("#course-list");
const totalCredits = document.querySelector("#total-credits");
const filterButtons = document.querySelectorAll(".filter");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#main-nav");

function displayCourses(filter = "all") {
  const selectedCourses = filter === "all" ? courses : courses.filter((course) => course.subject.toLowerCase() === filter);
  courseList.innerHTML = selectedCourses.map((course) => `<article class="course${course.completed ? " completed" : ""}" title="${course.title}: ${course.credits} credits">${course.subject} ${course.number}</article>`).join("");
  totalCredits.textContent = selectedCourses.reduce((total, course) => total + course.credits, 0);
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  filterButtons.forEach((filterButton) => { filterButton.classList.remove("active"); filterButton.setAttribute("aria-pressed", "false"); });
  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");
  displayCourses(button.dataset.filter);
}));

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  menuButton.textContent = isOpen ? "×" : "☰";
});

displayCourses();
