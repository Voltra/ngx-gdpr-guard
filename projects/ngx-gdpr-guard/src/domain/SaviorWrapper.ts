import {
	GdprManager,
	GdprManagerFactory,
	GdprManagerRaw,
	GdprSavior,
	GdprSaviorAdapter,
} from 'gdpr-guard';
import { ManagerWrapper } from './ManagerWrapper';

export class SaviorWrapper extends GdprSaviorAdapter {
	constructor(private wrapper: ManagerWrapper, private savior: GdprSavior) {
		super();
	}

	override async updateSharedManager(manager: GdprManager): Promise<void> {
		await this.savior.updateSharedManager(manager);

		this.wrapper.hotswap(manager);
	}

	////

	override check(): Promise<void> {
		return this.savior.check();
	}

	override exists(shouldUpdate = true): Promise<boolean> {
		return this.savior.exists(shouldUpdate);
	}

	override restore(shouldUpdate = true): Promise<GdprManager | null> {
		return this.savior.restore(shouldUpdate);
	}

	override restoreOrCreate(
		factory: GdprManagerFactory
	): Promise<GdprManager> {
		return this.savior.restoreOrCreate(factory);
	}

	override store(manager: GdprManagerRaw): Promise<boolean> {
		return this.savior.store(manager);
	}

	override storeIfNotExists(manager: GdprManagerRaw): Promise<boolean> {
		return this.savior.storeIfNotExists(manager);
	}
}
