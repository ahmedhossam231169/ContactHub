var total = []
var favorites = []
var emergency = []
var contactName = document.querySelector('#contactName');
var contactPhone = document.querySelector('#contactPhone');
var contactEmail = document.querySelector('#contactEmail');
var contactAddress = document.querySelector('#contactAddress');
var contactGroup = document.querySelector('#contactGroup');
var addBtn = document.querySelector('.save-form');
var contactNotes = document.querySelector('#contactNotes');
var facheack = document.querySelector('#facheack');
var emgcheck = document.querySelector('#emgcheck');
var searchInput = document.querySelector('#searchInput');
var searchBtn = document.querySelector('#searchBtn');
var cardsCartona = document.querySelector('#contact-cards');
var personCard = document.querySelector('#person-card');
var favMinCard = document.querySelector('.fav-min-card');
var emgMinCard = document.querySelector('.emg-min-card');
var noFav = document.querySelector('.noFav');
var noEmg = document.querySelector('.noEmg');
var contactsHeader = document.querySelector('.contants-header');
var editingIndex = null;

if (contactName) contactName.required = true;
if (contactPhone) contactPhone.required = true;
if (contactEmail) contactEmail.required = true;

function showValidation(message, field) {
  try {
    if (typeof Swal !== 'undefined' && Swal.fire) {
      Swal.fire({ icon: 'error', title: 'Validation error', text: message }).then(function () {
        if (field && field.focus) field.focus();
      });
      return;
    }
  } catch (e) {

  }
  alert(message);
  if (field && field.focus) field.focus();
}
if (localStorage.getItem("total") != null) {
  total = JSON.parse(localStorage.getItem("total"))
}
if (localStorage.getItem("favorites") != null) {
  favorites = JSON.parse(localStorage.getItem("favorites"))
}
if (localStorage.getItem("emergency") != null) {
  emergency = JSON.parse(localStorage.getItem("emergency"))
}
function addContact() {
  console.log('addContact called');
  if (!contactName || !contactPhone || !contactEmail) {
    showValidation('Form fields are missing. Please reload the page.', null);
    return;
  }

  var nameValue = contactName.value.trim();
  var phoneValue = contactPhone.value.trim();
  var emailValue = contactEmail.value.trim();
  var addressValue = contactAddress.value.trim();
  var groupValue = contactGroup.value;
  var notesValue = contactNotes.value;

  if (!nameValue) {
    showValidation('Name is required.', contactName);
    return;
  }
  var nameRegex = /^[A-Za-z\u0600-\u06FF\s]+$/;
  if (!nameRegex.test(nameValue)) {
    showValidation('Name must contain letters only.', contactName);
    return;
  }
  if (!phoneValue) {
    showValidation('Phone number is required.', contactPhone);
    return;
  }
  if (!emailValue) {
    showValidation('Email is required.', contactEmail);
    return;
  }

  var emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(emailValue)) {
    showValidation('Please enter a valid email address.', contactEmail);
    return;
  }

  var digits = phoneValue.replace(/\D/g, '');
  if (digits.startsWith('20')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  var egyptMobileRegex = /^1[0125]\d{8}$/;
  if (!egyptMobileRegex.test(digits)) {
    showValidation('Please enter a valid Egyptian mobile number (e.g. 01012345678).', contactPhone);
    return;
  }

  var contact = {
    name: nameValue,
    phone: phoneValue,
    email: emailValue,
    address: addressValue,
    group: groupValue,
    notes: notesValue
  };

  var existingId = null;
  if (editingIndex !== null && total[editingIndex]) {
    existingId = total[editingIndex].id;
    contact.id = existingId;
    total[editingIndex] = contact;
  } else {
    contact.id = Date.now().toString();
    total.push(contact);
  }

  localStorage.setItem("total", JSON.stringify(total))

  var isFavorite = document.querySelector('#facheack').checked;
  var isEmergency = document.querySelector('#emgcheck').checked;

  favorites = favorites.filter(function (c) { return c.id !== contact.id; });
  emergency = emergency.filter(function (c) { return c.id !== contact.id; });

  if (isFavorite) {
    favorites.push(contact);
  }
  if (isEmergency) {
    emergency.push(contact);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites))
  localStorage.setItem("emergency", JSON.stringify(emergency))

  clearForm()
  displayContactsCard()
  displayContacts()
  // Hide modal and show success feedback
  var modalEl = document.getElementById('exampleModal');
  if (modalEl) {
    var modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.hide();
  }
  try {
    if (typeof Swal !== 'undefined' && Swal.fire) {
      Swal.fire({ title: 'Good job!', text: editingIndex !== null ? 'Contact updated.' : 'Your contact has been saved.', icon: 'success' });
    }
  } catch (e) { }
  editingIndex = null;
}
if (addBtn) {
  addBtn.addEventListener('click', function (e) {
    e.preventDefault();
    addContact();
  });
} else {
}
function displayContactsCard() {
  cardsCartona.innerHTML = `<div class="row g-2">
        <div class="col-6 col-lg-4">
          <div class="main-card  total d-flex align-items-center gap-3 bg-white">
            <div class="icon"><i class="fa-solid fa-people-group"></i></i></div>
            <div class="content">
              <h6 class="m-0 fw-bolder text-black-50">Total</h6>
              <span class="fw-bold fs-3">${total.length}</span>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-4">
          <div class="main-card  Favorites d-flex align-items-center gap-3 bg-white">
            <div class="icon"><i class="fa-solid fa-star"></i></div>
            <div class="content">
              <h6 class="m-0 fw-bolder text-black-50">Favorites</h6>
              <span class="fw-bold fs-3">${favorites.length}</span>
            </div>
          </div>
        </div>
        <div class="col-6 col-lg-4">
          <div class="main-card  emergency d-flex align-items-center gap-3 bg-white">
            <div class="icon"><i class="fa-solid fa-heart-pulse"></i></div>
            <div class="content">
              <h6 class="m-0 fw-bolder text-black-50">Emergency</h6>
              <span class="fw-bold fs-3">${emergency.length}</span>
            </div>
          </div>
        </div>
      </div>`
}
function displayFavorItesCard() {
  favMinCard.innerHTML = "";
  if (favorites.length > 0) {
    noFav.style.display = "none";
    favMinCard.classList.remove("d-none");
    for (var i = 0; i < favorites.length; i++) {
      favMinCard.innerHTML += `
      <div class="yellow-card d-flex bg-light p-3 justify-content-between">
      <div class="left d-flex  align-items-center gap-2">
                    <div class="icon fs-6">${favorites[i].name.charAt(0)}</div>
                    <div class="info">
                      <h6 class="m-0">${favorites[i].name}</h6>
                      <p class="m-0 p-0 text-black-50">${favorites[i].phone}</p>
                    </div>
                  </div>
                  <div class="right  fs-6"><a href="tel:${favorites[i].phone}"><i class="fa-solid fa-phone"></i></a></div>
                  </div>`
    }
  } else {
    favMinCard.classList.add("d-none");
    noFav.style.display = "block";
  }
}
function displayEmergencyCard() {
  emgMinCard.innerHTML = "";
  if (emergency.length > 0) {
    noEmg.style.display = "none";
    emgMinCard.classList.remove("d-none");
    for (var i = 0; i < emergency.length; i++) {
      emgMinCard.innerHTML += `
      <div class="red-card d-flex bg-light p-3 justify-content-between">
        <div class="left d-flex align-items-center gap-2">
                  <div class="icon fs-6">${emergency[i].name.charAt(0)}</div>
                  <div class="info">
                    <h6 class="m-0">${emergency[i].name}</h6>
                    <p class="m-0 p-0 text-black-50">${emergency[i].phone}</p>
                  </div>
                </div>
                <div class="right fs-6"><a href="tel:${emergency[i].phone}"><i class="fa-solid fa-phone"></i></a></div>
                  </div>`
    }
  } else {
    emgMinCard.classList.add("d-none");
    noEmg.style.display = "block";
  }
}
function clearForm() {
  contactName.value = ""
  contactPhone.value = ""
  contactEmail.value = ""
  contactAddress.value = ""
  contactGroup.value = ""
  contactNotes.value = ""
  facheack.checked = false;
  emgcheck.checked = false;
  editingIndex = null;
  if (addBtn) {
    addBtn.textContent = "Save Contact";
  }
}
function deleteContact(index) {
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${total[index].name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#C62222",
    cancelButtonColor: "#606773",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      var removed = total.splice(index, 1)[0];
      if (removed) {
        if (removed.id !== undefined) {
          favorites = favorites.filter(function (c) { return c.id !== removed.id; });
          emergency = emergency.filter(function (c) { return c.id !== removed.id; });
        } else {
          favorites = favorites.filter(function (c) { return !(c.phone === removed.phone && c.name === removed.name); });
          emergency = emergency.filter(function (c) { return !(c.phone === removed.phone && c.name === removed.name); });
        }
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      localStorage.setItem("emergency", JSON.stringify(emergency));
      localStorage.setItem("total", JSON.stringify(total));
      displayFavorItesCard();
      displayEmergencyCard();
      displayContacts();
      displayContactsCard();
      Swal.fire({
        title: "Deleted!",
        text: "Your contact has been deleted.",
        icon: "success"
      });
    }
  });
}
function editContact(index) {
  editingIndex = index;
  var contact = total[index];
  if (!contact) {
    return;
  }

  contactName.value = contact.name;
  contactPhone.value = contact.phone;
  contactEmail.value = contact.email;
  contactAddress.value = contact.address;
  contactGroup.value = contact.group;
  contactNotes.value = contact.notes;
  facheack.checked = favorites.some(function (c) { return c.id === contact.id; });
  emgcheck.checked = emergency.some(function (c) { return c.id === contact.id; });
  if (addBtn) {
    addBtn.textContent = "Update Contact";
  }

  var modalEl = document.getElementById('exampleModal');
  if (modalEl) {
    var modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
  }
}
function displayContacts() {
  contactsHeader.innerHTML = `
            <h2 class="fw-bold m-0">All Contacts</h2>
            <span class="text-black-50">Manage and organize your ${total.length} contacts</span>
            <div class="search-bar position-relative mt-4">
              <i class="fa-solid fa-magnifying-glass position-absolute text-black-50"></i>
              <input id="searchInput" type="search" class="w-100 " placeholder="Search for contacts...">
            </div>
`
  var cardsHtml = "";
  for (var i = 0; i < total.length; i++) {
    cardsHtml += `<div class="col-12 col-lg-6">
              <div class="Contact-card bg-white  mb-3">
                <div class="padding">
                  <div class="Contact-card-header d-flex align-items-center gap-3">
                    <div class="icon d-flex justify-content-center position-relative align-items-center">
                    <span class="text-white fw-bold fs-5">${total[i].name.charAt(0)}</span>
                          <div class="star-abslote position-absolute d-flex align-items-center justify-content-center ${favorites.some(function (c) { return c.id === total[i].id; }) ? 'd-block' : 'd-none'} fa-star "><i class="fa-regular fa-star"></i></div>
                      <div class="heart-abslote position-absolute d-flex align-items-center justify-content-center ${emergency.some(function (c) { return c.id === total[i].id; }) ? 'd-block' : 'd-none'} fa-heart-pulse "><i class="fa-solid fa-heart-pulse"></i></div>
                        </div>
                        
                    <div class="content">
                      <h5 class="m-0 fw-bold mb-1">${total[i].name}</h5>
                      <span class="text-black-50 d-flex align-items-center gap-2">
                        <div class="card-mini-icon phone"><i class="fa-solid fa-phone "></i></div> ${total[i].phone}
                      </span>
                    </div>
                  </div>
                  <span class="text-black-50 d-flex align-items-center gap-2 my-3">
                    <div class="card-mini-icon email"><i class="fa-solid fa-envelope "></i></div> ${total[i].email}
                  </span>
                  <span class="text-black-50 d-flex align-items-center gap-2 mb-3">
                    <div class="card-mini-icon location"><i class="fa-solid fa-location-dot "></i></div> ${total[i].address}
                  </span>
                  <div class="state d-flex align-items-center gap-3">
                    <span class="padge-span work ">${total[i].group}</span>
                    <span class="padge-span emergency-badge ${emergency.some(function (c) { return c.id === total[i].id; }) ? 'd-block bg-danger text-white' : 'd-none'}"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>
                  </div>
                </div>
                <div
                  class="Contact-card-footer d-flex justify-content-between align-items-center p-2 gap-3 mt-3 py-3 px-1 bg-light ">
                  <div class="right d-flex align-items-center gap-2">
                    <div class="call"><a href="tel:${total[i].phone}"><i class="fa-solid fa-phone"></i></a></div>
                    <div class="msg"><a href="mailto:${total[i].email}"><i class="fa-solid fa-envelope "></i></a></div>
                  </div>
                  <div class="left d-flex align-items-center gap-2">
                    <div data-action="favorite" data-index="${i}" class="footer-icon star text-black-50"><i class="${favorites.some(function (c) { return c.id === total[i].id; }) ? 'fa-solid text-warning' : 'fa-regular'} fa-star"></i></div>
                    <div data-action="emergency" data-index="${i}" class="footer-icon heart text-black-50"><i class="${emergency.some(function (c) { return c.id === total[i].id; }) ? 'fa-solid fa-heart-pulse text-danger' : 'fa-regular fa-heart'}"></i></div>
                    <div data-action="edit" data-index="${i}" class="footer-icon pen text-black-50"><i class="fa-solid fa-pen"></i></div>
                    <div data-action="delete" data-index="${i}" class="footer-icon deleteBtn trash text-black-50"><i class=" fa-solid fa-trash"></i></div>
                  </div>
                </div>
              </div>
            </div>`

    bindSearchInput();

  }
  personCard.innerHTML = cardsHtml;

  displayFavorItesCard();
  displayContactsCard();
  displayEmergencyCard();
}
function toggleFavorite(index) {
  var contact = total[index];
  if (!contact) {
    return;
  }
  var favoriteIndex = favorites.findIndex(function (c) { return c.id === contact.id; });
  if (favoriteIndex === -1) {
    favorites.push(contact);
  } else {
    favorites.splice(favoriteIndex, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorItesCard();
  displayContactsCard();
  displayContacts();
}
function toggleEmergency(index) {
  var contact = total[index];
  if (!contact) {
    return;
  }
  var emergencyIndex = emergency.findIndex(function (c) { return c.id === contact.id; });
  if (emergencyIndex === -1) {
    emergency.push(contact);
  } else {
    emergency.splice(emergencyIndex, 1);
  }
  localStorage.setItem('emergency', JSON.stringify(emergency));
  displayEmergencyCard();
  displayContactsCard();
  displayContacts();
}
function handlePersonCardAction(event) {
  var button = event.target.closest('.footer-icon[data-action]');
  if (!button || !personCard.contains(button)) {
    return;
  }
  var index = parseInt(button.dataset.index, 10);
  if (Number.isNaN(index)) {
    return;
  }
  var action = button.dataset.action;
  if (action === 'favorite') {
    toggleFavorite(index);
  } else if (action === 'emergency') {
    toggleEmergency(index);
  } else if (action === 'edit') {
    editContact(index);
  } else if (action === 'delete') {
    deleteContact(index);
  }
}
if (personCard) {
  personCard.addEventListener('click', handlePersonCardAction);
}

function handleSearchInput() {
  if (!searchInput) {
    return;
  }
  var query = searchInput.value.toLowerCase();
  var filteredContacts = total
    .map(function (contact, index) {
      return { contact: contact, index: index };
    })
    .filter(function (item) {
      return item.contact.name.toLowerCase().includes(query)
        || item.contact.email.toLowerCase().includes(query)
        || item.contact.phone.toLowerCase().includes(query);
    });
  displayFilteredContacts(filteredContacts);
}

function bindSearchInput() {
  if (searchInput) {
    searchInput.removeEventListener('input', handleSearchInput);
  }
  searchInput = document.querySelector('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }
}

displayFavorItesCard();
displayContactsCard();
displayContacts();
displayEmergencyCard();

function displayFilteredContacts(filtered) {
  var cardsHtml = "";
  for (var i = 0; i < filtered.length; i++) {
    var contact = filtered[i].contact;
    var originalIndex = filtered[i].index;
    cardsHtml += `<div class="col-12 col-lg-6">
              <div class="Contact-card bg-white  mb-3">
                <div class="padding">
                  <div class="Contact-card-header d-flex align-items-center gap-3">
                    <div class="icon d-flex justify-content-center align-items-center"><span
                        class="text-white fw-bold fs-5">${contact.name.charAt(0)}</span></div>
                    <div class="content">
                      <h5 class="m-0 fw-bold mb-1">${contact.name}</h5>
                      <span class="text-black-50 d-flex align-items-center gap-2">
                        <div class="card-mini-icon phone"><i class="fa-solid fa-phone "></i></div> ${contact.phone}
                      </span>
                    </div>

                  </div>
                  <span class="text-black-50 d-flex align-items-center gap-2 my-3">
                    <div class="card-mini-icon email"><i class="fa-solid fa-envelope "></i></div> ${contact.email}
                  </span>
                  <span class="text-black-50 d-flex align-items-center gap-2 mb-3">
                    <div class="card-mini-icon location"><i class="fa-solid fa-location-dot "></i></div> ${contact.address}
                  </span>
                  <div class="state d-flex align-items-center gap-3">
                    <span class="padge-span work ">work</span>
                    <span class="padge-span emergency-badge ${emergency.some(function (c) { return c.id === contact.id; }) ? 'd-block bg-danger text-white' : 'd-none'}"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>
                  </div>
                </div>
                <div
                  class="Contact-card-footer d-flex justify-content-between align-items-center p-2 gap-3 mt-3 py-3 px-1 bg-light ">
                  <div class="right d-flex align-items-center gap-2">
                    <div class="call"><a href="tel:${contact.phone}"><i class="fa-solid fa-phone"></i></a></div>
                    <div class="msg"><a href="mailto:${contact.email}"><i class="fa-solid fa-envelope "></i></a></div>
                  </div>
                  <div class="left d-flex align-items-center gap-2">
                    <div data-action="favorite" data-index="${originalIndex}" class="footer-icon star text-black-50"><i class="${favorites.some(function (c) { return c.id === contact.id; }) ? 'fa-solid text-warning' : 'fa-regular'} fa-star"></i></div>
                    <div data-action="emergency" data-index="${originalIndex}" class="footer-icon heart text-black-50"><i class="${emergency.some(function (c) { return c.id === contact.id; }) ? 'fa-solid fa-heart-pulse text-danger' : 'fa-regular fa-heart'}"></i></div>
                    <div data-action="edit" data-index="${originalIndex}" class="footer-icon pen text-black-50"><i class="fa-solid fa-pen"></i></div>
                    <div data-action="delete" data-index="${originalIndex}" class="footer-icon deleteBtn trash text-black-50"><i class=" fa-solid fa-trash"></i></div>
                  </div>
                </div>
              </div>
            </div>
`
  }
  personCard.innerHTML = cardsHtml;
}
