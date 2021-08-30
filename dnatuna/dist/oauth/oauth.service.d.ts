import { HttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
export declare class OauthService {
    private usersService;
    private axios;
    constructor(usersService: UsersService, axios: HttpService);
    kakaoGetUser(accessToken: any): Promise<any>;
}
