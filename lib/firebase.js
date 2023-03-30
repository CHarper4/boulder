import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

import { getTodayDate } from './hooks';


const firebaseConfig = {
    apiKey: "AIzaSyDIwPMmGqwf3dniVzpmXboPuk4cmBtmfN8",
    authDomain: "boulder-ce8e1.firebaseapp.com",
    projectId: "boulder-ce8e1",
    storageBucket: "boulder-ce8e1.appspot.com",
    messagingSenderId: "940458675085",
    appId: "1:940458675085:web:c24027cb665f00a5e30bc4",
    measurementId: "G-Y0VBTNBVX3"
  };


if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
};

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

export const firestore = firebase.firestore();
export const storage = firebase.storage();



//util functions

//returns {uid}/sessions/{date}
export function getTodayRef() {
    const date = getTodayDate();
    let todayRef = firestore.collection('users').doc(auth.currentUser.uid).collection('sessions').doc(date);

    return todayRef;
}


//increments {uid}/sessions/{date}.completed
export function incrementCompleted() {
    const todayRef = getTodayRef();
    todayRef.update({completed: firebase.firestore.FieldValue.increment(1)});
}

//return an array with the user's session numbers for the last 7 days
export async function getWeekData() {
  let sessions = {};

  const dateObj = new Date();
  let day = dateObj.getDate();
  let month = dateObj.getMonth()+1;
  let year = dateObj.getFullYear();

  let datesFromLastWeek = [];  //dates from last week in doc title format ("month-day-year")

  for(let i=0; i<7; i++) {
    if(day - i <= 0) {  //hit beginning of month
      break;
    }

    let dayOfMonth = day - i;
    datesFromLastWeek.push(month + '-' + dayOfMonth + '-' + year);
  }

  //query for docs whose titles are in datesFromLastWeek
  await firestore.collection('users').doc(auth.currentUser.uid).collection('sessions')
    .where('date', 'in', datesFromLastWeek)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        
        //add session data to sessions
        let docDate = doc.data()['date'];
        let docCompleted = doc.data()['completed'];
        sessions[docDate] = docCompleted;

        //remove date from datesFromLastWeek
        const index = datesFromLastWeek.indexOf(docDate);
        datesFromLastWeek.splice(index, 1);
      })
    });

  //add any remaining dates in datesFromLastWeek as 0 entries in sessions
  for(let date of datesFromLastWeek) {
    sessions[date] = 0;
  }

  return sessions;
}


export function getMonthData() {
  let sessions = {};

  const dateObj = new Date();
  let month = dateObj.getMonth()+1; 

  firestore.collection('users').doc(auth.currentUser.uid).collection('sessions')
    .where('month', '==', month)
    //.orderBy('day') //'order and limit data' firebase page
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
         let dayKey = doc.data()['day'];
         let daySessions = doc.data()['completed'];
        sessions[dayKey] = daySessions;
      })
    })
    .catch((e) => {
      console.log('Error fetching session docs: ', e);
    })
 
    return sessions;
}