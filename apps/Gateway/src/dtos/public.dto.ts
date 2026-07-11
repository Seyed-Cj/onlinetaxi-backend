import { AdminModel, AdminSessionModel } from "./admin.dto";
import { DriverModel, DriverSessionModel } from "./driver.dto";


export class AuthorizeOutputDto {
  isAuthorized!: boolean;
  profile?: DriverModel | AdminModel;
  session?: DriverSessionModel | AdminSessionModel;
  tokenData?: {
    token: string;
    ttl: number;
  };
  clearCookie?;
  isActive?

}

export interface RequestWithUserData extends Request {
    cookies: Record<string, string>;
    acc_profile?: DriverModel | AdminModel;
    acc_session?: DriverSessionModel | AdminSessionModel;
    acc_isActive?: boolean;
    acc_type?: "ADMIN" | "DRIVER";
}
export enum ActionStatusEnum {
    DELETED = "DELETED",
    UPDATED = "UPDATED",
    CREATED = "CREATED"
}
export class StatusResponseDto {

    status?: ActionStatusEnum;
    then?: any;
    clearCookie?: string;
}