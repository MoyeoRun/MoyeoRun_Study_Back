import { Strategy } from 'passport-jwt';
import { UserResponse } from 'src/dto/user.dto';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<UserResponse>;
}
export {};
