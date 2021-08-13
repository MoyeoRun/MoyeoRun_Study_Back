## Custom decorators

### Custom route decorators

Nest에서는 `데코레이터` 라는 언어기능을 중심으로 구축됨. 다음은 간단한 정의이다.

> ES2016 데코레이터는 함수를 반환하고 대상, 이름 및 속성 설명자를 인수로 사용할 수 있는 표현식입니다. 데코레이터 앞에 `@` 문자를 붙이고 이를 데코하려는 항목의 맨 위에 배치하여 적용합니다. 데코레이터는 클래스, 메서드 또는 속성에 대해 정의할 수 있습니다.

### Param decorators

Nest는 HTTP 라우트 핸들러와 함께 사용할 수 있는 `Param decorators` 를 제공한다. 아래는 제공된 데코레이터와 매핑되는 일반 Express(또는 Fastify) 객체 목록이다.

| 데코레이터               | express                           |
| ------------------------ | --------------------------------- |
| `@Request(), @Req()`     | `req`                             |
| `@Response(), @Res()`    | `res`                             |
| `@Nest()`                | `next`                            |
| `@Session()`             | `req.session`                     |
| `@Param(key?:string)`    | `req.params`/`req.params[key]`    |
| `@Body(key?:string)`     | `req.body`/`req.body[key]`        |
| `@Query(key?:string)`    | `req.query`/`req.query[key]`      |
| `@Headers(name?:string)` | `req.headers`/`req.headers[name]` |
| `@Ip()`                  | `req.ip`                          |
| `@HostParam()`           | `req.hosts`                       |

또한 커스텀 데코레이터를 만들 수 있다.

예를들어 nodejs에서는 요청 객체에 속성을 연결하는 것이 일반적인데 대부분 아래와 같이 수동으로 추출한다.

```tsx
const user = req.user;
```

코드를 좀더 클린하게 만들기 위해 `@User()` 데코레이터를 만들어 모든 컨트롤러에서 재사용할 수 있다.

-   user.decorator.ts

```tsx
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);
```

이후 원하는곳에서 재사용이 가능하다.

```tsx
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

### Passing data

데코레이터의 동작이 일부 조건에 따라 달라지는 경우 `data` 매개변수를 사용하여 인자를 전달할 수 있다.

아래는 키별로 요청 객체에서 속성을 추출하는 커스텀 데코레이터이다.

예를들어 인증 레이어가 유효성을 검사하고 사용자 엔티티를 요청 객체에 연결한다고 가정했을때,

인증된 요청에 대한 사용자 엔티티가 아래와 같다면

```tsx
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

```tsx
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    }
);
```

속성 이름을 key로 받아 있는 경우(또는 존재하지 않는 경우 정의되지 않거나 `user` 객체가 생성되지 않은 경우) 반환하는 데코레이터.

컨트롤러의 `@User()` 데코레이터를 통해 특정 속성에 엑세스 하는 방법.

```tsx
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

### Working with pipes

```tsx
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity,
) {
  console.log(user);
}
```

위처럼 데코레이터와 파이프를 같이 사용할 수 있다.

> `validateCustomDecorators` 옵션을 `true` 로 설정해줘야 한다. `ValidationPipe` 는 기본적으로 커스텀 데코레이터의 인자의 유효성을 검사하지 않는다.

### Decorator composition

Nest는 여러 데코레이터를 적용하는 메서드를 제공한다. 예를들어 인증과 관련한 모든 데코레이터를 단일 데코레이터로 결합한다고 가정하면.

```tsx
import { applyDecorators } from "@nestjs/common";

export function Auth(...roles: Role[]) {
    return applyDecorators(
        SetMetadata("roles", roles),
        UseGuards(AuthGuard, RolesGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: "Unauthorized" })
    );
}
```

이후

```tsx
@Get('users')
@Auth('admin')
findAllUsers() {}
```

이렇게 하나의 데코레이터로 여러 데코레이터를 모두 적용시킬 수 있음.

> `@nestjs/swagger` 패키지의 `@ApiHideProperty()` 데코레이터는 구성할 수 없으며 `applyDecorators` 함수와 함께 제대로 작동하지 않습니다.
