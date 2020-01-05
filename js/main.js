'use strict';

var firebaseConfig = {
  apiKey: "AIzaSyBiTX1VKWHlSyCBTjVP1rsBLs2lH98y_3Y",
  authDomain: "mychatapp-4359f.firebaseapp.com",
  databaseURL: "https://mychatapp-4359f.firebaseio.com",
  projectId: "mychatapp-4359f",
  storageBucket: "mychatapp-4359f.appspot.com",
  messagingSenderId: "698181633029",
  appId: "1:698181633029:web:156268cb812c397abfc86c",
  measurementId: "G-V7KHLLVCFN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const settings = {
  /* your settings... */
  timestampsInSnapshots: true
};
db.settings(settings);

const collection = db.collection('messages');

const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');

collection.orderBy('created').get().then(snapshot => {
  snapshot.forEach(doc => {
    const li = document.createElement('li');
    li.textContent = doc.data().message;
    messages.appendChild(li);
  })
})

form.addEventListener('submit', e => {
  e.preventDefault();
  const val = message.value.trim();
  if (val == '') {
    return;
  }

  const li = document.createElement('li');
  li.textContent = val;
  messages.appendChild(li);

  message.value = '';
  message.focus();

  collection.add({
      message: message.value,
      created: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(doc => {
      console.log(`${doc.id} added!`);

    }).catch(error => {
      console.log(error);
    });
})

message.focus();