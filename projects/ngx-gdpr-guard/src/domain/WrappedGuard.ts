import { GdprGuard, GdprGuardRaw, GdprStorage } from 'gdpr-guard';

export class WrappedGuard implements GdprGuard {
	constructor(
		private delegate: GdprGuard,
		private triggerChange: () => void
	) {}

	get name() {
		return this.delegate.name;
	}
	get enabled() {
		return this.delegate.enabled;
	}
	get description() {
		return this.delegate.description;
	}
	get storage() {
		return this.delegate.storage;
	}
	get required() {
		return this.delegate.required;
	}

	isEnabled(name: string): boolean {
		return this.delegate.isEnabled(name);
	}

	enable(): GdprGuard {
		this.delegate.enable();
		this.triggerChange();
		return this;
	}

	disable(): GdprGuard {
		this.delegate.disable();
		this.triggerChange();
		return this;
	}

	toggle(): GdprGuard {
		this.delegate.toggle();
		this.triggerChange();
		return this;
	}

	makeRequired(): GdprGuard {
		this.delegate.makeRequired();
		this.triggerChange();
		return this;
	}

	enableForStorage(type: GdprStorage): GdprGuard {
		this.delegate.enableForStorage(type);
		this.triggerChange();
		return this;
	}

	disableForStorage(type: GdprStorage): GdprGuard {
		this.delegate.disableForStorage(type);
		this.triggerChange();
		return this;
	}

	toggleForStorage(type: GdprStorage): GdprGuard {
		this.delegate.toggleForStorage(type);
		this.triggerChange();
		return this;
	}

	raw(): GdprGuardRaw {
		return this.delegate.raw();
	}
}
