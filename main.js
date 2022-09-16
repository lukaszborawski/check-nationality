const nameInput = document.querySelector(".name-input");
const resultInput = document.querySelector(".result-input");
const submitButton = document.querySelector(".submit-btn");
const copyButton = document.querySelector(".copy-btn");
const errorText = document.querySelector(".error-text");

let arrayOfName;

const getData = async (e) => {
  let inputValue = nameInput.value.toLowerCase().trim();
  resultInput.value = "";
  if (!nameInput.checkValidity()) {
    errorText.innerHTML = "";
    return;
  } else {
    e.preventDefault();
    if (localStorage.getItem("names") === null) {
      arrayOfName = [];
    } else {
      arrayOfName = JSON.parse(localStorage.getItem("names"));
    }
    if (arrayOfName.find(el => el === inputValue)) {
      errorText.innerHTML = "<h3>The name has already been used</h3>";
      resultInput.value = "";
      return;
    } else {
      try {
        errorText.innerHTML = "";
        let inputValue = nameInput.value.toLowerCase().trim();
        arrayOfName.push(inputValue);
        localStorage.setItem("names", JSON.stringify(arrayOfName));
        let response = await fetch(`https://api.genderize.io?name=${inputValue}`);
        if (!response.ok) {
          throw new Error(`Http error: ${response.statusText}`);
        }
        let data = await response.json();
        if (data.gender === null || data.gender === undefined) {
          errorText.innerHTML = "<h3>Error. Check the name and try again.</h3>";
          resultInput.value = "";
        }
        else {
          resultInput.value = `Gender: ${data.gender}`;
        }
      } catch (error) {
        console.log(`${error}`);
      }
    }
    try {
      let inputValue = nameInput.value.toLowerCase().trim();
      let response = await fetch(`https://api.nationalize.io/?name=${inputValue}`);
      if (!response.ok) {
        throw new Error(`Http error: ${response.statusText}`);
      }
      let data = await response.json();
      if (data.country[0].country_id === null || data.country[0].country_id === undefined) {
        errorText.innerHTML = "<h3>Error. Check the name and try again.</h3>";
        resultInput.value = "";
      }
      else {
        resultInput.value = `${resultInput.value}, Nationality: ${data.country[0].country_id}`;
      }
    } catch (error) {
      console.log(`${error}`);
    }
  }
}

const getCopy = (e) => {
  e.preventDefault();
  resultInput.select();
  document.execCommand("copy");
}

submitButton.addEventListener("click", getData);
copyButton.addEventListener("click", getCopy);