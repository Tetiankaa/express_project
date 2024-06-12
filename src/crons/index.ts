import { fetchExchangeRate } from "./fetch-exchange-rate.cron";
import { removeResolvedCarSuggestions } from "./remove-resolved-car-suggestions.cron";
import { removeUnactivePosts } from "./remove-unactive-posts.cron";

export const runCronJobs = () => {
  removeUnactivePosts.start();
  removeResolvedCarSuggestions.start();
  fetchExchangeRate.start();
};
