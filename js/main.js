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
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
db.settings(settings);


// 컬렉션 추가
const collection = db.collection('messages');



const form = document.querySelector('form');
const messages = document.getElementById('messages');
const message = document.getElementById('message');
const login = document.getElementById('login');
const logout = document.getElementById('logout');

const auth = firebase.auth();
let me = null;

login.addEventListener('click', () => {
  auth.signInAnonymously();
});

logout.addEventListener('click', () => {
  auth.signOut();
});

auth.onAuthStateChanged(user => {
  if (user) {
    me = user;

    while (messages.firstChild) {
      messages.removeChild(messages.firstChild);
    }
    collection.orderBy('created').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {

        if (change.type === 'added') {
          const li = document.createElement('li');
          const d = change.doc.data();
          li.textContent = d.uid + ':' + d.message;
          messages.appendChild(li);

        }
      })
    }, error => {

    });
    console.log(user.uid);
    login.classList.add('hidden');
    [logout, form, messages].forEach(el => {
      el.classList.remove('hidden');
    });
    message.focus();
    return;
  }
  console.log('로그아웃 상태입니다.');
  login.classList.remove('hidden');
  [logout, form, messages].forEach(el => {
    el.classList.add('hidden');
  });



})

form.addEventListener('submit', e => {
  e.preventDefault();
  const val = message.value.trim();
  if (val == '') {
    return;
  }

  message.value = '';
  message.focus();



  // const li = document.createElement('li');
  // li.textContent = val;
  // messages.appendChild(li);



  collection.add({
      message: val,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid: me ? me.uid : 'Nobody',
    })
    .then(doc => {
      console.log(`${doc.id} : ${val} added!`);

    }).catch(error => {
      console.log(error);
    });
})

message.focus();