export class NgxGdprGuardError extends Error {
	constructor(errMsg?: string, options?: ErrorOptions) {
		super(errMsg, options);
	}
}

export class FailedToSave extends NgxGdprGuardError {
	constructor(errMsg = 'Failed to save GDPR preferences', options = {}) {
		super(errMsg, options);
	}
}

export class FailedToDiscard extends NgxGdprGuardError {
	constructor(
		errMsg = 'Failed to discard changes to GDPR preferences',
		options = {}
	) {
		super(errMsg, options);
	}
}
