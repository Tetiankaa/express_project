import {CronJob} from "cron";
import {postRepository} from "../repositories/post.repository";
import {TimeHelper} from "../helpers/time.helper";

const handler = async () => {
    try {
        await postRepository.deleteManyByParams({
            createdAt: {$lte: TimeHelper.subtractByParams(30,'days')}
        })
    }catch (error) {
        console.error("Error remove unactive posts: ", error);
    }
}

export const removeUnactivePosts = new CronJob("0 0 3 * * *", handler)
