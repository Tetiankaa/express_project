import { ICar, ICarDto, ICarResponse } from "../interfaces/car.interface";
import { ITokenResponse } from "../interfaces/token.interface";

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
  public static toListDto(cars: ICar[]): ICarDto[] {
    return cars.map(CarMapper.toDto);
  }
  public static toResponseDto(
    data: ICarResponse,
    tokens?: ITokenResponse,
  ): { data: ICarResponse; tokens: ITokenResponse } {
    return {
      data: {
        car: CarMapper.toDto(data.car),
        profanityEdits: data.profanityEdits,
        status: data.status,
      },
      tokens,
    };
  }
}
