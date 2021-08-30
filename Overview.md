# Nest.js 기초

Nest의 핵심 기본 사항에 대해서 배워보자! Nest CLI를 사용하면 아주 쉽게 프로젝트 세팅이 가능하다.

```shell
$ npm i -g @nestjs/cli
$ nest new {프로젝트명}
```

CLI를 통해 생성된 프로젝트의 src/ 구조는 main, module, controller, service, test로 나뉜다. 자세한 내용은 밑에서 다룬다.

- Main : 핵심 기능인 NestFactory를 사용하여 Nest 애플리케이션 인스턴스를 생성하는 어플리케이션 엔트리 파일
- Module : 애플리케이션 루트 모듈
- Controller : 하나의 라우트가 있는 기본 컨트롤러
- Service : 단일 메소드를 사용하는 기본 서비스

## 서버 실행
```typescript
const app = await NestFactory.create(AppModule);
await app.listen(3000);
```

create()는 INestApplication 인터페이스를 구현한 객체를 리턴한다. 이후 listen해주면 된다. port만 적어주면 host는 기본으로 localhost가 된다.

## Controllers
컨트롤러는 Request를 처리하고 Response하는 역할을 담당합니다. Express의 app.Router() 역할을 @Controller() 데코레이터가 해준다. 컨트롤러는 클래스로 작성하면 된다. 이때 `nest g resource [name]`을 사용하면 controller, service, module 등 CRUD 도메인이 생성된다.

### Routing
Path 세팅을 해줄 때 /를 쓰지 않아도 된다. 즉 /cats로  라우팅을 하고 싶다면 @Controller('cats')라고 작성하면 된다. 각각 CRUD에 맞는 HTTP Request Method 데코레이터들도 존재한다. GET /cats/profile를 핸들링하고 싶다면 이전에 작성한 컨트롤러 데코레이터가 붙은 클래스 안에 @Get('profile') 데코레이터가 붙은 메소드를 작성해주면 된다.

### Request object
HTTP Request Message를 파싱하는 여러 시나리오가 존재한다.
- @Request(), @Req() : req
- @Response(), @Res() : res
- @Next() : next
- @Session() : req.session
- @Param(key?: string) : req.params / req.params[key]
- @Body(key?: string) : req.body / req.body[key]
- @Query(key?: string) : req.query / req.query[key]
- @Headers(name?: string) : req.query / req.query[key]
- @Ip() : req.ip
- @HostParam() : req.hosts

### Status code
기본적으로 201인 POST 요청을 제외하고 응답 상태코드는 기본적으로 항상 200이다. 만약 Status code를 커스터마이징 하고 싶다면 메소드에 @HttpCode(xxx) 데코레이터를 추가하면 된다.

하지만 서버 결과값에 따라 응답값이 바뀔 수 있는데, 이 부분을 커스터마이징 하려면 응답 객체를 사용해야 한다. 응답 객체는 @Res()를 사용하여 주입해서 사용하면 된다.

### Header
커스텀 응답헤더는 @Header() 데코레이터 또는 라이브러리별 응답 객체를 사용할 수 있다. express에서 res.header()를 호출하는 것과 동일하게 동작한다. 동적인 값을 Header에 추가하고 싶다면 res.header()를 호출하면 된다.

### Redirection
특정 URL로 리다이렉션하려면 @Redirect() 데코레이터를 사용하면 된다. Redirection은 동적으로 처리해주는 방식이 특이한데, return 하는 객체의 키 값이 url, statusCode로 이루어져 있으면 된다.

### Route parameters
Path Variable을 받아오기 위해서는 메소드에 @Param() 데코레이터를 사용해 받아올 수 있다. 이는 매개 변수를 req.params로 장식하는데 사용된다. 데코레이터 안에 매개 변수를 작성하면 특정 Path Variable을 받아올 수 있다. Next에서는 이 Path Variable을 라우트 매개변수 토큰이라고 부른다.

