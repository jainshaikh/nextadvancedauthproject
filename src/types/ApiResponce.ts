import { Message } from "@/model/user";

export interface ApiResponce{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
}
