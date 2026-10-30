import prisma from "./lib/prisma.js";

// Create Doctor
export async function createDoctor(data: {
  name: string;
  specialty: string;
  email: string;
}) {
  return prisma.doctor.create({
    data
  });
}

// Get Doctor
export async function getDoctor(id: number) {
  const doctor = await prisma.doctor.findUnique({
    where: { id }
  });

  if (doctor === null) {
    throw new Error("Doctor not found");
  }

  return doctor;
}

// List Doctors By Specialty
export async function listDoctorsBySpecialty(
  specialty: string
) {
  return prisma.doctor.findMany({
    where: {
      specialty: {
        contains: specialty
      }
    },
    orderBy: {
      name: "asc"
    },
    select: {
      id: true,
      name: true,
      specialty: true,
      email: true
    }
  });
}

// Delete Doctor
export async function deleteDoctor(id: number) {
  // Doctor cannot be deleted if appointments exist.
  return prisma.doctor.delete({
    where: { id }
  });
}