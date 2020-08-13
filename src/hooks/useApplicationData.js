import { useState, useEffect } from "react"
import axios from "axios";

export function useApplicationData() {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then((response) => {
        setState(prev => ({ ...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data }));
      })
      .catch(err => console.log(err.mesage));
  },[]);

  const setDay = day => setState({ ...state, day });

  const spotsRemaing = (state,appointments) => {
    let appointmentsArray = [];
    //Creating array with one selected day Object
    const filteredDays = state.days.filter(dayItem => dayItem.name === state.day);
    //Creating array with the appointments objects for the selected day
    filteredDays[0].appointments.forEach((element) => {
        appointmentsArray.push(appointments[element]);
    })
    //Creating new array of the interview objects that have interview set to null
    let remainingSpots = 0;
    appointmentsArray.forEach((appointmentObj) => {
        if(!appointmentObj.interview) {
            remainingSpots++
        }
        return remainingSpots
    })
    //Creating newDays array that has days array with updated spots
    let newDays = [];
    state.days.forEach((dayObj) => {
        if(dayObj.name === state.day){
            dayObj.spots = remainingSpots
            newDays.push(dayObj);
        } else {
            newDays.push(dayObj);
        }
    })
    return newDays;
  }

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.put(`/api/appointments/${id}`, appointment)
            .then(() => {
            setState({...state, appointments, days: spotsRemaing(state, appointments)});
            })
  }

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`, appointment)
        .then(() =>  {
          setState({...state, appointments, days: spotsRemaing(state, appointments)});
        })
  }
  return { state, setDay, bookInterview, cancelInterview }
}
