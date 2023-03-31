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

//return an array with the user's session numbers for the specified amount of days
export async function getSessionData(dayAmount) {

  let sessions = {};
  const todayDate = new Date();
  let datesFromLastWeek = [];  //string format: "month-day-year"

  //get dates of days to be queried
  for(let i=0; i<dayAmount; i++) {
    let date = new Date();
    date.setDate(todayDate.getDate() - i);

    datesFromLastWeek.push((date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear());
  }

  let populatedSessions = {}; //data from existing docs

  //query for docs
  for(let date of datesFromLastWeek) {
    await firestore.collection('users').doc(auth.currentUser.uid).collection('sessions')
    .where('date', '==', date)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let docDate = doc.data()['date'];
        let docCompleted = doc.data()['completed'];
        populatedSessions[docDate] = docCompleted;
      })
    })
    .catch(e => {
      console.error("Error getting document for graph data: ", e);
    });
  }

  /*
  await firestore.collection('users').doc(auth.currentUser.uid).collection('sessions')
    .where('date', 'in', datesFromLastWeek)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let docDate = doc.data()['date'];
        let docCompleted = doc.data()['completed'];
        populatedSessions[docDate] = docCompleted;
      })
    });
  */

  let reversedDates = datesFromLastWeek.slice().reverse();  //dates set in ascending order for graph
  for (let date of reversedDates) {
    if(Object.keys(populatedSessions).includes(date)) {
      sessions[date] = populatedSessions[date];
    } else {
      sessions[date] = 0;
    }
  }

  return sessions;
}


/*
export function getMonthData() {
  let sessions = {};

  const dateObj = new Date();
  let month = dateObj.getMonth()+1; 

  //
  for(let i=0; i<30; i++) {
    let date = new Date();
    date.setDate(dateObj.getDate() - i);

    datesFromLastWeek.push((date.getMonth()+1) + '-' + date.getDate() + '-' + date.getFullYear());
  }

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
*/