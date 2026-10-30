import prisma from "./lib/prisma.js";

import {
  createPatient,
  getPatient,
  searchPatients,
  updatePatientPhone,
  deletePatient
} from "./patients.js";

import {
  createDoctor,
  getDoctor,
  listDoctorsBySpecialty,
  deleteDoctor
} from "./doctors.js";

import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  cancelAllPatientAppointments,
  deleteAppointment
} from "./appointments.js";

async function main() {

  console.log("── Patients ──────────────────────────");

  // Create Patient
  const patient = await createPatient({
    name: "Test Patient",
    email: `test.patient.${Date.now()}@example.com`,
    phone: "9999999999"
  });

  console.log("Created:", patient.name, patient.id);

  // Get Patient
  const found = await getPatient(patient.id);
  console.log("Found:", found.name);

  // Update Patient
  const updated = await updatePatientPhone(
    patient.id,
    "8888888888"
  );

  console.log("Updated phone:", updated.phone);

  // Search Patients
  const results = await searchPatients("Test Patient");
  console.log("Search results:", results.length);


  console.log("── Doctors ───────────────────────────");

  // Create Doctor
  const doctor = await createDoctor({
    name: "Dr. Test",
    specialty: "General Medicine",
    email: `dr.test.${Date.now()}@hospital.io`
  });

  console.log("Created:", doctor.name, doctor.id);

  // Get Doctor
  const foundDoctor = await getDoctor(doctor.id);
  console.log("Found:", foundDoctor.name);

  // Search Doctors
  const specialists = await listDoctorsBySpecialty("General");

  console.log(
    "General Medicine doctors:",
    specialists.length
  );


  console.log("── Appointments ──────────────────────");

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 2);

  // Book Appointment
  const appt = await bookAppointment(
    patient.id,
    doctor.id,
    futureDate,
    "Initial consultation"
  );

  console.log(
    "Booked:",
    appt.id,
    "for",
    appt.patient.name
  );

  // Get Full Appointment
  const full = await getAppointmentFull(appt.id);

  console.log(
    "Full fetch:",
    full.patient.name,
    "with",
    full.doctor.name
  );

  // Doctor Schedule
  const schedule = await getDoctorUpcomingAppointments(
    doctor.id
  );

  console.log(
    "Doctor schedule:",
    schedule.length,
    "appointment(s)"
  );

  // Update Status
  const cancelled = await setAppointmentStatus(
    appt.id,
    "completed"
  );

  console.log(
    "Status updated to:",
    cancelled.status
  );

  // Test bulk cancellation
  const secondAppt = await bookAppointment(
    patient.id,
    doctor.id,
    futureDate,
    "Second appointment"
  );

  const cancelledCount =
    await cancelAllPatientAppointments(patient.id);

  console.log("Bulk cancelled:", cancelledCount);

  // Cleanup
  await deleteAppointment(appt.id);
  await deleteAppointment(secondAppt.id);

  console.log("── Cleanup ───────────────────────────");

  await deletePatient(patient.id);
  await deleteDoctor(doctor.id);

  console.log("Test data cleaned up.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });