export function getAppointmentsForDay(state, day) {
  
  const filteredDay = state.days.filter(e => e.name === day);

  if(filteredDay.length === 0) { return [] }

  const appointmentDay = filteredDay[0].appointments.map(id => state.appointments[id]);
  
  return appointmentDay;
}

export function getInterview(state, interview) {
  
  if(!interview) { return null }

  const filteredInterview = { student: interview.student, 
    interviewer: state.interviewers[interview.interviewer] };
  
  return filteredInterview;
}

export function getInterviewersForDay(state, day) {
  
  const filteredDay = state.days.filter(e => e.name === day);

  if(state.days.length === 0 || filteredDay.length === 0) { return [] }

  const interviewerBooked = filteredDay[0].interviewers.map(id => state.interviewers[id]);
  
  return interviewerBooked;
}
