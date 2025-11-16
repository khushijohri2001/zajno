import { projectsData } from "./utils/projects-data";
import { studioData } from "./utils/studio-data";

const projectListDiv = document.querySelector(".projects-list");
const studioContentDiv = document.querySelector(".studio-content");



function addProjectsHandler() {
  projectListDiv.innerHTML = "";

  projectsData.forEach((project, index) => {
    const li = document.createElement("li");
    li.className = "project-container border-t flex justify-between gap-8 py-6";

    li.innerHTML = `
    <h4>${project.id}</h4>
    <h1 class="w-[13rem]">${project.features}</h1>
    <h3 class="flex flex-col items-center">
      <span class="text-red-500">${project.name.split(" ")[0]}</span>
      ${project.name.split(" ").slice(1).join(" ")}
    </h3>
    <img src="${project.imgSrc}" alt="Project ${
      project.id
    }" class="w-56 h-56" />
  `;

    projectListDiv.appendChild(li);
  });
}





function addStudioContentHandler() {
  studioContentDiv.innerHTML = "";

  studioData.forEach((content, index) => {
    const div = document.createElement("div");
    div.className = "content-container border-l flex flex-col items-start gap-3 px-4 text-xl font-bold h-[18rem]";

    div.innerHTML = `
    <h2>${content?.title}:</h2>
    <ul class="flex flex-col">
     ${content?.data.map((elem) => ` <li>${elem}</li>`).join("")}
    </ul>
  `;

    studioContentDiv.appendChild(div);
  });
}


addProjectsHandler();
addStudioContentHandler();