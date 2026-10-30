import prisma from "./lib/prisma.js";

async function main() {

  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  // Create Doctors
  const drPriya = await prisma.doctor.create({
    data: {
      name: "Dr. Priya Sharma",
      specialty: "Cardiology",
      email: "priya.sharma@hospital.io"
    }
  });

  const drVikram = await prisma.doctor.create({
    data: {
      name: "Dr. Vikram Rao",
      specialty: "Neurology",
      email: "vikram.rao@hospital.io"
    }
  });

  // Create Patients
  const aditi = await prisma.patient.create({
    data: {
      name: "Aditi Mehra",
      email: "aditi@example.com",
      phone: "9876543210",
      dateOfBirth: new Date("1990-04-12")
    }
  });

  const rahul = await prisma.patient.create({
    data: {
      name: "Rahul Singh",
      email: "rahul@example.com"
    }
  });

  // Create Appointments
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const followingWeek = new Date();
  followingWeek.setDate(followingWeek.getDate() + 8);

  await prisma.appointment.create({
    data: {
      appointmentDate: nextWeek,
      status: "scheduled",
      notes: "Annual cardiac checkup",
      patientId: aditi.id,
      doctorId: drPriya.id
    }
  });

  await prisma.appointment.create({
    data: {
      appointmentDate: followingWeek,
      status: "scheduled",
      patientId: rahul.id,
      doctorId: drVikram.id
    }
  });

  console.log("Seed complete:");
  console.log("Doctors:", 2);
  console.log("Patients:", 2);
  console.log("Appointments:", 2);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });