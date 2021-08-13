## Modules

모듈은 `@Module()` 데코레이터를 사용하는 클래스이다. 이 데코레이터는 Nest가 애플리케이션 구조를 구성하는데 사용하는 메타데이터를 제공한다.

<img width="796" alt="스크린샷 2021-08-13 오후 5 58 44" src="https://user-images.githubusercontent.com/28949213/129332522-42ad5196-d85d-4154-8610-344b56103a60.png">

각 애플리케이션에는 **루트모듈** 이라는 하나 이상의 모듈이 있고 이 루트모듈은 Nest가 애플리케이션 그래프를 빌드하는데 사용하는 시작점이다. Nest가 모듈과 공급자 관계 및 종속성을 해결하는데 사용하는 내부 데이터 구조이다.

간단한 앱이라면 루트 모듈만 있으면 되지만, 일반적인 경우는 아니며 이 모듈은 앱의 구성요소를 구성하는데 적극 권장된다.

`@Module()` 의 속성들

-   `providers` : Nest 인젝터에 의해 인스턴스화 되고 적어도 이 모듈에서 공유될 수 있는 프로바이더
-   `controllers` : 인스턴스화 되어야 하는 이 모듈에 정의된 컨트롤러 셋
-   `imports` : 이 모듈에 필요한 프로바이더를 내보내는 가져온 모듈 목록
-   `exports` : 이 모듈에서 제공하고 이 모듈을 임포트하는 다른 모듈에서 사용할 수 있어야 하는 프로바이더의 하위 집합.

### Feature modules

`CatsController` 와 `CatsService` 는 동일한 애플리케이션 도메인에 속한다. 둘이 밀접하게 관련이 있으므로 기능 모듈로 만드는것이 좋다. 이런 `Feature modules` 은 단순 특정 기능과 관련된 코드를 구성하여 코드를 체계적으로 유지하고 명확한 경계를 설정하며 이는 `SOLID` 원칙에 따라 개발하는데 도움이 된다.

`CatsModule`

```tsx
import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService],
})
export class CatsModule {}
```

app.module.ts

```tsx
import { Module } from "@nestjs/common";
import { CatsModule } from "./cats/cats.module";

@Module({
    imports: [CatsModule],
})
export class AppModule {}
```

### Shared modules

Nest에서 모듈은 기본적으로 `싱글톤` 이므로 여러 모듈간에 쉽게 프로바이더의 동일한 인스턴스를 공유할 수 있다.  
모든 모듈은 자동으로 **공유 모듈**이다. 일단 생성되면 모든 모듈에서 재사용할 수 있다. 여러 모듈간에 `CatsService` 의 인스턴스를 공유하고 싶다면 `exports` 배열에 `CatsService` 프로바이더를 추가해서 내보내야 한다.

```tsx
import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService],
})
export class CatsModule {}
```

이러면 `CatsModule` 을 가져오는 모든 모듈은 `CatsService` 에 접근할 수 있으며 다른 모듈과 동**일한 인스턴스를** 공유한다.

### Module re-exporting

가져온 모듈을 다시 내보낼 수도 있다.

```tsx
@Module({
    imports: [CommonModule],
    exports: [CommonModule],
})
export class CoreModule {}
```

`CommonModule` 은 `CoreModule` 에서 가져오고 내보내므로 이 CoreModule을 가져오는 다른 모듈에서도 사용할 수 있다.

### Dependency injection

모듈 클래스는 프로바이더도 주입할 수 있다.

```tsx
import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService],
})
export class CatsModule {
    constructor(private catsService: CatsService) {}
}
```

그러나 모듈 클래스 자체는 순환종속성으로 인해 프로바이더로 삽입될 수 없다.

### Global modules

즉시 사용할 수 있는 프로바이더 집합(ex 헬퍼, DB 연결 등) 을 제공하려면 `@Global()` 데코레이터를 사용하여 전역 모듈을 만든다.

```tsx
import { Module, Global } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Global()
@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService],
})
export class CatsModule {}
```

`@Global()` 데코레이터는 모듈을 전역 범위로 만든다. 이 전역 모듈은 일반적으로 루트 또는 코어 모듈에 한번만 등록해야 한다. 위의 예제에서 `CatsService` 는 어디에든 접근 가능하며 다른 모듈에서 `imports` 를 해서 모듈을 가져올 필요가 없다.

### Dynamic modules

Nest 모듈 시스템에서 동적 모듈이라는 기능이 있다. 이 기능을 사용하면 프로바이더를 동적으로 등록하고 구성할 수 있는 커스텀 가능한 모듈을 쉽게 만들 수 있다. 추후에 자세하게 다룸.

다음 코드는 `DatabaseModule` 에 대한 동적 모듈 정의의 예시이다.

```tsx
import { Module, DynamicModule } from "@nestjs/common";
import { createDatabaseProviders } from "./database.providers";
import { Connection } from "./connection.provider";

@Module({
    providers: [Connection],
})
export class DatabaseModule {
    static forRoot(entities = [], options?): DynamicModule {
        const providers = createDatabaseProviders(options, entities);
        return {
            module: DatabaseModule,
            providers: providers,
            exports: providers,
        };
    }
}
```

`forRoot` 메소드는 동기식 또는 비동기식으로 동적 모듈을 반환할 수 있다.

위 코드에서 provider 로 Connection을 정의하지만 추가로 `forRoot()` 메소드에 전달된 entities 및 option에 따라 저장소 와 같은 프로바이더를 추가로 제공함., 이 방식은 기본 모듈을 재정의하는것이 아닌 확장하는 방식이다.

전역 범위에 동적 모듈을 등록하려면 `global` 속성을 `true` 로 설정한다.

```tsx
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

위의 `DatabaseModule` 은 다음과 같은 방식으로 가져오고 구성할 수 있다.

```tsx
import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { User } from "./users/entities/user.entity";

@Module({
    imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

또한 다시 내보낼때는 `forRoot()` 을 생략 가능.

```tsx
exports: [DatabaseModule],
```
