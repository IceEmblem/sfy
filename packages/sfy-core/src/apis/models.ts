export interface Entity {
    "@id"?: string,
    id?: string,
}

export interface HasCreateTime {
    readonly createTime?: Date
}

export interface User extends Entity, HasCreateTime {
    name?: string,
    age?: number
}

export interface Blog extends Entity, HasCreateTime {
    title?: string,
    content?: string
}