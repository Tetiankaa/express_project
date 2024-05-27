import {IPagination} from "./pagination.interface";

export interface IListResponse<T> extends IPagination {
    data: T[]
}
