import Doctor from "./Doctor";

export default interface DoctorSchedule {
    id: number;
    doctor: Doctor;
    weekday: string;
    startTime: string;
    endTime: string;
    dateJoined: any;
}
