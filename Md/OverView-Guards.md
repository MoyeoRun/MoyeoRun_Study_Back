## Guards

가드는 `@Injectable()` 데코레이터를 사용하며 `CanActivate` 인터페이스를 구현해야 한다.

<img width="799" alt="스크린샷 2021-08-13 오후 7 20 28" src="https://user-images.githubusercontent.com/28949213/129343042-25f8de3d-119f-4e1c-8aeb-fbfa42e94985.png">

가드는 단일책임이 있다. 런타임에 존재하는 특정 조건(ex 권한, 역할 등)에 따라 지정된 요청을 라우터 핸들러에 의해 처리할지 여부를 결정한다. 이를 종종 승인(authorization) 이라고 한다.

기존 Express에서는 미들웨어에 의해 처리가되었으나 미들웨어는 `next()` 함수를 호출한 후 어떤 핸들러가 실행될지 알 수 없다. 반면 **가드** 는 `ExecutionContext` 인스턴스에 엑세스 할 수 있으므로 다음에 실행될 작업을 정확히 알고 있다. 요청, 응답 주기의 정확한 지점에서 처리 로직을 삽입하고 선언적으로 수행할 수 있도록 설계되었다.

### Authorization guard

-   auth.guard.ts

```tsx
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return validateRequest(request);
    }
}
```

`AuthGuard` 는 인증된 사용자라고 가정하며 그 사용자의 토큰을 추출하고 유효성을 검사하여 요청을 진행할지 여부를 결정한다.

`validateRequest()` 함수 내부 로직은 가드가 요청 응답주기에 어떻게 부합하지는 보여준다?(판단한다?)

모든 가드는 `CanActivate` 를 구현해야 한다.이 함수는 요청이 허용되는지 판단하는 `true` `false` 를 반환한다. 응답을 동기식 혹은 비동기식으로 반환할 수 있다.

당연하지만 true면 요청이 처리되고 false 면 Nest는 요청을 거부한다.

### Execution context

`canActivate()` 함수는 `ExecutionContext` 인스턴스라는 단일인수를 받는다. 이 인스턴스는 `ArgumentHost` 에서 상속된다. `ArgumentHost` 에서 정의된 헬퍼 메서드를 사용해서 Request 객체에 대한 참조를 얻는다.

> argumenthost의 인스턴스는 host 객체인데 이 객체는 express의 [request, response, next] 의 배열을 캡슐화한 것.

즉 요청 객체의 접근을 할 수 있음.

### Role-based authentication

특정 역할을 가진 사용자에게만 엑세스를 허용하는 가드 구축을 해보자. 아래는 기본 가드 템플릿이다.

```tsx
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        return true;
    }
}
```

### Binding guards

파이프 및 예외필터와 마찬가지로 가드는 컨트롤러 범위, 메서드 범위, 또는 전역 범위일 수 있다.

-   컨트롤러 범위 바인딩

    ```tsx
    @Controller("cats")
    @UseGuards(RolesGuard)
    export class CatsController {}
    혹은;
    @Controller("cats")
    @UseGuards(new RolesGuard())
    export class CatsController {}
    ```

    인스턴스를 바로 넣을 수 있고, 종속성 주입을 위해 class를 넣을 수 있음.

-   메소드 범위 바인딩

    ```tsx
    @Get()
    @UseGuards(new RolesGuard())
      async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
      }
    ```

-   전역 범위 바인딩

    ```tsx
    const app = await NestFactory.create(AppModule);
    app.useGlobalGuards(new RolesGuard());
    ```

    모든 모듈에서 직접 가드를 설정할 수 있음.

    ```tsx
    import { Module } from "@nestjs/common";
    import { APP_GUARD } from "@nestjs/core";

    @Module({
        providers: [
            {
                provide: APP_GUARD,
                useClass: RolesGuard,
            },
        ],
    })
    export class AppModule {}
    ```

### Setting roles per handler

아직 가장 중요한 가드 기능인 `execution context` 를 활용하지 않음.

각 핸들러에 대해 허용되는 role 에 대해서 아직 알지 못함. 예를들어 `CatsController` 는 라우트마다 다른 권한 체계를 가질 수 있다. 일부는 관리자만 사용할 수 있고, 다른 일부는 모든 사용자가 사용 할 수 있다. 어떻게 라우트에 일치시키나 ?

→ 맞춤 메타데이터를 작성한다.

Nest는 `@SetMetaData()` 데코레이터를 통해 라우트 핸들러에 커스텀 메타데이터를 첨부하는 기능을 제공한다. 가드는이 메타데이터를 통해 결정을 내리는데 필요한 `role` 데이터를 받는다.

```tsx
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

위 코드를 통해 `create()` 메소드에 `roles` 메타데이터에 를 첨부함 . `roles` 는 키이고 `admin` 은 특정 값이다.

하지만 라우트에 직접 `@SetMetaData()` 를 사용하는 것은 좋지 않다. 대신 자신만의 데코레이터를 만드는것이 좋다.

-   roles.decorator.ts

```tsx
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

이렇게 정의를 해서 `@Roles()` 라는 커스텀 데코레이터를 적용 시키면

```tsx
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

### Putting it all together

현재는 모든 경우에 `true` 를 반환한다. 이제 현재 사용자에 할당된 역할을 처리중인 현재 라우트에 필요한 실제 역할과 비교해서 반환값을 조건부로 만든다.

라우트의 역할(커스텀 메타데이터)에 엑세스 하기 위해 프레임워크에서 제공하는 `Reflector` 헬퍼 클래스를 사용한다.

```tsx
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler()
        );
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return matchRoles(roles, user.roles);
    }
}
```

> node js 에서 승인된 사용자를 `request` 객체에 연결하는 것이 일반적이다. 위의 코드는 `request.user` 에 사용자 인스턴스와 허용된 역할이 포함되어 있다고 가정한다.

권한이 없으면 Nest는 다음의 응답을 반환한다.

```tsx
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

가드가 `false` 를 반환하면 Nest에서 `ForbiddenException` 를 발생시킨다.
만약 다른 오류 응답을 반환하려면 고유한 예외를 발생시켜야 한다. 예를들면

```tsx
throw new UnauthorizedException();
```

가드가 던진 예외는 예외계층(전역 예외필터 및 현재 컨텍스트에 적용되는 모든 예외필터)에 의해 처리된다.
