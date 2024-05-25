import {removeUnactivePosts} from "./remove-unactive-posts.cron";

export const runCronJobs = () =>{
    removeUnactivePosts.start();
}
