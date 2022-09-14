const nameInput = document.querySelector(".name-input")
const resultInput = document.querySelector(".result-input")
const submitButton = document.querySelector(".submit-btn")
const copyButton = document.querySelector(".copy-btn")

let arrayOfName;

let getData = async (e) => {
  e.preventDefault();
  let inputValue = nameInput.value.toLowerCase().trim();
  const reg = /[A-Za-z]/
  if (!reg.test(inputValue)) {
    return;
  } else {
    if (localStorage.getItem("names") === null) {
      arrayOfName = [];
    } else {
      arrayOfName = JSON.parse(localStorage.getItem("names"));
    }
    if (arrayOfName.find(el => el === inputValue)) {
      resultInput.value = "";
      return;
    } else {
      try {
        let inputValue = nameInput.value.toLowerCase().trim()
        arrayOfName.push(inputValue)
        localStorage.setItem("names", JSON.stringify(arrayOfName));
        console.log(arrayOfName)
        let response = await fetch(`https://api.genderize.io?name=${inputValue}`)
        if (!response.ok) {
          throw new Error(`Http error: ${response.statusText}`);
        }
        let data = await response.json()
        resultInput.value = `Gender: ${data.gender}`;
      } catch (error) {
        console.log(`${error}`)
      }
    }
    try {
      let inputValue = nameInput.value.toLowerCase().trim()
      let response = await fetch(`https://api.nationalize.io/?name=${inputValue}`)
      if (!response.ok) {
        throw new Error(`Http error: ${response.statusText}`);
      }
      let data = await response.json()
      resultInput.value = `${resultInput.value}, Nationality: ${data.country[0].country_id}`;
    } catch (error) {
      console.log(`${error}`)
    }
  }
}

let getCopy = (e) => {
  e.preventDefault();
  resultInput.select();
  document.execCommand("copy");
}

submitButton.addEventListener("click", getData)
copyButton.addEventListener("click", getCopy)