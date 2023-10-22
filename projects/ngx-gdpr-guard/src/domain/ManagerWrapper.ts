import {
	GdprGuard,
	GdprGuardGroup,
	GdprManager,
	GdprManagerRaw,
	GdprStorage,
} from "gdpr-guard";
import { WrappedGuard } from './WrappedGuard';
import { WrappedGroup } from './WrappedGroup';
import type { GdprManagerStream } from './GdprManagerStream';

export class ManagerWrapper extends GdprManager {
	constructor(
		private stream: GdprManagerStream,
		private manager: GdprManager
	) {
		super();
		this.hotswap(manager, false);
	}

	hotswap(manager: GdprManager, triggerChange = true): GdprManager | null {
		const oldManager = this.manager;
		this.manager = manager;

		if (triggerChange) {
			this.triggerChange();
		}

		return oldManager || null;
	}

	private triggerChange = () => {
		this.stream.next(this);
	};

	////
	override closeBanner(): void {
		this.manager.closeBanner();
		this.triggerChange();
	}

	override disable(): GdprManager {
		this.manager.disable();
		this.triggerChange();
		return this;
	}

	override disableForStorage(type: GdprStorage): GdprManager {
		this.manager.disableForStorage(type);
		this.triggerChange();
		return this;
	}

	override enable(): GdprManager {
		this.manager.enable();
		this.triggerChange();
		return this;
	}

	override enableForStorage(type: GdprStorage): GdprManager {
		this.manager.enableForStorage(type);
		this.triggerChange();
		return this;
	}

	override getGroup(name: string): GdprGuardGroup | null {
		const group = this.manager.getGroup(name);

		if (!group) {
			return null;
		}

		return new WrappedGroup(group, this.triggerChange);
	}

	override getGroups(): GdprGuardGroup[] {
		return this.manager
			.getGroups()
			.map((group) => new WrappedGroup(group, this.triggerChange));
	}

	override getGuard(name: string): GdprGuard | null {
		const guard = this.manager.getGuard(name);

		if (!guard) {
			return null;
		}

		return new WrappedGuard(guard, this.triggerChange);
	}

	override hasGroup(name: string): boolean {
		return this.manager.hasGroup(name);
	}

	override hasGuard(name: string): boolean {
		return this.manager.hasGuard(name);
	}

	override isEnabled(name: string): boolean {
		return this.manager.isEnabled(name);
	}

	override makeRequired(): GdprManager {
		this.manager.makeRequired();
		this.triggerChange();
		return this;
	}

	override raw(): GdprManagerRaw {
		return this.manager.raw();
	}

	override resetAndShowBanner(): void {
		this.manager.resetAndShowBanner();
		this.triggerChange();
	}

	override toggle(): GdprManager {
		this.manager.toggle();
		this.triggerChange();
		return this;
	}

	override toggleForStorage(type: GdprStorage): GdprManager {
		this.manager.toggleForStorage(type);
		this.triggerChange();
		return this;
	}
}
