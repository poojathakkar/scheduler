import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import { useVisualMode } from "hooks/useVisualMode.js";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDITING = "EDITING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
    .bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch((err) => transition(ERROR_SAVE, true));
  }

  function destroy() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then((res) => transition(EMPTY))
    .catch((err) => transition(ERROR_DELETE, true))
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDITING)}
          />
        )}
        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === SAVING && (
          <Status message="Saving"/>
        )}
        {mode === DELETING && (
          <Status message="Deleting"/>
        )}
         {mode === CONFIRM && (
          <Confirm 
            message="Are you sure you would like to delete?"
            onCancel={back}
            onConfirm={destroy}
          />
        )}
         {mode === EDITING && (
          <Form 
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
          />
        )}
        {mode === ERROR_DELETE && (
          <Error 
            message="Could not cancel appointment" 
            onClose={back}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error 
            message="Could not save appointment" 
            onClose={back}
          />
        )}
    </article>
  )
}