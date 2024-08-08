import React from 'react';
import { EventForm } from './EventForm';
import { useEventFormActions } from '../model/useEventFormActions';
interface EventFormViewProps {
  isEditing: boolean;
}

export const EventFormView = ({
  isEditing,
}: EventFormViewProps): JSX.Element => {
  const {
    state,
    updateField,
    startTime,
    endTime,
    startTimeError,
    endTimeError,
    handleStartTimeChange,
    handleEndTimeChange,
    isRepeating,
    setIsRepeating,
  } = useEventFormActions();

  return (
    <EventForm>
      <EventForm.Header isEditing={isEditing} />
      <EventForm.Form
        state={state}
        updateField={updateField}
        startTime={startTime}
        endTime={endTime}
        startTimeError={startTimeError}
        endTimeError={endTimeError}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
        isRepeating={isRepeating}
        setIsRepeating={setIsRepeating}
      />
      <EventForm.SubmitBtn
        isEditing={isEditing}
        addOrUpdateEvent={() => console.log('temp')}
      />
    </EventForm>
  );
};
