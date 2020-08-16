const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector("input");
const pendingLS = document.querySelector(".js-pendingLS");
const finisheLS = document.querySelector(".js-finisheLS");
const list = document.querySelector(".list");
const penTitle = list.querySelector(".pen_title");
const finiTitle = list.querySelector(".fini_title");

const PENDING_LS = 'pendings';
const FINISHED_LS = "finisheds";
const BUTTON_CSS = 'button';

const BLIND = "form";
const SHOWING = "showing";

let pendings = [];
let finisheds = [];

function compleAndRep(event){
  deleteToDo(event);
  
  const btn = event.target;
  const li = btn.parentNode;
  const text = li.firstChild.innerText;
  const emoji = btn.innerText;
  if(emoji === "⏪"){
    paintToDo(text,true);
  }else{
    paintToDo(text,false);
  }  
}

function deleteToDo(event){
  const btn = event.target;
  const li = btn.parentNode;
  const className = li.parentNode.className;
  if(className === "js-pendingLS"){
    pendingLS.removeChild(li);
    const cleanToDos = pendings.filter(function(toDo){
     return toDo.id !== parseInt(li.id);
    });
    pendings = cleanToDos;
    saveHandle(false);
  }else if(className === "js-finisheLS"){
    finisheLS.removeChild(li);
    const cleanToDos = finisheds.filter(function(toDo){
     return toDo.id !== parseInt(li.id);
    });
    finisheds = cleanToDos;
    saveHandle(true);
  }
  titleHandle();
}

function saveHandle(finished){
  if(finished){
    localStorage.setItem(FINISHED_LS,JSON.stringify(finisheds));
  }else{
    localStorage.setItem(PENDING_LS,JSON.stringify(pendings));
  }  
}

function paintToDo(text,PnF){
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const completeBtn = document.createElement("button");
  const span = document.createElement("sapn");
  const newId = Math.floor(Math.random()*10000000);
  delBtn.innerText = "❌";
  delBtn.classList.add(BUTTON_CSS);
  delBtn.addEventListener("click",deleteToDo);
  completeBtn.innerText = PnF ?"✅":"⏪";
  completeBtn.classList.add(BUTTON_CSS);
  completeBtn.addEventListener("click",compleAndRep);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(completeBtn);
  li.id = newId;
  if(PnF){
    pendingLS.appendChild(li);
    const pendingObj = {
      text: text,
      id: newId,
    }
    pendings.push(pendingObj);
    saveHandle(false);
  }else{
    finisheLS.appendChild(li);
   const finisheObj = {
     text: text,
     id: newId,
    }
  finisheds.push(finisheObj);
  saveHandle(true);
  }
  titleHandle();
}

function titleHandle(){
	if(pendings.length !== 0){
		penTitle.classList.remove(BLIND);
		penTitle.classList.add(SHOWING);
	}else{
		penTitle.classList.remove(SHOWING);
		penTitle.classList.add(BLIND);
	}
	if(finisheds.length !== 0){
		finiTitle.classList.remove(BLIND);
		finiTitle.classList.add(SHOWING);
	}else{
		finiTitle.classList.remove(SHOWING);
		finiTitle.classList.add(BLIND);
	}
}

function handleSubmit(event){
  event.preventDefault();
  const tmpValue = toDoInput.value;
  paintToDo(tmpValue,true);
  toDoInput.value = "";
}

function loadToDos(){
  const loadPendings = localStorage.getItem(PENDING_LS);
  const loadFinishes = localStorage.getItem(FINISHED_LS);

  if(loadPendings !== null){
    const parsedToDos = JSON.parse(loadPendings);
    parsedToDos.forEach(function(toDo){
      paintToDo(toDo.text,true);
	});
	
  }
  if(loadFinishes !== null){
    const parsedCopleToDos = JSON.parse(loadFinishes);
    parsedCopleToDos.forEach(function(toDo){
      paintToDo(toDo.text,false);
    });
  }
}

function init(){
  loadToDos();
  toDoForm.addEventListener("submit",handleSubmit);
}

init();