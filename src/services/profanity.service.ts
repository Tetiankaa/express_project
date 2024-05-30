import Filter from "bad-words";

import { ICar } from "../interfaces/car.interface";

class ProfanityService {
  private readonly filter: Filter;
  constructor() {
    this.filter = new Filter();
  }

  public checkForProfanity(car: Partial<ICar>): boolean {
    const fieldsToCheck = [
      car.description,
      car.model,
      car.brand,
      car.city,
      car.region,
      car.color,
    ];
    return fieldsToCheck.some((field) => field && this.filter.isProfane(field));
  }
}

export const profanityService = new ProfanityService();
