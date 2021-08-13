## Controller

<img width="732" alt="스크린샷 2021-08-13 오후 5 28 24" src="https://user-images.githubusercontent.com/28949213/129328181-b2f01e7f-43a6-46ca-82ca-fa809e38ee74.png">

> 컨트롤러는 요청을 클라이언트에게 응답하는 역할을 한다.

-   각 컨트롤러는 둘 이상의 라우트가 있으며 다른 라우트는 다른 작업을 수행할 수 있다.
-   기본 클래스를 만들기 위해 클래스와 데코레이터를 사용한다. 데코레이터는 클래스를 필수 메타데이터와 연결하고 Nest가 라우팅 맵을 만들 수 있도록 한다(요청을 해당 컨트롤러에게 연결)

### Routing

```tsx
import { Controller, Get } from "@nestjs/common";

@Controller("cats")
export class CatsController {
    @Get()
    findAll(): string {
        return "This action returns all cats";
    }
}
```

`@Controller()` → 기본 컨트롤러를 정의하는데 사용하는 데코레이터

`cats` → 라우트 경로path의 접두사.

`@Get()` → HTTP 요청에 대한 핸들러 생성 지시, 이 경우 get /cats 요청에 해당한다.

만약 `@Get("profile")` 이렇게 선언을 하면 GET /cats/profile과 매핑해주게 된다.

`findAll()` → 임의적으로 커스텀한 메소드로 라우팅해준다. 이 경우 문자열과 200상태코드를 주게 된다.

#### Nest가 응답(Response)을 조작하기위한 2가지 방법.

-   표준 방법  
    내장 메소드를 사용하면 요청 핸들러가 JavaScript 객체 혹은 배열을 반환시 자동으로 JSON으로 변경한다.  
    하지만 기본 타입(ex string, number, boolean) 을 반환하면 그냥 값만 보낸다.  
    또한 응답 상태 코드는 201을 사용하는 POST 요청을 제외하고는 항상 200이다. 핸들러 레벨에서 `@HttpCode()` 데코레이터를 추가해서 쉽게 변경 가능하다.
-   라이브러리별 방법  
    `@Res()` 같은 데코레이터를 삽입할 수 있는 라이브러리별 (ex→ express) 응답 객체를 사용 가능하다.

-   동시 사용  
    Nest는 핸들러가 `@Res()` 혹은 `@Next()` 를 사용할때 이를 감지해 라이브러리 별 옵션을 선택했음을 알게 된다. 이 경우 단일 라우트에 대한 표준 접근 방식이 자동으로 비활성화 되고, 작동하지 않는다. 두 접근 방식을 동시에 사용하려면 `@Res({ passthrough:true})` 이렇게 `passthrough` 옵션을 `true` 로 설정해야함.

### Request object

```tsx
import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("cats")
export class CatsController {
    @Get()
    findAll(@Req() request: Request): string {
        return "This action returns all cats";
    }
}
```

요청 객체에 접근하기 위해서는 `@Req()` 데코레이터를 추가해야한다.

> `express` 을 활용하려면 `@types/express` 패키지를 설치해야 한다.

-   데코레이터와 express 객체 매핑

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

`@Body()` 는 바로 사용이 가능하지만 그 외에는 전용 데코레이터를 사용해야 한다.  
Res 응답 같은 경우, Nest 에서 기본 `@Res()` 데코레이터를 지원하지만 express 라이브러리를 활용하는 경우  
라이브러리별 모드를 설정하고 응답을 관리해야 한다.

### Resources

```tsx
import { Controller, Get, Post } from "@nestjs/common";

@Controller("cats")
export class CatsController {
    @Post()
    create(): string {
        return "This action adds a new cat";
    }

    @Get()
    findAll(): string {
        return "This action returns all cats";
    }
}
```

위 코드 처럼 Post 방식을 사용하기 위해 `@Post()` 데코레이터를 사용하며 그 외에도 `put`, `delete`,`patch`, `options`, `Head` , `All` 을 제공한다.

### Route wildcards

패턴 기반 라우팅 시 사용,

```tsx
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

`ab*cd` 같은 경우, abcd, ab_cd 등등과 일치, `?` , `+` , `*` 및 `()` 문자는 라우트 경로에 사용될 수 있으며 해당 정규식 과 대응된다. 하이픈과 점은 문자 그대로 해석된다.

### Status code

201 인 POST 요청을 제외하고 응답 코드는 항상 200이다. 핸들러 레벨에서 `@HttpCode(..)` 데코레이터를 추가해서 변경 가능하다.

```tsx
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

다양한 요인에 의해서 변경될 경우 응답 객체를 사용하여 변경할 수 있다.

### Headers

`@Header` 혹은 라이브러리별 응답객체로 사용 가능.

```tsx
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

### Redirection

특정 URL로 리다이렉션하려면 `@Redirect()` 데코레이터 혹은 라이브러리별 응답객체 사용 가능.

`@Redirect()` 는 기본적으로 2개의 인자를 받는데 첫 인자는 URL, 두번째는 상태 코드이다. 상태코드가 생략되면 기본값은 302이다.

```tsx
@Get()
@Redirect('https://nestjs.com', 301)
```

```tsx
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

이렇게 특정 조건에 따라 리턴값으로 url, statusCode가 있는 객체를 전달하면 리다이렉션을 조건에 따라 변경할 수 있다.

### Route parameters

라우트 매개변수 token을 추가하여 동적으로 값을 가져올 수 있음.

```tsx
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

위 코드 처럼 params로 값을 받아와서 사용할 수 있다.

```tsx
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

이렇게 직접 `params.id` 의 값을 id로 참조해서 사용할 수 있다.

### Sub-Domain Routing

`@Controller` 데코레이터는 들어오는 요청의 HTTP 호스트가 특정 값과 일치하도록 `host` 옵션을 사용할 수 있다.

```tsx
@Controller({ host: "admin.example.com" })
export class AdminController {
    @Get()
    index(): string {
        return "Admin page";
    }
}
```

```tsx
@Controller({ host: ":account.example.com" })
export class AccountController {
    @Get()
    getInfo(@HostParam("account") account: string) {
        return account;
    }
}
```

이렇게 컨트롤러 데코레이터에 정의된 params를 가져올 수 있음.

### Asynchronicity

Nest 에서 비동기 기능을 지원한다? Nest 자체적으로 지연된 값을 반환할 수 있다.

```tsx
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

또한 Nest는 RxJS Observable 스트림을 반환할 수 있다

```tsx
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

### Request payloads

위에서 POST 방식에 클라이언트에게 매개변수를 허용하지 않았음. 여기에 `@Body()` 데코레이터를 추가해서 해결 가능.

그러기 전에 DTO(데이터 전송 객체)스키마를 생성해야한다. 이 DTO는 클래스를 사용하는 것이 좋다. 클래스는 ES6 표준이기때문에 컴파일된 JS에서 실제 엔티티가 유지되나 인터페이스는 트랜스파일 도중 제거 되기 때문에 런타임시 참조가 불가능하다. **파이프**와 같은 기능은 런타임에 변수의 메타타입에 access 할 수 있기 때문에 중요하다.

`CreateCatDto` 생성.

```tsx
export class CreateCatDto {
    name: string;
    age: number;
    breed: string;
}
```

이후 컨트롤러에서 사용 가능하다.

```tsx
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

### Getting up and running

위에서 작성한 컨트롤러는 아직 Nest가 알지 못한다. 그렇기에 결과적으로 클래스의 인스턴스를 만들지 않음.

컨트롤러는 항상 모듈에 속함으로 `@Module()` 데코레이터 내에 `controllers` 배열을 포함시킨다.

```tsx
import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";

@Module({
    controllers: [CatsController],
})
export class AppModule {}
```

<br />

### Library-specific approach

라이브러리를 사용해서 응답을 조지는 방법,

```tsx
import { Controller, Get, Post, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Controller("cats")
export class CatsController {
    @Post()
    create(@Res() res: Response) {
        res.status(HttpStatus.CREATED).send();
    }

    @Get()
    findAll(@Res() res: Response) {
        res.status(HttpStatus.OK).json([]);
    }
}
```

하지만 이 접근 방식은 코드가 플랫폼에 종속되고(사용하는 라이브러리가 응답객체에 다른 API를 가질 수 있다 -> ), 테스트하기가 어렵다.

또한 인터셉터 및 `@HttpCode()` / `@Header()` 데코레이터나 Nest의 표준 응답처리에 의존하는 Nest 기능과 호환성이 손실된다. 이문제를 해결하려면 다음처럼 `passthrough` 옵션을 `true` 로 주어야 한다.

```ts
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.status(HttpStatus.OK);
  return [];
}
```

-   개인적인 생각인데 Nest로 넘어와서 굳이 express의 응답 객체를 사용하는것 보다 응답 자체를 인터셉터와 HttpCode를 통해 처리하는것이 좋아보임.
