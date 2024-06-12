import { ICar, ICarDto } from "../interfaces/car.interface";

export class CarMapper {
  public static toDto(car: ICar): ICarDto {
    return {
      _id: car._id,
      brand: car.brand,
      city: car.city,
      color: car.color,
      enteredCurrency: car.enteredCurrency,
      mileage: car.mileage,
      model: car.model,
      photo: car.photo,
      description: car.description,
      enteredPrice: car.enteredPrice,
      region: car.region,
      year: car.year,
      prices: car.prices,
    };
  }
}
