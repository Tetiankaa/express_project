import { EPostStatus } from "../enums/post-status.enum";
import { ICar, ICarDto } from "../interfaces/car.interface";

export class CarMapper {
  public static toDto(car: ICar): ICarDto {
    return {
      _id: car._id,
      brand: car.brand,
      city: car.city,
      color: car.color,
      currency: car.currency,
      mileage: car.mileage,
      model: car.model,
      photo: car.photo,
      description: car.description,
      price: car.price,
      region: car.region,
      year: car.year,
    };
  }
  public static toCar(dto: ICarDto): ICar {
    return {
      _id: dto._id,
      brand: dto.brand,
      city: dto.city,
      color: dto.color,
      currency: dto.currency,
      mileage: dto.mileage,
      model: dto.model,
      photo: dto.photo,
      description: dto.description,
      price: dto.price,
      region: dto.region,
      year: dto.year,
    };
  }
  public static toListDto(cars: ICar[]): ICarDto[] {
    return cars.map(CarMapper.toDto);
  }
  public static toResponseDto(data: {
    car: ICar;
    profanityEdits: number;
    status: EPostStatus;
  }): { car: ICarDto; profanityEdits: number; status: EPostStatus } {
    return {
      car: CarMapper.toDto(data.car),
      profanityEdits: data.profanityEdits,
      status: data.status,
    };
  }
}
