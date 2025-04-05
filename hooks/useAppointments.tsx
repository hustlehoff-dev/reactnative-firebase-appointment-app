import { useEffect, useState } from "react";

type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  time: string;
};

export const useAppointments = (selectedDate: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (selectedDate) {
      fetchAppoitments(selectedDate);
    }
  });
};
