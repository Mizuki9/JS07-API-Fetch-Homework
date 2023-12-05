console.log("JS07 - API Fetch Homework");

// ======================= Classes =======================

/** Row Class - All are readable and editable
 * #id;
 * #firstName;
 * #lastName;
 * #eMail;
 * #picture;
 * 
 * row() // Fnc @returns HTML code for a table's row
 */
class Row {
  #id;
  #firstName;
  #lastName;
  #eMail;
  #picture;

  constructor(id, firstName, lastName, eMail, picture) {
    this.#id = id;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#eMail = eMail;
    this.#picture = picture;
  }

  get id() {
    return this.#id;
  }

  set id(newId) {
    this.#id = newId;
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(newFirstName) {
    this.#firstName = newFirstName;
  }

  get lastName() {
    return this.#lastName;
  }

  set lastName(newLastName) {
    this.#lastName = newLastName;
  }

  get eMail() {
    return this.#eMail;
  }

  set eMail(newEMail) {
    this.#eMail = newEMail;
  }

  get picture() {
    return this.#picture;
  }

  set picture(newPicture) {
    this.#picture = newPicture;
  }

  row() {
    return `
      <tr>
            <th scope="row">${this.#id}</th>
            <td>${this.#firstName}</td>
            <td>${this.#lastName}</td>
            <td>${this.#eMail}</td>
            <td><img src="${this.#picture}"
                class="img-fluid rounded images-sizes" alt="Placeholder Image"></td>
          </tr>
      `
  }

}

// ======================= Functions =======================

/**
 * @returns promise / object
*/
const getInformationFromUrl = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(error);
  }
}
/**
 * @returns promise / array of objects class Row
 */
const reorganizeDataIntoRowClass = async (url) => {
  const data = (await getInformationFromUrl(url)).data;
  const newRow = data.map(element => new Row(
    element.id,
    element.email,
    element.first_name,
    element.last_name,
    element.avatar,
  ));
  return newRow;
}

const printUrlInDomRows = async (IdFromHTML, url) => {
  const htmlContainer = document.getElementById(IdFromHTML);
  const data = await reorganizeDataIntoRowClass(url);
  const arrayOfHtmlCodeWithData = data.map(
    (element, index, array) => new Row(element.id, element.firstName, element.lastName, element.eMail, element.picture).row());
  htmlContainer.innerHTML = arrayOfHtmlCodeWithData.join("");
  showButton("reload-user-information-button");
}

const emptyPlaceholdersFromHtml = IdFromHTML => (document.getElementById(IdFromHTML)).innerHTML = "";

const sendFetchedDataToLocalStorage = async (url) => {
  const data = (await getInformationFromUrl(url)).data;
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("time", Date.now());

  const localData = localStorage.getItem("data");
  console.log(`(${localStorage.getItem("time")}) Stored the following information in the local storage:`);
  console.table(localData ? JSON.parse(localData) : []);

}

const printLocalStorageInDomRows = async (IdFromHTML, localStorageData) => {
  const data = localStorageData.map(element => new Row(
    element.id,
    element.email,
    element.first_name,
    element.last_name,
    element.avatar,
  ));
  const htmlContainer = document.getElementById(IdFromHTML);
  const arrayOfHtmlCodeWithData = data.map(
    (element, index, array) => new Row(element.id, element.firstName, element.lastName, element.eMail, element.picture).row());
  htmlContainer.innerHTML = arrayOfHtmlCodeWithData.join("");
  showButton("reload-user-information-button");
}

const hideButton = IdFromHTML => (document.getElementById(IdFromHTML)).style.visibility = 'hidden';
const showButton = IdFromHTML => (document.getElementById(IdFromHTML)).style.visibility = '';

// ======================= Executed Code =======================

emptyPlaceholdersFromHtml("empty-rows");
hideButton("reload-user-information-button");
const url = "https://reqres.in/api/users?delay=3";
printUrlInDomRows("empty-rows", url);
sendFetchedDataToLocalStorage(url);

// ======================= Button Function =======================

/**
 * The "Reload User Information" button checks if more than a minute has passed since the last time information was fetched.
 * If so, it fetches the information again.
 * If not, it loads the information from the Local Storage.
 */
(document.getElementById("reload-user-information-button")).addEventListener("click", (event) => {
  hideButton("reload-user-information-button");
  emptyPlaceholdersFromHtml("empty-rows");

  const oldTime = localStorage.getItem("time", Date.now());
  const newTime = Date.now();

  if (newTime - oldTime <= 60_000) {
    setTimeout(function () {
      const data = JSON.parse(localStorage.getItem("data"));
      printLocalStorageInDomRows("empty-rows", data);
    }, 500);
  } else {
    printUrlInDomRows("empty-rows", url);
    sendFetchedDataToLocalStorage(url);
  }
});