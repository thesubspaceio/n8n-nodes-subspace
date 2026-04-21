import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { companyDescription } from './resources/company';

export class Subspace implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Subspace',
		name: 'subspace',
		icon: { light: 'file:../../icons/subspace.svg', dark: 'file:../../icons/subspace.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Operational company intelligence from DNS, HTTP, and ATS forensics. 88+ fields per domain — no LinkedIn dependency.',
		defaults: {
			name: 'Subspace',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'subspaceApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://www.thesubspace.io',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
					},
				],
				default: 'company',
			},
			...companyDescription,
		],
	};
}
