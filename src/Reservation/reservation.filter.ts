export interface ReservationFilter {
    user?: string;
    state?: "Completed" | "Pending" | "Canceled";
  }