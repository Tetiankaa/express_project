import { CronJob } from "cron";

import { TimeHelper } from "../helpers/time.helper";
import { carSuggestionsRepository } from "../repositories/car-suggestions.repository";

const handler = async () => {
  try {
    await carSuggestionsRepository.deleteByParams({
      updatedAt: { $lte: TimeHelper.subtractByParams(90, "days") },
      isResolved: true,
    });
  } catch (e) {
    console.error("Error removing car suggestions: " + e);
  }
};

export const removeResolvedCarSuggestions = new CronJob("* * 4 * * *", handler);
