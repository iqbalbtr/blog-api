export class APIResponse<T> {
    data: T;
}

export class PaggingResponse<T> {
    pagging: {
        page: number,
        size: number,
        total_page: number,
        count: number
    };
    data: T[];
}

export class ListQuery {
    size: number;
    page: number;
}

export class BasicResponse {
    id: number
}