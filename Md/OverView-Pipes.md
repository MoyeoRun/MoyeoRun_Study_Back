## Pipes

파이프는 `@Injectable()` 데코레이터로 적용한 클래스이다. 파이프는 `PipeTransform` 인터페이스를 구현해야 한다.

<img width="811" alt="스크린샷 2021-08-13 오후 7 11 20" src="https://user-images.githubusercontent.com/28949213/129341831-706617b9-4ee5-4d9a-b4e3-d9649a4b76b3.png">

파이프는 2가지 경우로 사용한다.

-   변환(transformation) : 입력 데이터를 원하는 형식으로 변환
-   유효성 검사(validation) : 입력 데이터를 평가하고 유효한 경우 변경하지 않고 전달한다. 그렇지 않으면 데이터가 올바르지 않을때 예외를 발생시킨다.

위 두 경우 모두 컨트롤러 라우트 핸들러가 처리하는 arguments 에서 작동한다. Nest는 메소드가 호출되기 직전에 파이프를 삽입하고, 파이프는 메소드로 향하는 인수를 수신하고 작동한다. 모든 파이프 작업은 이 시간에 작동하며 그 후 라우터 핸들러가 변환된 인수와 함께 호출된다.

### Built-in pipes

Nest에서는 즉시 사용할 수 있는 6개의 파이프 제공

-   `ValidationPipe`
-   `ParseIntPipe`
-   `ParseBoolPipe`
-   `ParseArrayPipe`
-   `ParseUUIDPipe`
-   `DefaultValuePipe`

모두 `@nestjs/common` 에서 제공.

`ParseIntPipe` 로 예시를 들으면 이 파이프는 메소드 핸들러 매개변수가 자바스크립트 정수로 변환되도록 하는 변환 사용 사례의 예이다.

### Binding pipes

```tsx
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

위처럼 적용 가능,

만약 `GET localhost:3000/ab` 이렇게 접근을 하면

```tsx
{
    "statusCode": 400,
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request"
}
```

이렇게 답을 옴, `findOne()` 메서드가 실행되기 전에, Pipe 에서 에러를 발생시킴.

```tsx
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

```tsx
{
    "statusCode": 406,
    "message": "Validation failed (numeric string is expected)",
    "error": "Not Acceptable"
}
```

이렇게 에러 상태코드를 변경 가능.

### Custom pipes

커스텀 파이프도 만들 수 있다.

```tsx
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        return value;
    }
}
```

> `PipeTransfrom<T,R>` 은 파이프로 구현해야하는 인터페이스이다. `<T>` 을 사용하여 입력 value를 `R` 을 사용해서 transform() 메소드의 반환유형을 나타낸다.

모든 파이프는 `transform()` 메소드를 구현해야 한다. 이 메소드는 2개의 매개변수가 있다.

-   value → 현재 처리된 메서드의 인수(라우터 치리 메서드에 의해 수신되기 전)
-   metadata → 현재 처리된 메서드 인수의 메타데이터

메타데이터 객체에는 다음 속성이 있다.

```tsx
export interface ArgumentMetadata {
    type: "body" | "query" | "param" | "custom";
    metatype?: Type<unknown>;
    data?: string;
}
```

-   type → 인수가 `@Body` , `@Query()` , `@Params()` 또는 커스텀인지 여부를 나타냄.
-   metatype → 인수의 메타 타입 정의
-   data → 데코레이터에 전달된 문자열 (ex `@Body('string')` , 데코레이터 괄호가 빈칸이면 정의되지않음.

### Schema based validation

`CatsController` 의 `create()` 메소드를 살펴보면 서비스 메소드 실행 전에 createCatDto가 유용한지 확인하려고 할때

```tsx
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

create 메소드로 들어오는 데이터를 확인할때 ,라우트 핸들러 메소드에서 이를 수행하는것은 SRP 위반하므로 이상적이지 않다.

유효성 검사기 클래스를 만들고 여기에 적용시킬때. 각 메서드의 시작 부분에서 이거를 호출시켜야 한다는 단점이 있다.

미들웨어를 적용시키는것은 작동할 수는 있으나 모든 컨텍스트를 사용할 수 있는 일반 미들웨어를 만드는것은 불 가능하다. → 그래서 파이프를 사용한다.

### Object schema validation

객체를 유효성 검사를 할때, `Joi` 라이브러리를 사용해 스키마 기반으로 유효성 검사하는 방식이 있다.

```jsx
npm i joi
npm i -D @types/joi
```

```tsx
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from "@nestjs/common";
import { ObjectSchema } from "joi";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new BadRequestException("Validation failed");
        }
        return value;
    }
}
```

스키마를 생성자의 인자로 사용하는 간단한 클래스를 만든다.

제공된 스키마에 대해 유효성 검사를 하는 `schema.validate()` 를 적용한다.

→ 유효성 검사 파이프는 값을 변경하지 않고 에러를 발생시키거나 반환한다.

### Binding validation pipes

```tsx
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

위에는 메소드 호출할때 바인드를 하려면 다음의 과정을 거친다.

1. `JoiValidationPipe` 의 인스턴스를 생성
2. 이 파이프의 클래스 생성자에 컨텍스트별 Joi 스키마를 전달한다.
3. 파이프를 메서드에 바인딩한다.

위 Validation Pipe는 `@UsePipes` 를 통해 사용 가능하다.

---

### Class validator

`class validator` 라이브러리를 사용해서 데코레이터 기반 유효성 검사를 할 수 있음.

데코레이터 기반 → 처리된 속성의 `metatype` 에 엑세스 할 수 있으므로 Nest의 파이프 기능과 결합할 때 유용하다.

```bash
npm i --save class-validator class-transformer
```

이걸 설치하면 `CreateCatDto` 클래스에 데코레이터를 추가할 수 있다.

```tsx
import { IsString, IsInt } from "class-validator";

export class CreateCatDto {
    @IsString()
    name: string;

    @IsInt()
    age: number;

    @IsString()
    breed: string;
}
```

그리고 새로운 커스텀 파이프를 만들 수 있다.

```tsx
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException("Validation failed");
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
```

-   `ValidationPipe` 라는 커스텀 파이프를 만든다.
-   `transform` 메소드가 비동기로 처리됨, → 일부 `class-validator` 의 유효성 검사가 비동기화 될 수 있기에 이 메서드를 `async` 로 만든다.
-   ArgumentMetadata 에서 `metatype` 을 구조분해 할당으로 가져옴.
-   `if (!metatype || !this.toValidate(metatype))` → 데이터를 안 주는 경우, GET, paramss가 없거나 query가 없는 .. 순수 js가 실행되는 경우를 파이프에서 제외한다.
    이러한 인자들은 유효성 검사 데코레이터를 연결할 수 없으므로 유효성 검사 단계에서 제외한다.
-   클래스 변환기 `plainToClass()` 를 사용해 일반 Js 객체를 타입이 지정된 객체로 변환해 유효성 검사를 적용시킬 수 있게 한다. 이 작업을 하는 이유는 네트워크 요청으로 받는 post의 body 객체는 아무 타입 정보도 가지고 있기 않기 때문에 클래스 유효성 검사기는 이전에 DTO에 대해 정의한 유효성 검사 데코레이터를 사용해야 하므로 바닐라 객체가 아닌 적절한 객체로 반환한다.
-   변경되지 않은 값을 반환하거나 예외를 던진다.

```tsx
@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
```

이후 컨트롤러에 바인당 함.

이런 매개변수 범위 파이프는 유효성 검증 로직이 지정된 매개변수 하나만 관련될 때 유용합니다.

### Global scoped pipes

위 Pipe는 가능한 일반적으로 생성했기 때문에 모든 라우터 핸들러에 적용되도록 전역 범위 파이프로 설정 가능.

```tsx
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
```

의존성 주입을 위해서는 모듈에서 직접 전역 파이프로도 설정 가능하다.

```tsx
import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

@Module({
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule {}
```

### 내장 Validation Pipe

Nest에서 내장 Validation Pipe를 제공하므로 직접 만들 필요는 없다. 다른 장에서 좀더 자세하게 설명 한다.

### Transformation use case

커스텀 파이프는 유효성 검사에 사용하는 것 보다는 입력 데이터를 원하는 형식으로 변환할때 유용하다.

이는 `transform` 함수에서 반환된 값이 인수의 이전 값을 덮어쓰기 때문에 가능하다.

→ 클라에서 전달된 값이 라우터 핸들러 메소드에 의해 처리되기 전에 문자열을 정수로 변환하는 것과 같이 변경이 필요한 경우, 일부 필수 데이터가 필드가 누락된 경우 기본값을 적용할때 사용.

다음은 문자열을 정수값으로 파싱하는 간단한 `ParseIntPipe`입니다.(위에서 언급했듯이 Nest에는 더 정교한 내장 ParseIntPipe가 있습니다. 이를 커스텀 변환 파이프의 간단한 예로 포함합니다).

```tsx
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
...
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.catsService.findOne(id);
}
```

### Providing defaults

`pipe` 는 매개변수 값이 정의될 것으로 예상하기 때문에 null 또는 undefined 값을 받으면 예외가 발생합니다.
엔드포인트가 누락된 쿼리 문자열 배개변수 값을 처리할 수 있도록 하려면 `Parse*` 파이프가 이러한 값에 대해 작동하기 전에 삽입할 기본값을 제공해야 한다.

`DefaultValuePipe` 를 사용해서 해결 가능.

```tsx
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```
