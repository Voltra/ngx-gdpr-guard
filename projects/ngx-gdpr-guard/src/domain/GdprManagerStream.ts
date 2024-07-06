import { GdprManager, GdprManagerFactory, GdprSavior } from 'gdpr-guard';
import { Observable, ReplaySubject } from "rxjs";
import { ManagerWrapper } from './ManagerWrapper';
import { SaviorWrapper } from './SaviorWrapper';

export class GdprManagerStream extends ReplaySubject<GdprManager> {
	public readonly controller$: Observable<GdprManager>;
	public readonly gdprSavior: GdprSavior;
	public readonly wrapper: ManagerWrapper;
	private _bootPromise: Promise<void>;

	constructor(private factory: GdprManagerFactory, savior: GdprSavior) {
		super(1);

		this.wrapper = new ManagerWrapper(this, GdprManager.create([]));
		this.gdprSavior = new SaviorWrapper(this.wrapper, savior);

		this.controller$ = this.pipe();

		this._bootPromise = this._boot();
	}

	private async _boot() {
		const manager = await this.gdprSavior.restoreOrCreate(this.factory);

		await this.gdprSavior.updateSharedManager(manager);
	}
}
