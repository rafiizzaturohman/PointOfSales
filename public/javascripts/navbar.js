let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();//calling the function(optional)
});

// searchBtn.addEventListener("click", () => { // Sidebar open when you click on the search iocn
//     sidebar.classList.toggle("open");
//     menuBtnChange(); //calling the function(optional)
// });

// following are the code to change sidebar button(optional)
function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
    }
}

// let arrow = document.querySelectorAll(".arrow");
// for (var i = 0; i < arrow.length; i++) {
//     arrow[i].addEventListener("click", (e) => {
//         let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
//         arrowParent.classList.toggle("showMenu");
//     });
// }
// let sidebar = document.querySelector(".sidebar");
// let sidebarBtn = document.querySelector(".bx-menu");
// console.log(sidebarBtn);
// sidebarBtn.addEventListener("click", () => {
//     sidebar.classList.toggle("close");
// });