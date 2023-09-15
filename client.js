const fetch = require("node-fetch");

async function fetchUsers(){
  const response = await fetch('http://localhost:3000/users')
  const data = await response.json()
  return data
}

async function fetchTodosConcurrently(userId){
  try{
    const getArray = []
    for(let users = 0;users <5; users++){
      const response = await fetch(`http://localhost:3000/todos?user_id=${userId+users}`);
      const todosArray = await response.json();
      getArray.push(todosArray);
    }
    return getArray
  }catch(error){
    console.log(error)
  }
}


const waitTime = new Promise( (resolve,reject) =>{
  setTimeout( ()=>{
      resolve()  // Sir this was my error i forget to resolve it
  },1000)
})
async function gettodos(userId){
  try{
      const todosArray = await fetchTodosConcurrently(userId)
      await waitTime
      // console.log( todosArray)
      return todosArray
    }catch(error){
    console.log(error)
  }
}

async function main() {
  // 1
  const usersArray = await fetchUsers()
  // console.log(usersArray)
  // 2
  let userId = 1
  const resultTodos = []
  for(let i = 0;i <3;i++){
    const gettodosArray = await gettodos(userId)
    resultTodos.push(gettodosArray)
    userId +=5
  }
  const flattenedArray = resultTodos.flat(2);
  // console.log(flattenedArray);
  let answer = {}
  for(let users in flattenedArray){
    for(let todo in flattenedArray[users]){
      for(let ids in flattenedArray[users][todo]){
        const getId = flattenedArray[users][todo][ids].id.split('-')
        const id = getId[1]
        const numTodosCompletedB = flattenedArray[users][todo][ids].isCompleted
        if(!answer[id]){
          answer[id] = {
            id :id,
            name :`User ${id}`,
            numTodosCompleted :0
          }
        }
        if(numTodosCompletedB === true){
            answer[id].numTodosCompleted++
        }
      }
    }
  }
  let finalResult = []
  for(let index in answer){
    finalResult.push(answer[index])
  }
  console.log(finalResult)
  
  
  
  
  

}
main();


