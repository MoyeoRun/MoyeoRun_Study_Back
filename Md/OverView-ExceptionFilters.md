## Exception filters

Nest 에는 앱 전체에서 처리되지 않은 모든 예외를 처리하는 Exception layer 가 존재한다. 애플리케이션 코드에서 예외를 처리하지 않으면 이 레이어에서 예외를 잡아서 사용자에게 적절한 응답을 자동으로 보낸다.

<img width="804" alt="스크린샷 2021-08-13 오후 7 02 08" src="https://user-images.githubusercontent.com/28949213/129340696-ec9c08d7-eee2-4604-b44d-d9f6f6cf00b4.png">

기본적으로 이 작업은 `HttpException` 유형의 예외를 처리하는 내장 전역 예외필터에 의해 수행된다. 이 예외로도 인식되지 않는 경우는 다음과 같은 응답을 준다.

```tsx
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### 표준 에러 발생Throwing standard exceptions

Nest는 `@nestjs/common` 패키지에서 내장 `HttpException` 클래스를 제공한다. 일반적인 HTTP REST/GraphQL API 기반 애플리케이션의 경우 특정 오류 조건이 발생할 때 HTTP 응답 객체를 보내는 것이 좋다.

```tsx
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

이 요청의 응답은 다음과 같다.

```tsx
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

`HttpException` 생성자는 응답을 결정하는 2개의 필수 인자를 사용한다.

-   `response` : JSON 응답 본문을 정의한다, `string` or `object` 이다.
-   `status` : HTTP 상태코드를 정의한다.

JSON 응답본문에는 2가지 속성이 포함된다.

-   `statusCode` : `status` 인자에 제공된 HTTP 상태코드가 기본값.
-   `message` : `status` 에 따른 HTTP 오류에 대한 간단 설명.

JSON 응답의 본문 메시지만 정의하려면 `response` 에 문자열만 제공하고, 전체 JSON 응답을 재정의하려면 `response` 인자에 객체를 전달한다.

```tsx
@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, HttpStatus.FORBIDDEN);
}
----------------------------------
{
  "status": 403,
  "error": "This is a custom message"
}
```

### Custom exceptions

대부분의 경우 커스텀 예외를 만들 필요는 없으며 기본제공 NestHTTP 예외를 사용할 수 있다. 커스텀 예외를 만들어야 하는 경우 커스텀 예외가 기본 `HttpException` 클래스에서 상속되는 고유한 예외 계층을 만드는 것이 좋다. → Nest 가 오류를 인식하고 오류 응답을 자동으로 처리함.

```tsx
//forbidden.exception.ts
export class ForbiddenException extends HttpException {
    constructor() {
        super("Forbidden", HttpStatus.FORBIDDEN);
    }
}
```

위는 기본 HttpException을 확장하므로 내장된 예외 핸들러와 호환됨.

```tsx
@Get()
async findAll() {
  throw new ForbiddenException();
}
```

이렇게 사용.

### Exception filters

예외 레이어에 대한 완전한 제어를 원하는 경우 사용한다. 예를들어 로깅을 추가하거나 일부 동적 요인을 기반으로 다른 JSON 스키마를 사용할 수 있다. 이를 통해 정확한 제어 흐름과 클라이언트로 다시 전송되는 응답 내용을 제어할 수 있다.

커스텀 응답 로직을 구현하려면 `Request` 와 `Response` 에 접근해야 한다. 요청 객체에서 `url` 을 출력하여 로깅 하거나 응답 객체를 사용해 `Response.json()` 메서드를 사용해서 전송되는 응답을 직접 제어한다.

```tsx
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
```

> 모든 예외 필터는 `ExceptionFilter<T>` 인터페이스를 구현해야 한다. 이를 위해서는 `catch(exception: HttpException, host: ArgumentsHost)` 메서드를 제공해야 한다. `T` 는 예외 타입을 나타낸다.

`@Catch(HttpException)` 데코레이터는 필요한 메타데이터를 예외필터에 바인딩하여 이 특정 필터가 `HttpException` 타입의 예외만 찾고 있다는 것을 Nest에 알린다. 이 데코레이터 안에는 단일 매개변수 혹은 쉼표로 구분된 목록을 사용할 수 있다.

### Arguments host

`catch()` 의 매개변수를 살펴보면 `exception` 은 현재 처리중인 예외 객체이고, `host` 은 `ArgumentsHost` 객체이다. 이 객체는 나중에 자세히 다룬다, 위 코드에서 이 객체가 제공하는 몇가지 헬퍼 메소드를 사용했다.

### Binding filters

이 새로운 filter 를 컨트롤러의 메소드에 연결해보자.

```tsx
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

`@UseFilters()` 데코레이터를 사용한다. 여기서 `HttpExceptionFilter` 의 인스턴스를 생성한다.

대신 클래스를 넘길 수 있으며 프레임워크에 인스턴스화 책임을 남겨 DI을 활성화할 수 있다.

> 가능한 경우 인스턴스 대신 클래스를 사용하여 필터를 적용하는것이 좋다. Nest는 전체 모듈에서 동일한 클래스의 인스턴스를 쉽게 재사용할 수 있으므로 메모리 사용량을 줄인다.

위 방식은 create 의 라우터 핸들러에만 적용되어 메소드 범위가 되는데 컨트롤러 범위로 넘기고 싶으면

```tsx
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

이렇게,

전역범위로 넘기고 싶다면

```tsx
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}
bootstrap();
```

이렇게 사용한다.

하지만 위처럼 모듈 외부에서 등록된 전역 필터는 모듈의 컨텍스트 외부에서 수행되므로 종속성을 주입할 수 없다.

이 문제를 해결하기 위해 모든 모듈에서 직접 전역범위 필터를 등록할 수 있다.

```tsx
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
```

> 이 방법을 사용하면 이 방법에 사용되는 모듈에 상관없이 필터는 실제로 전역으로 구성된다.

### Catch everything

처리되지 않은 모든 예외를 잡으려면 `@Catch()` 데코레이터의 매개변수 목록을 비운다.

```tsx
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
```

### Inheritance

처음 사용한 filter 처럼 완전히 커스텀 한 예외필터 대신 기본 제공되는 디폴트 전역 예외필터를 확장하고 특정 요인에 따라 동작을 재정의 하려는 경우

예외필터를 기본필터에 위임 하려면 `BaseExceptionFilter` 를 확장하고 상속된 `catch()` 메서드를 호출해야 한다.

```tsx
import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        super.catch(exception, host);
    }
}
```
