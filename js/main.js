const contactBtn = document.getElementById('contactBtn');
const totalNumOfContact = document.getElementById('totalNumOfContact');
const totalNumOfFav = document.getElementById('totalNumOfFav');
const totalNumOfEmergency = document.getElementById('totalNumOfEmergency');
const searchForContact = document.getElementById('searchForContact');
const contactsContainer = document.getElementById('contacts-container');
const favContainer = document.getElementById('favContainer');
const emergencyContainer = document.getElementById('emergencyContainer');

const iconTips = document.getElementById('icon-tips')

const contactModal = document.getElementById('contact-modal')
const closeModal = document.getElementById("close-modal")
const cancelBtn = document.getElementById('cancelBtn')
const saveBtn = document.getElementById('saveBtn');


const emergencyInput = document.getElementById('emergencyInput');
const favInput = document.getElementById('favInput');
const notesInput = document.getElementById('notesInput');
const selectGroup = document.getElementById('selectGroup');
const addressInput = document.getElementById('addressInput');
const emailInput = document.getElementById('emailInput');
const numberInput = document.getElementById('numberInput');
const nameInput = document.getElementById('nameInput');
const contactPhoto = document.getElementById('contact-photo');

const nameWarning = document.getElementById('nameWarning');
const phoneWarning = document.getElementById('phoneWarning');
const emailWarning = document.getElementById('emailWarning');

// for dark mode handler
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const sunIcon = themeToggleBtn.querySelector('.fa-sun');
const moonIcon = themeToggleBtn.querySelector('.fa-moon');
const HIDE_CLASS = 'd-none';
//=========================//

//const contactsList = []
const contactsList = JSON.parse(localStorage.getItem('contactsList')) ?? [];
console.log(contactsList);

let favContactList = []
let emergencyContactList = []
var numberOfContact = contactsList.length;
var numberOfFavContact = 0;
var numberOfEmergencyContact = 0;

let updatedOrAdd = false;
const emergencyIcon = `<i class="fa-solid d-flex justify-content-center align-items-center fa-heart-pulse position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger"></i>`
const favIcon = ` <i class="fa-solid d-flex justify-content-center align-items-center fa-star position-absolute top-100 start-100 translate-middle badge rounded-circle bg-warning"></i>`

var globalIndex = 0;
var isDuplicatedInput = false;


/* 
==================================
          Authentication
===================================
*/
const nameRegex = /^[A-Za-z\s]{2,50}$/;
const egPhoneRegex = /^01[0125]\d{8}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
// email verification
const isValidEmail = (emailString) => {
    if (!emailString || emailString.length === 0) {
        return false; // Email cannot be empty
    }
    return emailRegex.test(emailString);
}
// phone  verification
const isValidEgPhoneNumber = (numberString) => {
    // 1. Ensure the input is a string of numbers with no spaces or other characters
    // The regex already handles the total length and required start.
    return egPhoneRegex.test(numberString);
}
// name verification
const validateContactName = (name) => {
    // 1. Check if the name meets the length and character rules
    const isValid = nameRegex.test(name);

    // 2. Also ensure the name is not just spaces (e.g., "    ")
    if (isValid && name.trim().length >= 2) {
        return true;
    }

    return false;
}


/* 
==================================
          functions
===================================
*/


// function to split the name to their first letters to made the contact photo
const getInitial = (fullName) => {
    // 1. Clean up and split the name string by spaces
    // The filter(Boolean) removes any empty strings that might result 
    // from multiple spaces (e.g., "John  Doe").
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

    // If no valid name parts are found, return an empty string
    if (nameParts.length === 0) {
        return '';
    }

    // 2. Get the first letter of the first name (always the first part)
    const firstNameInitial = nameParts[0].charAt(0).toUpperCase();

    // 3. Get the last name (the last part of the array)
    const lastName = nameParts[nameParts.length - 1];

    // If there is only one word (e.g., "Cher"), return only the first initial
    if (nameParts.length === 1) {
        return firstNameInitial;
    }

    // 4. Get the first letter of the last name
    const lastNameInitial = lastName.charAt(0).toUpperCase();

    // 5. Combine and return the initials
    return firstNameInitial + lastNameInitial;
}

// function to made the badge of groups
const getGroupBadgeHtml = (groupName) => {
    if (!groupName) {
        return '';
    }

    let iconClass = 'fa-solid fa-tag';
    let colorClass = 'bg-secondary text-secondary';

    switch (groupName) {
        case 'Family':
            iconClass = 'fa-solid fa-house-chimney-user';
            colorClass = 'bg-danger text-danger';
            break;
        case 'Work':
            iconClass = 'fa-solid fa-briefcase';
            colorClass = 'bg-primary text-primary';
            break;
        case 'School':
            iconClass = 'fa-solid fa-graduation-cap';
            colorClass = 'bg-info text-info';
            break;
        case 'Friends':
            iconClass = 'fa-solid fa-handshake-angle';
            colorClass = 'bg-warning text-warning';
            break;
        default:
            break;
    }
    return `
        <div class="rounded-3 ${colorClass} bg-opacity-10 d-inline-block p-1 mb-2">
            <i class="${iconClass} p-1"></i>
            <span>${groupName}</span>
        </div>
    `;
}

// function to display the fav contact on the fav container
const addFavFunc = (item) => {
    favContactList.push(item);
    favContainer.innerHTML += `<div
                                class="fav-card d-flex justify-content-between rounded-4 px-1 m-1 bg-secondary-subtle opacity-10">
                                <div class="d-flex gap-2 align-items-center p-3">
                                    <i class="fa-solid fa- fw-bolder p-3 bg-warning text-white rounded-3">
                                                    ${getInitial(item.contactName)}
                                    </i>
                                    <div>
                                        <p class="fw-bolder m-0 fs-6 ">${item.contactName}</p>
                                        <p class="m-0 fw-bolder text-secondary">${item.contactNumber}</p>
                                    </div>
                                </div>
                               <a href="tel:${item.contactNumber}" class="align-self-center m-0  p-0 border-0"><i
                                                        class="fa-solid fa-phone align-items-center p-2 bg-success text-success bg-opacity-25 rounded-3"></i></a>

                            </div>`

    return;

}

//function to display the emergency contact on the emergency container
const addEmergencyFunc = (item) => {
    emergencyContactList.push(item)
    emergencyContainer.innerHTML += `<div
                                class="fav-card d-flex justify-content-between rounded-4 px-1 m-1 bg-secondary-subtle opacity-10">
                                <div class="d-flex gap-2 align-items-center p-3">
                                    <i class="fa-solid fa- fw-bolder p-3 bg-warning text-white rounded-3">
                                                ${getInitial(item.contactName)}
                                    </i>
                                    <div>
                                        <p class="fw-bolder m-0 fs-6 ">${item.contactName}</p>
                                        <p class="m-0 fw-bolder text-secondary">${item.contactNumber}</p>
                                    </div>
                                </div>
                                <a href="tel:${item.contactNumber}" class="align-self-center m-0  p-0 border-0"><i
                                                        class="fa-solid fa-phone align-items-center p-2 bg-danger text-danger bg-opacity-25 rounded-3"></i></a>

                            </div>`


    return;

}

// const photoHandler = ()=>{
//     if(contactsList[i].contactPhoto){
//          return '<p>aaaaaaa</p>';
//     }
//     else{
//         return getInitial();
//     }
// }




// function that handle the contact container to display all contact
const displayItems = () => {

    var box = '';
    favContainer.innerHTML = '';
    emergencyContainer.innerHTML = '';
    numberOfFavContact = 0;
    numberOfEmergencyContact = 0;
    favContactList = [];
    emergencyContactList = [];
    // 2.
    for (var i = 0; i < contactsList.length; i++) {

        if (contactsList[i].isFav) {
            addFavFunc(contactsList[i]);
            numberOfFavContact++;
        }

        if (contactsList[i].isEmergency) {
            addEmergencyFunc(contactsList[i]);
            numberOfEmergencyContact++;

        }

        box += `
                <div class="number-card col-lg-6 col-md-6 col-12 ">
                                    <div class="inner shadow bg-white rounded-3 ">
                                        <div class="p-3 d-flex flex-column gap-2">
                                            <div class="d-flex gap-3">
                                                <div id="icon-tips"
                                                    class="icon-tips position-relative name-box fs-4  text-white fw-bolder p-3 bg-primary rounded-3 align-self-center d-flex justify-content-center align-items-center d-inline-block">
                                                    ${getInitial(contactsList[i].contactName)}
                                                    ${contactsList[i].isFav ? favIcon : ''}
                                                    ${contactsList[i].isEmergency ? emergencyIcon : ''}
                                                </div>
                                                <div>
                                                    <h5 class="m-0">${contactsList[i].contactName}</h5>
                                                    <div class="icon-container d-flex gap-1">
                                                        <i
                                                            class="fa-solid fa-phone text-primary p-2 bg-primary bg-opacity-25 rounded-3 align-self-center"></i>
                                                        <p class="m-0">${contactsList[i].contactNumber}</p>
                                                    </div>

                                                </div>
                                            </div>

                                            ${contactsList[i].contactEmail ? `<div class="icon-container d-flex gap-1">
                                                <i
                                                    class="fa-solid fa-envelope text-danger p-2 bg-danger bg-opacity-25 rounded-3 align-self-center"></i>
                                                <p class="m-0">${contactsList[i].contactEmail}</p>
                                            </div>` : ''}

                                            ${contactsList[i].contactAddress ? `<div class="icon-container d-flex gap-1">
                                                <i
                                                    class="fa-solid fa-location-dot text-success p-2 bg-success bg-opacity-25 rounded-3 align-self-center"></i>
                                                <p class="m-0">${contactsList[i].contactAddress}</p>
                                            </div>` : ''}
                                            

                                            <div class="inforamtion-icons d-flex gap-2">

                                                ${getGroupBadgeHtml(contactsList[i].contactGroup)}


                                                 ${contactsList[i].isEmergency ? `<div
                                                    class=" rounded-3 bg-danger bg-opacity-10 d-inline-block text-danger p-1 mb-2">
                                                    <i
                                                        class="fa-solid fa-heart-pulse p-1"></i><span>Emergency</span>
                                                </div>` : ''}

                                            </div>

                                        </div>
                                        <div
                                            class="button-container bg-secondary bg-opacity-10 w-100 d-flex justify-content-between p-2">
                                            <div class="button-left d-flex gap-1">
                                                <a href="tel:${contactsList[i].contactNumber}" class="m-0 p-0 border-0"><i
                                                        class="fa-solid fa-phone align-items-center p-2 bg-success text-success bg-opacity-25 rounded-3"></i></a>


                                                         ${contactsList[i].contactEmail ? `<a href="mailto:${contactsList[i].contactEmail}" class="m-0 p-0 border-0"><i
                                                        class="fa-solid fa-envelope align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></a>` : ''}
                                                
                                            </div>
                                            <div class="button-right">
                                                <button data-contact-id="${i}" class="add-fav-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-star align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>
                                                <button data-contact-id="${i}" class="add-emergency-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-heart align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>
                                                <button data-contact-id="${i}"  class="edit-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-pen align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>
                                                <button data-contact-id="${i}"  class="delete-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-trash-can align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>

                                            </div>
                                        </div>
                                    </div>

                                </div>
        `
    }



    // 3.
    totalNumOfContact.textContent = numberOfContact;
    totalNumOfFav.textContent = numberOfFavContact;
    totalNumOfEmergency.textContent = numberOfEmergencyContact;
    contactsContainer.innerHTML = box;
    if (!contactsList.length) {
        contactListIsEmpty();
    }
    if (!favContactList.length) {
        favListIsEmpty();
    }
    if (!emergencyContactList.length) {
        emergencyListIsEmpty();
    }
}

// function that handle the add contact to contact list
const addContact = () => {
    const isDuplicatedArray = isDuplicated();
    if (isDuplicatedArray[0]) {
        alert(`A contact with this phone number already exists:${contactsList[isDuplicatedArray[1]].contactName}`);
        isDuplicatedInput = true;
        return;
    }
    const contact = {
        contactPhoto: contactPhoto.value,
        contactName: nameInput.value,
        contactNumber: numberInput.value,
        contactEmail: emailInput.value,
        contactAddress: addressInput.value,
        contactGroup: selectGroup.value,
        contactNotes: notesInput.value,
        isFav: favInput.checked,
        isEmergency: emergencyInput.checked
    }

    console.log(contact.isEmergency);

    contact.isFav ? favContactList.push(contact) : '';
    contact.isEmergency ? emergencyContactList.push(contact) : '';

    contactsList.push(contact);

    localStorage.setItem('contactsList', JSON.stringify(contactsList))
    numberOfContact++;
    displayItems();
    isDuplicatedInput = false;
    clearForm();
}

//function that handle clear input value
const clearForm = () => {
    contactPhoto.value = '';
    nameInput.value = '';
    numberInput.value = '';
    emailInput.value = '';
    addressInput.value = '';
    selectGroup.value = '';
    notesInput.value = '';
    favInput.checked = false;
    emergencyInput.checked = false;
}

const openModalContact = () => contactModal.classList.add('open'); //open modal function 
const closeModalContact = () => contactModal.classList.remove('open'); // close modal function

// function that handle the delete contact from contact list
const deleteItem = (index) => {
    contactsList.splice(index, 1);
    localStorage.setItem('contactsList', JSON.stringify(contactsList));
    numberOfContact--;
    displayItems();

}

// function that handle the edit contact
const editItem = (index) => {
    contactPhoto.value = contactsList[index].contactPhoto;
    nameInput.value = contactsList[index].contactName;
    numberInput.value = contactsList[index].contactNumber;
    emailInput.value = contactsList[index].contactEmail;
    addressInput.value = contactsList[index].contactAddress;
    selectGroup.value = contactsList[index].contactGroup;
    notesInput.value = contactsList[index].contactNotes;
    favInput.checked = contactsList[index].isFav;
    emergencyInput.checked = contactsList[index].isEmergency;
    openModalContact();
    updatedOrAdd = true;
    globalIndex = index;
    console.log('look');

}

// that function that make the previous edit function useable by update the contact with new data
const updateContact = (index) => {
    console.log("update");

    const contact = {
        contactPhoto: contactPhoto.value,
        contactName: nameInput.value,
        contactNumber: numberInput.value,
        contactEmail: emailInput.value,
        contactAddress: addressInput.value,
        contactGroup: selectGroup.value,
        contactNotes: notesInput.value,
        isFav: favInput.checked,
        isEmergency: emergencyInput.checked
    }

    contactsList.splice(index, 1, contact)
    localStorage.setItem('contactsList', JSON.stringify(contactsList)) //[{} , {}]
    displayItems();
    clearForm();

}

// function that handle the add emergency button on the contact card
const addEmergencyBtn = (index) => {
    contactsList[index].isEmergency = contactsList[index].isEmergency ? false : true;
    localStorage.setItem('contactsList', JSON.stringify(contactsList))
    displayItems();
}
// function that handle the add fav button on the contact card
const addFavBtn = (index) => {
    contactsList[index].isFav = contactsList[index].isFav ? false : true;
    localStorage.setItem('contactsList', JSON.stringify(contactsList))
    displayItems();
}

// function that handle the dark & light mode 
const toggleDarkMode = () => {
    const htmlElement = document.documentElement;

    // 1. Toggle the 'dark-mode' class on the HTML root
    htmlElement.classList.toggle('dark-mode');

    // Check if dark mode is now active
    const isDarkMode = htmlElement.classList.contains('dark-mode');

    // 2. Icon Toggling Logic:
    if (isDarkMode) {
        // We are now in DARK mode: Show the Sun icon (to suggest switching to LIGHT mode)
        sunIcon.classList.remove(HIDE_CLASS);
        moonIcon.classList.add(HIDE_CLASS);
    } else {
        // We are now in LIGHT mode: Show the Moon icon (to suggest switching to DARK mode)
        sunIcon.classList.add(HIDE_CLASS);
        moonIcon.classList.remove(HIDE_CLASS);
    }

    // 3. Save the new preference to Local Storage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};

// function that handle the dark & light mode from local storage
const loadThemePreference = () => {
    const htmlElement = document.documentElement;

    // Check local storage or OS preference (logic from previous answer)
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let shouldBeDarkMode = false;

    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        shouldBeDarkMode = true;
    }

    // Apply the theme class
    if (shouldBeDarkMode) {
        htmlElement.classList.add('dark-mode');

        // Initial Icon State: If starting in dark mode, show the Sun icon
        sunIcon.classList.remove(HIDE_CLASS);
        moonIcon.classList.add(HIDE_CLASS);
    } else {
        // Initial Icon State: If starting in light mode, show the Moon icon
        sunIcon.classList.add(HIDE_CLASS);
        moonIcon.classList.remove(HIDE_CLASS);
    }
};
// function that handle the search

const searchContact = () => {
    var box = '';
    for (var i = 0; i < contactsList.length; i++) {

        if ((contactsList[i].contactName.toLowerCase().includes(searchForContact.value.toLowerCase()))
            || (contactsList[i].contactNumber.includes(searchForContact.value))
            || (contactsList[i].contactEmail.toLowerCase().includes(searchForContact.value.toLowerCase()))) {
            box += `
                <div class="number-card col-lg-6 col-md-6 col-12 ">
                                    <div class="inner shadow bg-white rounded-3 ">
                                        <div class="p-3 d-flex flex-column gap-2">
                                            <div class="d-flex gap-3">
                                                <div id="icon-tips"
                                                    class="icon-tips position-relative name-box fs-4  text-white fw-bolder p-3 bg-primary rounded-3 align-self-center d-flex justify-content-center align-items-center d-inline-block">
                                                    ${getInitial(contactsList[i].contactName)}
                                                    ${contactsList[i].isFav ? favIcon : ''}
                                                    ${contactsList[i].isEmergency ? emergencyIcon : ''}
                                                </div>
                                                <div>
                                                    <h5 class="m-0">${contactsList[i].contactName}</h5>
                                                    <div class="icon-container d-flex gap-1">
                                                        <i
                                                            class="fa-solid fa-phone text-primary p-2 bg-primary bg-opacity-25 rounded-3 align-self-center"></i>
                                                        <p class="m-0">${contactsList[i].contactNumber}</p>
                                                    </div>

                                                </div>
                                            </div>

                                            ${contactsList[i].contactEmail ? `<div class="icon-container d-flex gap-1">
                                                <i
                                                    class="fa-solid fa-envelope text-danger p-2 bg-danger bg-opacity-25 rounded-3 align-self-center"></i>
                                                <p class="m-0">${contactsList[i].contactEmail}</p>
                                            </div>` : ''}

                                            ${contactsList[i].contactAddress ? `<div class="icon-container d-flex gap-1">
                                                <i
                                                    class="fa-solid fa-location-dot text-success p-2 bg-success bg-opacity-25 rounded-3 align-self-center"></i>
                                                <p class="m-0">${contactsList[i].contactAddress}</p>
                                            </div>` : ''}
                                            

                                            <div class="inforamtion-icons d-flex gap-2">

                                                ${getGroupBadgeHtml(contactsList[i].contactGroup)}


                                                 ${contactsList[i].isEmergency ? `<div
                                                    class=" rounded-3 bg-danger bg-opacity-10 d-inline-block text-danger p-1 mb-2">
                                                    <i
                                                        class="fa-solid fa-heart-pulse p-1"></i><span>Emergency</span>
                                                </div>` : ''}

                                            </div>

                                        </div>
                                        <div
                                            class="button-container bg-secondary bg-opacity-10 w-100 d-flex justify-content-between p-2">
                                            <div class="button-left d-flex gap-1">
                                                <a href="tel:${contactsList[i].contactNumber}" class="m-0 p-0 border-0"><i
                                                        class="fa-solid fa-phone align-items-center p-2 bg-success text-success bg-opacity-25 rounded-3"></i></a>


                                                         ${contactsList[i].contactEmail ? `<a href="mailto:${contactsList[i].contactEmail}" class="m-0 p-0 border-0"><i
                                                        class="fa-solid fa-envelope align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></a>` : ''}
                                                
                                            </div>
                                            <div class="button-right">
                                                <button data-contact-id="${i}" class="add-fav-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-star align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>
                                                <button data-contact-id="${i}" class="add-emergency-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-heart align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>
                                                <button data-contact-id="${i}"  class="edit-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-pen align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>
                                                <button data-contact-id="${i}"  class="delete-btn m-0 p-0 border-0"><i
                                                        class="fa-solid fa-trash-can align-items-center p-2 bg-danger bg-opacity-25  text-danger rounded-3"></i></button>

                                            </div>
                                        </div>
                                    </div>

                                </div>
        `
        }
    }
    contactsContainer.innerHTML = box
};

//function to check if the number duplicated or not
const isDuplicated = () => {
    let duplicatedValue = false;

    for (let i = 0; i < contactsList.length; i++) {
        if (contactsList[i].contactNumber == numberInput.value) {
            duplicatedValue = [true, i]
            console.log(i);

            return duplicatedValue;
        }
    }

    duplicatedValue = [false]

    return duplicatedValue;
}

//functions to handle the empty  containers
const contactListIsEmpty = () => {
    contactsContainer.innerHTML = `<div class="col-12 d-flex flex-column justify-content-center align-items-center p-5 m-5">
                                    <i
                                        class="fa-solid fa-address-book  p-3 text-secondary bg-secondary-subtle rounded-3 align-self-center fs-1"></i>
                                        <p>No contacts found</p>
                                        <p>Click "Add Contact" to get started</p>

                                </div>`
}
const favListIsEmpty = () => {
    favContainer.innerHTML = ` <div class="col-12 p-5 d-flex justify-content-center align-items-center">
                                <p class="text-secondary fs-6">No favorites yet</p>
                            </div>`
}
const emergencyListIsEmpty = () => {
    emergencyContainer.innerHTML = ` <div class="col-12 p-5 d-flex justify-content-center align-items-center">
                                <p class="text-secondary fs-6">No emergency contacts</p>
                            </div>`
}

// call functions to setup the display & theme 
loadThemePreference();
displayItems();



/* 
==================================
          event Listener
===================================
*/


// to open the modal from nav bar
contactBtn.addEventListener('click', () => {
    emailInput.classList.remove('is-invalid', 'is-valid');
    numberInput.classList.remove('is-invalid', 'is-valid');
    nameInput.classList.remove('is-invalid', 'is-valid');
    openModalContact();
})
//handle the close & cancel buttons on the modal
const closeButtons = [closeModal, cancelBtn];
closeButtons.forEach(button => {
    if (button) {
        button.addEventListener('click', closeModalContact);
    }

});
// that made the escape to close modal
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModalContact();
    }
});
//handle the Save button & check what is happen {add new contact , update existing contact} 
saveBtn.addEventListener('click', () => {
    if (validateContactName(nameInput.value) && isValidEgPhoneNumber(numberInput.value)) {
        updatedOrAdd ? updateContact(globalIndex) : addContact();
        updatedOrAdd = false;
        isDuplicatedInput ? '' : closeModalContact();
    } else {
        console.log('no');

    }

})


// =============== listener that control the addfav & addEmergency & edit and delete buttons on the contact card ===================== //


// control the delete 
contactsContainer.addEventListener('click', (e) => {
    const deleteButton = e.target.closest('.delete-btn');
    if (deleteButton) {
        e.preventDefault();
        const index = deleteButton.getAttribute('data-contact-id');
        deleteItem(parseInt(index));
    }
});
// control the edit 
contactsContainer.addEventListener('click', (e) => {
    const edit = e.target.closest('.edit-btn');
    if (edit) {
        e.preventDefault();
        const index = edit.getAttribute('data-contact-id');
        editItem(parseInt(index));
    }
});
// control the addEmergency 
contactsContainer.addEventListener('click', (e) => {
    const addEmergency = e.target.closest('.add-emergency-btn');
    if (addEmergency) {
        e.preventDefault();
        const index = addEmergency.getAttribute('data-contact-id');
        addEmergencyBtn(parseInt(index));
    }
});
// control the addFav 
contactsContainer.addEventListener('click', (e) => {
    const addFav = e.target.closest('.add-fav-btn');
    if (addFav) {
        e.preventDefault();
        const index = addFav.getAttribute('data-contact-id');
        addFavBtn(parseInt(index));
    }
});


// =============== listener that control the Authentication ===================== //

// control the name input 
nameInput.addEventListener('input', () => {
    const nameValue = nameInput.value;

    if (nameValue.length === 0) {
        nameWarning.classList.add('d-none');
        nameInput.classList.remove('is-invalid', 'is-valid');
        return;
    }

    if (validateContactName(nameValue)) {
        nameWarning.classList.add('d-none');
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
    } else {
        nameWarning.classList.remove('d-none');
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
    }
});
// control the number input 
numberInput.addEventListener('input', () => {
    const numberValue = numberInput.value;

    if (numberValue.length === 0) {
        phoneWarning.classList.add('d-none');
        numberInput.classList.remove('is-invalid', 'is-valid');
        return;
    }

    if (isValidEgPhoneNumber(numberValue)) {
        phoneWarning.classList.add('d-none');
        numberInput.classList.remove('is-invalid');
        numberInput.classList.add('is-valid');
    } else {
        phoneWarning.classList.remove('d-none');
        numberInput.classList.add('is-invalid');
        numberInput.classList.remove('is-valid');
    }
});
// control the email input 
emailInput.addEventListener('input', () => {
    const emailValue = emailInput.value;

    if (emailValue.length === 0) {
        emailWarning.classList.add('d-none');
        emailInput.classList.remove('is-invalid', 'is-valid');
        return;
    }

    if (isValidEmail(emailValue)) {
        emailWarning.classList.add('d-none');
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    } else {
        emailWarning.classList.remove('d-none');
        emailInput.classList.add('is-invalid');
        emailInput.classList.remove('is-valid');
    }
});


//====================== listener that control the dark mode======================//


// Attach the listener to the button
themeToggleBtn.addEventListener('click', toggleDarkMode);






//==========================listener that handle the search ============================//
searchForContact.addEventListener('input', searchContact);
