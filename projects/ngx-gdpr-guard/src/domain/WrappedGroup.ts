import {
	GdprGuard,
	GdprGuardGroup,
	GdprGuardGroupRaw,
	GdprStorage,
} from 'gdpr-guard';
import { WrappedGuard } from './WrappedGuard';

export class WrappedGroup extends GdprGuardGroup {
	constructor(
		private delegate: GdprGuardGroup,
		private triggerChange: () => void
	) {
		super(
			delegate.name,
			delegate.description,
			delegate.enabled,
			delegate.required
		);
	}

	override addGuard(guard: GdprGuard): GdprGuardGroup {
		this.delegate.addGuard(guard);
		this.triggerChange();
		return this;
	}

	override disable(): GdprGuardGroup {
		this.delegate.disable();
		this.triggerChange();
		return this;
	}

	override disableForStorage(type: GdprStorage): GdprGuardGroup {
		this.delegate.disableForStorage(type);
		this.triggerChange();
		return this;
	}

	override enable(): GdprGuardGroup {
		this.delegate.enable();
		this.triggerChange();
		return this;
	}

	override enableForStorage(type: GdprStorage): GdprGuardGroup {
		this.delegate.enableForStorage(type);
		this.triggerChange();
		return this;
	}

	override getGuard(name: string): GdprGuard | null {
		const guard = this.delegate.getGuard(name);
		return guard ? new WrappedGuard(guard, this.triggerChange) : null;
	}

	override getGuards(): GdprGuard[] {
		return this.delegate
			.getGuards()
			.map((guard) => new WrappedGuard(guard, this.triggerChange));
	}

	override hasGuard(name: string): boolean {
		return this.delegate.hasGuard(name);
	}

	override isEnabled(name: string): boolean {
		return this.delegate.isEnabled(name);
	}

	override makeRequired(): GdprGuardGroup {
		this.delegate.makeRequired();
		this.triggerChange();
		return this;
	}

	override raw(): GdprGuardGroupRaw {
		return this.delegate.raw();
	}

	override toggle(): GdprGuardGroup {
		this.delegate.toggle();
		this.triggerChange();
		return this;
	}

	override toggleForStorage(type: GdprStorage): GdprGuardGroup {
		this.delegate.toggleForStorage(type);
		this.triggerChange();
		return this;
	}
}
