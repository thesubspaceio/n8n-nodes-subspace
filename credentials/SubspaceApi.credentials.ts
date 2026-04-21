import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SubspaceApi implements ICredentialType {
	name = 'subspaceApi';

	displayName = 'Subspace API';

	icon: Icon = { light: 'file:../icons/subspace.svg', dark: 'file:../icons/subspace.dark.svg' };

	documentationUrl = 'https://www.thesubspace.io/docs/api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'Your Subspace API key. Generate one at https://www.thesubspace.io/settings — free during beta.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.thesubspace.io',
			url: '/api/v1/enrich',
			qs: { domain: 'stripe.com' },
			method: 'GET',
		},
	};
}
