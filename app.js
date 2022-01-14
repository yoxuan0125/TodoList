let section=document.querySelector("section");
let add= document.querySelector("form button");
add.addEventListener("click",e=>{
  //prevent submitted
  e.preventDefault();

  //get the input value
  let form=e.target.parentElement;
  let todoText= form.children[0].value;
  let todoMonth= form.children[1].value;
  let todoDate= form.children[2].value;

  if (todoText===""){
    alert("Please Enter some Text");
    return;
  }

  //create a todo
  let todo= document.createElement("div");
  todo.classList.add("todo");
  let text=document.createElement("p");
  text.classList.add("todo-text");
  text.innerText=todoText;
  let time=document.createElement("p");
  time.classList.add("todo-time");
  time.innerText=todoMonth + " / " +todoDate;
  todo.appendChild(text);
  todo.appendChild(time);

  //create green check and trash can
  let completeButton= document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML='<i class="fas fa-check-square"></i>';
  completeButton.addEventListener("click",e=>{
    let todoItem=e.target.parentElement;
    todoItem.classList.toggle("done");
  })

  let trashButton=document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML='<i class="fas fa-trash-alt"></i>';
  trashButton.addEventListener("click",e=>{
    let todoItem=e.target.parentElement; 
    todoItem.addEventListener("animationend",()=>{
      todoItem.remove();
    })

    todoItem.style.animation="scaleDown 0.3s forwards";
  })
  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  todo.style.animation="scaleUp 0.3s forwards";

  //Create an object
  let myTodo={
    todoText:todoText,
    todoMonth:todoMonth,
    todoDate:todoDate
  };

  //storage into localstorage
  let myList=localStorage.getItem("list");
  if (myList==null){
    localStorage.setItem("list",JSON.stringify([myTodo]));
  }else{
    let myTodoList=JSON.parse(myList);
    myTodoList.push(myTodo);
    localStorage.setItem("list",JSON.stringify(myTodoList));
  }

  
  form.children[0].value="";//Clear text
  section.appendChild(todo);
})

loadData();

//load data
function loadData(){
  let myList=localStorage.getItem("list");

  if(myList!==null){
    let myTodoList=JSON.parse(myList);
    myTodoList.forEach(item=>{

      let todo= document.createElement("div");
      todo.classList.add("todo");
      let text=document.createElement("p");
      text.classList.add("todo-text");
      text.innerText=item.todoText;
      let time=document.createElement("p");
      time.classList.add("todo-time");
      time.innerText=item.todoMonth + " / " +item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);
      //create green check and trash can
      let completeButton= document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML='<i class="fas fa-check-square"></i>';
      completeButton.addEventListener("click",e=>{
        let todoItem=e.target.parentElement;
        todoItem.classList.toggle("done");
      })

      let trashButton=document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML='<i class="fas fa-trash-alt"></i>';
      trashButton.addEventListener("click",e=>{
        let todoItem=e.target.parentElement; 
        todoItem.addEventListener("animationend",()=>{
          // remove from local storage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          })
  
          todoItem.remove();
        })

        todoItem.style.animation="scaleDown 0.3s forwards";
      })
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      section.appendChild(todo);
    })
  }
}

//sort button
let sort=document.querySelector("div.sort button");
sort.addEventListener("click",e=>{
  let todoListArray=JSON.parse(localStorage.getItem("list"));
  let mergedList=mergeSort(todoListArray);
  localStorage.clear();
  localStorage.setItem("list",JSON.stringify(mergedList));
   // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();}
  loadData();
})


//merge sort algorithm
function mergeTime(arr1,arr2){
  let result=[];
  let i=0;
  let j=0;
  while(i<arr1.length && j<arr2.length){
    if(Number(arr1[i].todoMonth)>Number(arr2[j].todoMonth)){
    result.push(arr2[j]);
    j++;
    }else if(Number(arr1[i].todoMonth)<Number(arr2[j].todoMonth)){
      result.push(arr1[i]);
      i++;
    }else if(Number(arr1[i].todoMonth)==Number(arr2[j].todoMonth)){
      if(Number(arr1[i].todoDate)>Number(arr2[j].todoDate)){
        result.push(arr2[j]);
        j++;
      }else{
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while(i<arr1.length){
    result.push(arr1[i]);
    i++;
  }

  while(j<arr2.length){
    result.push(arr2[j]);
    j++;
  }
  return result;
}

function mergeSort(arr){
  if(arr.length===1){
    return arr;
  }else{

  let middle=Math.floor(arr.length/2);
  let right= arr.slice(0,middle);
  let left= arr.slice(middle,arr.length);
  return mergeTime(mergeSort(right),mergeSort(left));
  }
}
