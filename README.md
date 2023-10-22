# ngx-gdpr-guard

<center><img src="https://github.com/Voltra/ngx-gdpr-guard/raw/master/ngx-gdpr-guard.png" alt="Logo" width="250px"/></center>

Angular library to use [gdpr-guard](https://www.npmjs.com/package/gdpr-guard) as efficiently and easily as possible

## Installation

```bash
npm i -S ngx-gdpr-guard
```

## Setup

You'll need both a `GdprManagerFactory` and a `GdprSavior`.

> NOTE: The recommended gdpr savior library is [`gdpr-guard-local`](https://www.npmjs.com/package/gdpr-guard-local) which uses local storage by default, but can be customized to use anything.

You can use a very basic `GdprManagerFactory` using the `GdprManagerBuilder` as follows:

```ts
import { GdprManagerBuilder, GdprManagerFactory } from "gdpr-guard";

const managerFactory: GdprManagerFactory = () => GdprManagerBuilder.make()
	/* [...] */
	.build();
```

There's an injection token for both the factory and the savior:

```ts
import { GDPR_MANAGER_FACTORY_TOKEN, GDPR_SAVIOR_TOKEN } from "ngx-gdpr-guard";

const providers = [
	{ provide: GDPR_MANAGER_FACTORY_TOKEN, /* [...] */ },
	{ provide: GDPR_SAVIOR_TOKEN, /* [...] */ },
];
```

With these providers in scope, you can inject the `NgxGdprGuardService`:

```ts
import { NgModule } from "@angular/core";
import { NgxGdprGuardService } from "ngx-gdpr-guard";

@NgModule({
	declarations: [],
	imports: [],
	exports: [],
})
export class MyModule {
	constructor(private ngxGdprGuard: NgxGdprGuardService) {
	}
}
```
