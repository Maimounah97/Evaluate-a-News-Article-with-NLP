// remove the trip from screen
let removeBtn = document.querySelector("#remove");
let trip = document.querySelector("#trip");
removeBtn.addEventListener("click", remove);
function remove (){

trip.remove();
}