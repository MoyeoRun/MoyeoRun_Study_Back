### First Step

### Language

    Nest js 에서는 기본적으로 TypeScript로 적용, JavaScript와도 호환이 된다.

### Prerequisties

    운영체제에 Nodejs가 설치되있어야 하고 10.13버전 이상, v13 버전을 제외한 버전이여야 한다!

## Set Up

**`Nest CLI`** 을 사용해서 새 프로젝트를 쉽게 시작 가능하다.

```bash
npm i -g @nestjs/cli
nest new project-name
```

`project-name` 디렉토리 안에는 다음과 같은 구조이다.

```
src
	|- app.controller.spec.ts// 컨트롤러를 위한 유닛 테스트
	|- app.controller.ts     // 하나의 라우트가 있는 기본 컨트롤러
	|- app.module.ts         // 애플리케이션 루트 모듈
	|- app.service.ts        // 단일 메소드를 사용하는 기본 서비스
	|- main.ts               // 핵심기능 NestFactory를 사용하여 Nest 애플리케이션 인스턴스를
                             // 생성하는 애플리케이션의 엔트리파일.
```

`main.ts` 에는 애플리케이션을 시작 , 부트스트랩 하는 비동기 함수가 포함된다.

```TypeScript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

Nest에서 인스턴스를 생성하기 위해 `NestFactory` 클래스를 사용한다. 이것은 정적 메소드를 지원하는데 위 코드에서 `create()` 는 `INestApplication` 인터페이스를 충족하는 애플리케이션 객체를 반환한다.

위의 `main.ts` 예제에서 HTTP 리스너를 시작하면 애플리케이션이 인바운드 HTTP 요청을 기다린다.

`Nest CLI` 로 구축된 프로젝트는 개발자가 각 모듈을 자체 전용 디렉토리에 보관하는 규칙을 따르도록 권장하는 초기 프로젝트 구조를 생성한다.

## Platform

기술적으로 Nest는 어댑터가 생성되면 모든 Node HTTP 프레임워크에서 작동할 수 있다. 기본적으로 제공되는 HTTP 플랫폼은 `express` , `fastify` 이다.

-   `platform-express` → 기본적으로 `@nestjs/platform-express` 패키지가 사용된다.
-   `platform-fastify` → 최대 효율성과 속도를 제공하는데 중점으로 둔 고성능및 낮은 오버헤드의 프레임워크

어떤 플랫폼을 사용하는 각각 자체 인터페이스를 제공하는데 각각 `NestExpressApplication` , `NestFastifyApplication` 으로 표시된다.

```tsx
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

위 예제와 같이 NestFactory.create 메소드에 전달하게 되면 `app` 객체는 해당 특정 플랫폼에서만 사용 할 수있는 메소드를 갖게 된다. 그러나 실제로 기본 플랫폼 API에 엑세스 하려는 경우를 제외하고는 유형을 지정할 필요는 없다.

## Running the application

```bash
$ npm run start
```

이 명령어는 `src/main.ts` 에 정의된 포트로 시작하는 HTTP 앱 서버를 시작한다.
