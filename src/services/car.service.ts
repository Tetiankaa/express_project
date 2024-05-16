import { errorMessages } from "../constants/error-messages.constant";
import { statusCode } from "../constants/status-codes.constant";
import { EAccountType } from "../enums/account-type.enum";
import { EPostStatus } from "../enums/post-status.enum";
import { ApiError } from "../errors/api-error";
import { ICar, ICarResponse } from "../interfaces/car.interface";
import { IJwtPayload } from "../interfaces/jwt-payload.interface";
import { carRepository } from "../repositories/car.repository";
import { postRepository } from "../repositories/post.repository";

class CarService {
  public async saveCar(
    car: Partial<ICar>,
    jwtPayload: IJwtPayload,
  ): Promise<ICarResponse> {
    const postsCount = await postRepository.countDocumentsByParams({_id: jwtPayload._userId});
    if (
      jwtPayload.accountType === EAccountType.BASIC &&
      postsCount >= 1
    ) {
      throw new ApiError(
        statusCode.FORBIDDEN,
        errorMessages.ONE_POST_FOR_BASIC_ACCOUNT,
      );
    }
    // TODO check profanity
    const savedCar = await carRepository.create(car);
    const post = await postRepository.create({
      user_id: jwtPayload._userId,
      car_id: savedCar._id,
      profanityEdits: 0,
      status: EPostStatus.ACTIVE,
    });

    return {
      car: savedCar,
      profanityEdits: post.profanityEdits,
      status: post.status,
    };
  }
}
export const carService = new CarService();
