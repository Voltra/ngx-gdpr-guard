import { Inject, Injectable, InjectionToken } from "@angular/core";
import {
	GdprGuard,
	GdprGuardGroup,
	GdprManager,
	GdprManagerEventHub,
	GdprManagerFactory,
	GdprManagerRaw,
	GdprSavior,
} from "gdpr-guard";
import { GdprManagerStream } from "../domain/GdprManagerStream";
import { distinctUntilChanged, filter, map, Observable } from "rxjs";
import deepEquals from "fast-deep-equal";
import { FailedToDiscard, FailedToSave } from "../domain/exceptions";

export const GDPR_MANAGER_FACTORY_TOKEN =
	new InjectionToken<GdprManagerFactory>(
		"ngx-gdpr-guard: NgxGdprGuardService#factory",
	);

export const GDPR_SAVIOR_TOKEN = new InjectionToken<GdprSavior>(
	"ngx-gdpr-guard: NgxGdprGuardService#savior",
);

@Injectable({
	providedIn: "root",
})
export class NgxGdprGuardService {
	private _managerStream: GdprManagerStream;

	/**
	 * Observable that emits the raw representation of the manager (on change)
	 */
	public readonly manager$: Observable<GdprManagerRaw>;

	/**
	 * Observable that emits the event hub of the manager (on change)
	 */
	public readonly events$: Observable<GdprManagerEventHub>;

	constructor(
		@Inject(GDPR_MANAGER_FACTORY_TOKEN) factory: GdprManagerFactory,
		@Inject(GDPR_SAVIOR_TOKEN) savior: GdprSavior,
	) {
		this._managerStream = new GdprManagerStream(factory, savior);

		this.manager$ = this.lens((manager) => manager.raw());
		this.events$ = this.lens(manager => manager.events);
	}

	/**
	 * Observable that emits the "new" manager on change.
	 * The instance is a wrapped {@link GdprManager} whose mutating method properly
	 * tracks changes (even {@link GdprGuardGroup} and {@link GdprGuard} methods when retrieved from the manager with something like `GdprManager#getGuard`)
	 */
	public get controller$() {
		return this._managerStream.controller$;
	}

	/**
	 * Get access to the underlying {@link GdprSavior} wrapper
	 */
	public getSavior(): GdprSavior {
		return this._managerStream.gdprSavior;
	}

	/**
	 * Saves the given manager's state
	 * @param manager - The manager to persist
	 * @throws {FailedToSave} if the data wasn't stored
	 */
	public save = async (manager: GdprManager): Promise<true> => {
		const didStore = await this.getSavior().store(manager.raw());

		if (!didStore) {
			throw new FailedToSave();
		} else {
			return didStore;
		}
	};

	/**
	 * Discards the changes to the manager's state
	 * @param manager - The manager to persist
	 * @throws {FailedToDiscard} if the data wasn't stored
	 */
	public discard = async (manager: GdprManager): Promise<true> => {
		const didStore = await this.getSavior().storeIfNotExists(manager.raw());

		if (!didStore) {
			throw new FailedToDiscard();
		} else {
			return didStore;
		}
	};

	/**
	 * Get a lens to manager-dependent data
	 * @param extractor - The function used to extract the desired data from the GDPR Manager
	 * @note Use {@link NgxGdprGuardService#manager$} if you want access to the raw representation of the data
	 */
	public lens<T>(extractor: (manager: GdprManager) => T): Observable<T> {
		return this._managerStream.controller$.pipe(
			map(extractor),
			distinctUntilChanged(deepEquals),
		);
	}

	/**
	 * Get a lens to the desired guard. Using mutating methods on the instances will properly propagate changes.
	 * @param guardName - The name of the guard in the manager's tree hierarchy
	 */
	public guardLensFor(guardName: string): Observable<GdprGuard | null> {
		return this.lens((manager) => manager.getGuard(guardName));
	}

	/**
	 * Get a lens to the desired group. Using mutating methods on the instances will properly propagate changes.
	 * @param groupName - The name of the group in the manager's tree hierarchy
	 */
	public groupLensFor(groupName: string): Observable<GdprGuardGroup | null> {
		return this.lens((manager) => manager.getGroup(groupName));
	}

	/**
	 * Get a lens to the desired guard, skipping null values. Using mutating methods on the instances will properly propagate changes.
	 * @param guardName - The name of the guard in the manager's tree hierarchy
	 * @warning The observable may never emit values
	 */
	public nonNullGuardLensFor(guardName: string): Observable<GdprGuard> {
		return this.guardLensFor(guardName).pipe(
			filter((guard): guard is GdprGuard => guard !== null),
		);
	}

	/**
	 * Get a lens to the desired group, skipping null values. Using mutating methods on the instances will properly propagate changes.
	 * @param groupName - The name of the group in the manager's tree hierarchy
	 * @warning The observable may never emit values
	 */
	public nonNullGroupLensFor(groupName: string): Observable<GdprGuardGroup> {
		return this.groupLensFor(groupName).pipe(
			filter((guard): guard is GdprGuardGroup => guard !== null),
		);
	}
}
