## Providers

<img width="809" alt="스크린샷 2021-08-13 오후 5 54 28" src="https://user-images.githubusercontent.com/28949213/129331909-a52ec557-aee6-4067-b139-c0b764d9c358.png">

대부분의 기본 Nest 클래스인 서비스, 레포지토리, 팩토리, 헬퍼 등은 프로바이더로 취급될 수 있다. **프로바이더의 주요 아이디어는 종속성 주입이다. → 객체를 서로 다양한 관계를 형성,** 그 인스턴스를 연결하는 것은 Nest 런타임때 실행됨.

컨트롤러는 HTTP 요청을 처리하고 더 복잡한 작업은 프로바이더에게 넘겨야 한다. 이 작업은 모듈에서 `provider` 로 선언된 클래스이다.

### Services

간단한 서비스 코드를 만들어보자, 이 서비스는 데이터 저장 및 검색을 담당한다.

```tsx
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [];

    create(cat: Cat) {
        this.cats.push(cat);
    }

    findAll(): Cat[] {
        return this.cats;
    }
}
```

`@Injectable` 데코레이터는 `CatsService` 가 Nest IoC 컨테이너에서 관리할 수 있는 클래스임을 선언하는 메타데이터를 첨부한다.

```tsx
interfaces / cat.interface.ts;
export interface Cat {
    name: string;
    age: number;
    breed: string;
}
```

이제 위에서 작성한 것을 컨트롤러에 적용시켜보자.

```tsx
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.to";

@Controller("cats")
export class CatsController {
    constructor(private catsService: CatsService) {}

    @Post()
    async create(@Body() createCatDto: CreateCatDto) {
        this.catsService.create(createCatDto);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }
}
```

위에서 작성한 Service는 생성자를 통해 주입된다.

### Dependency injection

Nest는 일반적으로 종속성 주입으로 알려진 디자인 패턴을 기반으로 구축됨.

-   [https://angular.io/guide/dependency-injection](https://angular.io/guide/dependency-injection) ← 종석성 주입 패턴 설명

```tsx
constructor(private catsService: CatsService) {}
```

Nest는 `CatsService` 의 인스턴스를 만들고 반환한다 이때 종속성이 주입되어 컨트롤러의 생성자로 전달된다

### Scopes

프로바이더는 일반적으로 애플리케이션 수명주기와 동기화된 수명(Scope)를 갖는다. 애플리케이션이 부트스트랩 되면 모든 종속성을 해결해야하므로 모든 프로바이더를 인스턴스화 해야 하는데 애플리케이션이 종료되면 각 프로바이더가 삭제된다. 그러나 프로바이더의 수명을 요청 범위로 만드는 방법이 있는데 추후에 배움.

### Custom providers

Nest에는 프로바이더간의 관계를 해결하는 내장된 IoC 컨테이너가 있다. 이 기능은 위에서 설명한 종속성 주입 기능의 기본이다. 이후 커스텀 하는 방법도 있는데 추후에 배운다.

### Optional providers

경우에 따라 반드시 해결하지 않아도 되는 종속성이 있다. 예를들어 클래스는 구성 객체에 종속될 수 있지만 전달되는 것이 없으면 기본값으로 사용해야 한다. 이럴 경우 구성 프로바이더가 없어도 오류가 발생하지 않으므로 종속성이 선택사항이 된다.

이때 `@Optional()` 데코레이터를 사용한다.

```tsx
import { Injectable, Optional, Inject } from "@nestjs/common";

@Injectable()
export class HttpService<T> {
    constructor(@Optional() @Inject("HTTP_OPTIONS") private httpClient: T) {}
}
```

### Property-based injection

지금까지 작성한 방법은 생산자 기반으로 종속성을 주입한 방식이다. 프로바이더는 생산자 메서드를 통해 주입되기 때문이다. 하지만 특정한 경우 속성 기반으로 주입할 수 있다.

예를들어 최상위 클래스가 하나 또는 여러 프로바이더에 의존하는 경우 생산자의 하위 클래스에서 `super()` 를 호출하여 모든 프로바이더를 전달하기 보다는 `@Inject()` 데코레이터를 사용 가능.

```tsx
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class HttpService<T> {
    @Inject("HTTP_OPTIONS")
    private readonly httpClient: T;
}
```

### Provider registration

이제 위에서 작성한 서비스 코드의 종속성을 주입할 수 있게 Nest에 등록해야 한다. 모듈 파일에 이를 추가한다.

```tsx
import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService],
})
export class AppModule {}
```
