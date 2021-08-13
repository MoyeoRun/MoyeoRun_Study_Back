## Middleware

미들웨어는 라우터 핸들러 이전에 호출되는 함수이다.

<img width="812" alt="스크린샷 2021-08-13 오후 6 54 24" src="https://user-images.githubusercontent.com/28949213/129339717-39111ef8-e96b-4357-9bc4-e5e865868dcc.png">

`next` 미들웨어 함수는 일반적으로 `next` 라는 변수로 표시된다.

이 미들웨어는 기본적으로 `express` 의 미들웨어와 동일하다.

함수 또는 `@Injectable()` 데코레이터가 있는 클래스에서 커스텀 Nest 미들웨어를 구현한다. 클래스는 `NestMiddleware` 인터페이스를 구현해야지만 함수에는 특별한 요구사항이 없다.

```tsx
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("Request...");
        next();
    }
}
```

### Applying middleware

모듈 클래스의 `configure()` 메소드를 사용하여 설정한다. 미들웨어를 포함하는 모듈은 `NestModule` 인터페이스를 구현해야한다. 아래 코드는 `AppModule` 레벨에서 `LoggerMiddleware` 를 설정한다.

```tsx
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";

@Module({
    imports: [CatsModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("cats");
    }
}
```

`/cats` 에 대해 `LoggerMiddleware` 를 설정함. `forRoutes` 에 대해 path와 method 를 포함시킨 객체를 적용시켜서 특정 요청과 메소드를 제한할 수 있다.

```tsx
import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer,
} from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";

@Module({
    imports: [CatsModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: "cats", method: RequestMethod.GET });
    }
}
```

위의 예시에서 원하는 요청 메서드 타입을 참조하기 위해 `RequestMethod` 열거 형을 가져온다.

> `configure()` 메소드는 `async/await` 을 사용해서 비동기식으로 만들 수 있다.
> `configure()` 메소드 본문 내에서 비동기 작업의 완료를 `await` 할 수 있다.

### Route wildcards

패턴 기반 라우팅도 지원함.

```tsx
forRoutes({ path: "ab*cd", method: RequestMethod.ALL });
```

### Middleware consumer

`Middleware consumer` 은 헬퍼 클래스이다. 미들웨어를 관리하기 위한 몇가지 방법이 있다.

`forRoutes()` 는 단일 문자열, 여러 문자열, `RouteInfo` 객체, 컨트롤러 클래스 및 여러 컨트롤러 클래스를 사용할 수 있다. 쉼표로 구분된 컨트롤러 목록을 전달한다.

```tsx
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";
import { CatsController } from "./cats/cats.controller.ts";

@Module({
    imports: [CatsModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(CatsController);
    }
}
```

apply() 메소드는 단일 미들웨어를 사용하거나 여러 미들웨어를 지정하기 위해 여러 인자를 가질 수 있다.

### Excluding routes

특정 라우트를 제외할때, `exclude()` 메소드로 특정 라우트를 제외할 수 있음.

```tsx
consumer
    .apply(LoggerMiddleware)
    .exclude(
        { path: "cats", method: RequestMethod.GET },
        { path: "cats", method: RequestMethod.POST },
        "cats/(.*)"
    )
    .forRoutes(CatsController);
```

### 함수형 미들웨어 Functional middleware

```tsx
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("Request...");
        next();
    }
}
```

이 미들웨어 클래스는 멤버, 추가 메서드 및 종속성이 없다. 그래서 클래스 대신 간단한 함수로 정의할 수 있으며 이것을 함수형 미들웨어라고도 한다.

```tsx
import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`Request...`);
    next();
}
```

> 미들웨어에서 종속성이 필요하지 않을 때마다 더 간단한 함수형 미들웨어를 사용하는 것이 좋다.

### Multiple middleware

여러 미들웨어 바인딩.

```tsx
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

### Global middleware

미들웨어를 등록된 모든 경로에 한번에 바인딩하려면 `INestApplication` 인스턴스에서 제공하는 `use()` 메서드를 사용할 수 있다.

```tsx
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

> Global middleware 방식에서는 DI 컨테이너에 접근할 수 없다. `app.use()` 를 사용할때는 대신 함수형 미들웨어를 사용할 수 있다.
